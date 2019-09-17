<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


$domain = 'revolutionresearch';


/**
 * Helper functions to log something to the browser console
 */
function console_log($message, $encode = true) {
    echo "<script>console.log('[Backend Log]', " . ($encode ? json_encode($message) : "$message") . ")</script>";
}


/*** Includes ***/
require_once(__DIR__ . '/includes/elementor_hello_theme_setup.php');
require_once(__DIR__ . '/includes/feed_api/feed_api.php');
require_once(__DIR__ . '/includes/custom_post_queries.php');

// backend
require_once(__DIR__ . '/includes/backend/backend_columns_activism.php');
require_once(__DIR__ . '/includes/backend/backend_columns_wiki_article.php');

// shortcodes
require_once(__DIR__ . '/includes/shortcodes/revolutionresearch.php');
require_once(__DIR__ . '/includes/shortcodes/events_date_shortcodes.php');
require_once(__DIR__ . '/includes/shortcodes/events_filter_shortcodes.php');
require_once(__DIR__ . '/includes/shortcodes/feed_shortcode.php');
require_once(__DIR__ . '/includes/shortcodes/wolfram_alpha_shortcodes.php');
require_once(__DIR__ . '/includes/shortcodes/wiki_articles_revisions_shortcode.php');
require_once(__DIR__ . '/includes/shortcodes/wiki_articles_by_categories_shortcode.php');
require_once(__DIR__ . '/includes/shortcodes/table_of_contents_shortcode.php');

// ajax handler
require_once(__DIR__ . '/includes/ajax_handler/user_post_submit_ajax_handler.php');
require_once(__DIR__ . '/includes/ajax_handler/wolfram_alpha_ajax_handler.php');


/*** Load JS files ***/
add_action( 'wp_enqueue_scripts', 'project_zukunft_scripts');
function project_zukunft_scripts() {
    wp_enqueue_script(
        'projekt_zukunft_scripts',
        get_stylesheet_directory_uri() . '/js/main.js',
        [], null, true
    );

	wp_localize_script(
        'projekt_zukunft_scripts',
        'PHP_VARS', [
            'API_URL' => get_site_url() . '/wp-json/zukunft/v1',
            'AJAX_URL' => admin_url( 'admin-ajax.php' ) // accesses as ajax_object.ajax_url in JavaScript
        ]
    );
}


/*** Load CSS for login page ***/
add_action( 'login_enqueue_scripts', 'project_zukunft_login_style' );
function project_zukunft_login_style() {
    wp_enqueue_style( 'project_zukunft_login_style', get_stylesheet_directory_uri() . '/style-login.css' );
}


/*** Allow line breaks and html tags in post excerpt ***/
remove_filter('get_the_excerpt', 'wp_trim_excerpt');
add_filter('get_the_excerpt', 'custom_wp_trim_excerpt');
function custom_wp_trim_excerpt($custom_excerpt) {
    $raw_excerpt = $custom_excerpt;
    
    if ( $custom_excerpt == '') {

        $custom_excerpt = get_the_content('');
        $custom_excerpt = strip_shortcodes( $custom_excerpt );
        $custom_excerpt = apply_filters('the_content', $custom_excerpt);
        $custom_excerpt = str_replace(']]>', ']]&gt;', $custom_excerpt);
        
        // allow specified html tags in the excerpt
        $custom_excerpt = strip_tags($custom_excerpt, '<script>,<style>,<br>,<em>,<i>,<ul>,<ol>,<li>,<a>,<p>,<img>,<video>,<audio>,<span>,<div>');

        return $custom_excerpt;   
    } 
    return apply_filters('custom_wp_trim_excerpt', $custom_excerpt, $raw_excerpt);
}


/*** Change Lost password message ***/
add_filter( 'login_message', 'password_reset_message_text_change' );
function password_reset_message_text_change( $message ) {
    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'lostpassword')  {
        $message = "<p class='message'>Bitte gebe Deinen Benutzernamen oder Deine E-Mail-Adresse hier ein. Du bekommst eine E-Mail zugesandt, mit deren Hilfe Du ein neues Passwort erstellen kannst.<p>";
    }
    return $message;
}
