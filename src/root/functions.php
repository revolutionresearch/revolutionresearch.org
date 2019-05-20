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
