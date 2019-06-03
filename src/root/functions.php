<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/*** Includes ***/
require_once(__DIR__ . '/includes/elementor_hello_theme_setup.php');
require_once(__DIR__ . '/includes/shortcodes.php');
require_once(__DIR__ . '/includes/ajax_handler.php');
require_once(__DIR__ . '/includes/feed_api/feed_api.php');
require_once(__DIR__ . '/includes/custom_post_queries.php');


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
            'API_URL' => 'http://projekt-zukunft.hhc-duesseldorf.de/wp-json/zukunft/v1',
            'AJAX_URL' => admin_url( 'admin-ajax.php' ) // accesses as ajax_object.ajax_url in JavaScript
        ]
    );
}


// append to themes/{your_theme}/functions.php

define('EXCERPT_RARELY', '{[}]');
define('EXCERPT_BR', nl2br(PHP_EOL));

function wp_trim_excerpt_custom($text = '')
{
    add_filter('the_content', 'wp_trim_excerpt_custom_mark', 6);

    // get through origin filter
    $text = wp_trim_excerpt($text);

    remove_filter('the_content', 'wp_trim_excerpt_custom_mark');

    return wp_trim_excerpt_custom_restore($text);
}

function wp_trim_excerpt_custom_mark($text)
{
    $text = nl2br($text);
    return str_replace(EXCERPT_BR, EXCERPT_RARELY, $text);
}

function wp_trim_excerpt_custom_restore($text)
{
    return str_replace(EXCERPT_RARELY, EXCERPT_BR, $text);
}

// remove default filter
remove_filter('get_the_excerpt', 'wp_trim_excerpt');

// add custom filter
add_filter('get_the_excerpt', 'wp_trim_excerpt_custom');