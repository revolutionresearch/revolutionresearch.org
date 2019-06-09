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
                <input class='wa__input' type='text' placeholder='Was möchtest Du wissen?' />
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
    $POST_ID = 2296;
    $revisions = wp_get_post_revisions($POST_ID);
	
	$result = '';
	$index = 1;	
    $revisions_count = count($revisions);
    $max_revisions = 7;
    $max_count = ($revisions_count < $max_revisions) ? $revisions_count : $max_revisions;

	foreach($revisions as $post_id => $rev) {
        $date = get_the_date('d.m.Y', $post_id);
        
        $author_id = $rev->post_author;
        $single_value = true;
		$nickname = get_user_meta($author_id, 'nickname', $single_value);
		$first_name = get_user_meta($author_id, 'first_name', $single_value);
        $last_name = get_user_meta($author_id, 'last_name', $single_value);
    
        // use first_name and last_name, only first_name or username
        $name = $first_name ? (
            $last_name ? "$first_name $last_name" : $first_name
        ) : $nickname;
		
		$result = $result . "<span style='color: #ffff00;'><em>$name</em></span> am $date";
		
		if ($index < $max_count) {
            $result .= ',<br />';
            $index ++;
		} else {
            break;
        }
	}
	
	return $result;
}