<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Event Date (Single)
 */
add_shortcode( 'event_single_date', 'event_single_date_func' );
function event_single_date_func( $attributes, $content ){
    $timestamp = strtotime(do_shortcode($content));
    $date = date("d. M. Y", $timestamp);
	return "$date,&nbsp;";
}


/**
 * Event Date (Loop)
 */
add_shortcode( 'event_loop_date', 'event_loop_date_func' );
function event_loop_date_func( $attributes, $content ){
    $timestamp = strtotime(do_shortcode($content));
    
    $day = date("d", $timestamp);
    $weekday = date("D", $timestamp);
    $month = date("M", $timestamp);
    
    return "
        <div class='event-loop__date'>
            <div class='event-loop__date-left'>
                <div class='event-loop__date-day'>$day</div>
            </div>
            <div class='event-loop__date-right'>
                <div class='event-loop__date-weekday'>$weekday</div>
                <div class='event-loop__date-month'>$month</div>
            </div>
        </div>
    ";
}


/**
 * Wolfram Alpha Search Box
 */
add_shortcode( 'wolfram_alpha_search_box', 'wolfram_alpha_search_box_func' );
function wolfram_alpha_search_box_func( $attributes, $content ){    
    return "
        <div class='wa__search-box'>
            <form class='wa__form'>
                <input class='wa__input' type='text' placeholder='" . __('What is your question?') . "' />
                <button class='wa__submit' type='submit'></button>
            </form>
            <div class='wa__output'></div>
        </div>
    ";
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