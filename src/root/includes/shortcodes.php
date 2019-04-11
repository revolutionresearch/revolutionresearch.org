<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


add_shortcode( 'event_single_date', 'event_single_date_func' );
function event_single_date_func( $attributes, $content ){
    $timestamp = strtotime(do_shortcode($content));
    $date = date("d. M. Y", $timestamp);
	return "$date,&nbsp;";
}


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
