<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/*** Includes ***/
require_once(__DIR__ . '/includes/elementor_hello_theme_setup.php');
require_once(__DIR__ . '/includes/feed_api/feed_api.php');


/*** Load JS files ***/
add_action( 'wp_enqueue_scripts', 'project_zukunft_scripts');
function project_zukunft_scripts() {
    $ver = wp_get_theme()->get('Version');
    $dir = get_stylesheet_directory_uri();
	$namespace = 'projekt_zukunft_';
	$in_footer = true;

	// third party scripts
    wp_enqueue_script( 'colcade', $dir . '/js/modules/colcade.js', null, null, $in_footer );
    wp_enqueue_script( 'nouislider', $dir . '/js/modules/nouislider.min.js', null, null, $in_footer );
    // wp_enqueue_style( 'nouislider-css', $dir . '/js/modules/nouislider.min.css', null, null );
	
	// custom scripts
	wp_enqueue_script( $namespace.'utils', $dir . '/js/utils.js', array(), null, $in_footer );
	wp_enqueue_script( $namespace.'mobile_menu', $dir . '/js/mobile-menu.js', array($namespace.'utils'), null, $in_footer );
	wp_enqueue_script( $namespace.'event_loop', $dir . '/js/event-loop.js', array($namespace.'utils'), null, $in_footer );
	wp_enqueue_script( $namespace.'collapsible', $dir . '/js/collapsible.js', array($namespace.'utils'), null, $in_footer );
    
    // feed scripts
    wp_enqueue_script( $namespace.'components', $dir . '/js/feed/components.js', array('nouislider', $namespace.'utils'), null, $in_footer );
    wp_enqueue_script( $namespace.'flockler_post', $dir . '/js/feed/FlocklerPost.js', array($namespace.'utils', $namespace.'components'), null, $in_footer );
    wp_enqueue_script( $namespace.'feature_post', $dir . '/js/feed/FeaturePost.js', array($namespace.'utils', $namespace.'components'), null, $in_footer );
    wp_enqueue_script( $namespace.'question_post', $dir . '/js/feed/QuestionPost.js', array($namespace.'utils', $namespace.'components'), null, $in_footer );
    wp_enqueue_script( $namespace.'feed', $dir . '/js/feed/Feed.js', array('colcade', $namespace.'utils', $namespace.'flockler_post', $namespace.'feature_post', $namespace.'question_post'), null, $in_footer );
}


/*** Shortcodes ***/

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
