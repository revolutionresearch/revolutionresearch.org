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
    
    setlocale(LC_TIME, "de_DE");
    $date = utf8_encode(strftime("%d.%m.%G", $timestamp));
	return "$date,&nbsp;";
}


/**
 * Event Date (Loop)
 */
add_shortcode( 'event_loop_date', 'event_loop_date_func' );
function event_loop_date_func( $attributes, $content ){
    $timestamp = strtotime(do_shortcode($content));
    
    setlocale(LC_TIME, "de_DE");
    $day = strftime("%d", $timestamp);
    $weekday = utf8_encode(strftime("%a", $timestamp));
    $month = utf8_encode(strftime("%b.", $timestamp));
    
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
