<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Wiki Articles Revisions
 */
add_shortcode( 'wiki_articles_revisions', 'wiki_articles_revisions_func' );
function wiki_articles_revisions_func( $attributes, $content ) {
    // get all posts
    $wiki_articles = get_posts([
        'post_type' => 'wiki_article',
        'posts_per_page' => -1,
        'orderby' => 'modified',
        'order' => 'DESC'
    ]);

    // get all revisions for each post
    $revisions = [];
    foreach ($wiki_articles as $post_id) {
        $revisions = array_merge($revisions, wp_get_post_revisions($post_id));   
    }

    // order revisions by date
    usort($revisions, function($a, $b) {
        return strtotime($b->post_date) - strtotime($a->post_date);
    });
    
    // get last users
    $max_count = 7;
    $excluded_authors_by_username = [/* 'daniel.hoegel', 'daniel-mitarbeiter' */];
    $dates_by_user = [];
	$results = [];

	foreach($revisions as $post_id => $rev) {
        // get user
        $author_id = $rev->post_author;
        $author =  get_userdata($author_id);
        $username = $author->user_login;
        
        // excluded specific users like revisors or admins
        if (in_array($username, $excluded_authors_by_username)) {
            continue;
        }
        
        // get date and time
        $timestamp = strtotime($rev->post_date);
        $date = date('d.m.Y', $timestamp);
        $time = date('H:i', $timestamp);
        
        // only show one entry for each user at the same day
        if (isset($dates_by_user[$username]) && in_array($date, $dates_by_user[$username])) {
            continue;
        }
        
        // create html string
        $name = $author->display_name;
        $title = $rev->post_title;
        $max_len = 68;
        $title_shortened = trim(substr($title, 0, $max_len)) . (strlen($title) > $max_len ? '&hellip;' : '');
        $permalink = get_permalink($rev->post_parent);
        $html_string = "
            <span class='wiki-articles-revision'>
                <span class='author'>$name</span>&nbsp;
                am $date um $time Uhr&nbsp;
                (<a href='$permalink'>$title_shortened</a>)
            </span>
        ";
        array_push($results, $html_string);

        // store dates by username to exclude multiple edits on the same day
        if (isset($dates_by_user[$username])) {
            array_push($dates_by_user[$username], $date);
        } else {
            $dates_by_user[$username] = [$date];
        }
        
        // break if max count is reached
		if (count($results) >= $max_count) {
            break;
        }
    }
    
    $final_html_string = "
        <div class='wiki-articles-revisions'>
            " . join(',<br />', $results) . "
        </div>
    ";
	
	return $final_html_string;
}
