<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Berlin Manifesto revision authors and dates
 */
add_shortcode( 'berlin_manifesto_revisions', 'berlin_manifesto_revisions_func' );
function berlin_manifesto_revisions_func( $attributes, $content ){
    $POST_ID = 2296; // berlin-manifesto
    $revisions = wp_get_post_revisions($POST_ID);
	
    $max_count = 7;
    
    $excluded_authors_by_username = ['daniel.hoegel'];
    $dates_by_user = [];
	$results = [];

	foreach($revisions as $post_id => $rev) {
        $author_id = $rev->post_author;
        $author =  get_userdata($author_id);

        $username = $author->user_login;
        $date = get_the_date('d.m.Y', $post_id);
        
        // excluded specific users like revisors or admins
        if (in_array($username, $excluded_authors_by_username)) {
            continue;
        }
        
        // only show one entry for each user at the same day
        if (isset($dates_by_user[$username]) && in_array($date, $dates_by_user[$username])) {
            continue;
        }
        
        // create html string
        $name = $author->display_name;
        array_push($results, "<span style='color: #ffff00;'><em>$name</em></span> am $date");

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
	
	return join(',<br />', $results);
}
