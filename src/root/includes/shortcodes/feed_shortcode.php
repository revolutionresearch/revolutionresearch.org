<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Root element and markup for the social media feed
 */
add_shortcode( 'feed', 'feed_shortcode' );
function feed_shortcode(){
    $html = "
        <div id='feed' class='feed--loading'>
            <div class='grid'>
                <div class='grid__col grid__col--1'></div>
                <div class='grid__col grid__col--2'></div>
                <div class='grid__col grid__col--3'></div>
                <div class='grid__col grid__col--4'></div>
            </div>
        </div>
    ";
    return $html;
}