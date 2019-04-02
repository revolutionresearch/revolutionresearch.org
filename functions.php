<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/* Includes */
require_once(__DIR__ . '/includes/elementor_hello_theme_setup.php');
require_once(__DIR__ . '/includes/feed_api/feed_api.php');


/** Load JS files */
add_action( 'wp_enqueue_scripts', 'project_zukunft_scripts');
function project_zukunft_scripts() {
    $ver = wp_get_theme()->get('Version');
    $dir = get_stylesheet_directory_uri();
	$namespace = 'projekt_zukunft_';
	$in_footer = true;

	// third party scripts
    wp_enqueue_script( 'colcade', $dir . '/js/modules/colcade.js', null, null, $in_footer );
	
	// custom scripts
	wp_enqueue_script( $namespace.'utils', $dir . '/js/utils.js', array(), null, $in_footer );
	wp_enqueue_script( $namespace.'mobile_menu', $dir . '/js/mobile-menu.js', array($namespace.'utils'), null, $in_footer );
    wp_enqueue_script( $namespace.'feed', $dir . '/js/feed.js', array('colcade', $namespace.'utils'), null, $in_footer );
}
