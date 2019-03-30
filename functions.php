<?php
/**
 * Theme functions and definitions
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! isset( $content_width ) ) {
	$content_width = 800; // pixels
}

/*
 * Set up theme support
 */
if ( ! function_exists( 'hello_elementor_theme_setup' ) ) {
	function hello_elementor_theme_setup() {
		if ( apply_filters( 'hello_elementor_theme_load_textdomain', true ) ) {
			load_theme_textdomain( 'elementor-hello-theme', get_template_directory() . '/languages' );
		}

		if ( apply_filters( 'hello_elementor_theme_register_menus', true ) ) {
			register_nav_menus( array( 'menu-1' => __( 'Primary', 'hello-elementor' ) ) );
		}

		if ( apply_filters( 'hello_elementor_theme_add_theme_support', true ) ) {
			add_theme_support( 'post-thumbnails' );
			add_theme_support( 'automatic-feed-links' );
			add_theme_support( 'title-tag' );
			add_theme_support( 'custom-logo' );
			add_theme_support( 'html5', array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			) );
			add_theme_support( 'custom-logo', array(
				'height' => 100,
				'width' => 350,
				'flex-height' => true,
				'flex-width' => true,
			) );

			/*
			 * Editor Style
			 */
			add_editor_style( 'editor-style.css' );

			/*
			 * WooCommerce
			 */
			if ( apply_filters( 'hello_elementor_theme_add_woocommerce_support', true ) ) {
				// WooCommerce in general:
				add_theme_support( 'woocommerce' );
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0):
				// zoom:
				add_theme_support( 'wc-product-gallery-zoom' );
				// lightbox:
				add_theme_support( 'wc-product-gallery-lightbox' );
				// swipe:
				add_theme_support( 'wc-product-gallery-slider' );
			}
		}
	}
}
add_action( 'after_setup_theme', 'hello_elementor_theme_setup' );

/*
 * Theme Scripts & Styles
 */
if ( ! function_exists( 'hello_elementor_theme_scripts_styles' ) ) {
	function hello_elementor_theme_scripts_styles() {
		if ( apply_filters( 'hello_elementor_theme_enqueue_style', true ) ) {
			wp_enqueue_style( 'elementor-hello-theme-style', get_stylesheet_uri() );
		}
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_theme_scripts_styles' );

/*
 * Register Elementor Locations
 */
if ( ! function_exists( 'hello_elementor_theme_register_elementor_locations' ) ) {
	function hello_elementor_theme_register_elementor_locations( $elementor_theme_manager ) {
		if ( apply_filters( 'hello_elementor_theme_register_elementor_locations', true ) ) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_theme_register_elementor_locations' );


/*** CUSTOM FUNCTIONS ***/

/**
 * Load js files
 */
add_action( 'wp_enqueue_scripts', 'project_zukunft_scripts');
function project_zukunft_scripts() {
    $ver = wp_get_theme()->get('Version');
    $dir = get_stylesheet_directory_uri();
	$namespace = 'projekt_zukunft_';
	$in_footer = true;

	// SCRIPTS
    // wp_enqueue_script('twitter', 'https://platform.twitter.com/widgets.js', array(), null, $in_footer );
    wp_enqueue_script( 'colcade', $dir . '/js/modules/colcade.js', null, null, $in_footer );
	
	wp_enqueue_script( $namespace.'utils', $dir . '/js/utils.js', array(), null, $in_footer );
	wp_enqueue_script( $namespace.'mobile_menu', $dir . '/js/mobile-menu.js', array($namespace.'utils'), null, $in_footer );
    wp_enqueue_script( $namespace.'feed', $dir . '/js/feed.js', array('colcade', $namespace.'utils'), null, $in_footer );
}


/**
 * Feed API
 */
/**
 * Grab latest post title by an author!
 *
 * @param array $data Options for the function.
 * @return string|null Post title for the latest author or null if none.
 */
function get_flockler_posts( $request ) {
	$page = $_GET['page'];

	if (isset($page)) {
		$posts_per_page = 20;
		$post_offset = $page * $posts_per_page;
	} else {
		$posts_per_page = -1;
		$post_offset = 0;
	}

	$posts = get_posts(array(
		'post_type' => FLOCKLER_POST_TYPE_NAME,
		'posts_per_page' => $posts_per_page,
		'offset' => $post_offset,
		// 'orderby' => 'rand'
	));

	$full_posts = array_map(function($post) {
		$data = get_post_meta($post->ID, 'flockler_post_full_data', true);
		$data['rating'] = get_post_meta($post->ID, 'rating', true );
		$data['post_id'] = $post->ID;
		return $data;
	}, $posts);
   
	return $full_posts;
}

function add_flockler_rating( $request ) {
	$value = $request->get_param('value');
	$id = $request->get_param('id');

	$posts = get_posts(array(
		'post_type' => FLOCKLER_POST_TYPE_NAME,
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) ) {
		return null;
	}

	$current_rating = get_field('rating', $posts[0]->ID);
	$next_rating = isset($current_rating) ? "$current_rating;$value" : $value;
	update_field('rating', $next_rating, $posts[0]->ID);

	return get_post_meta($posts[0]->ID, 'rating', true);
}

add_action('rest_api_init', function () {
	register_rest_route('zukunft/v1', '/flockler', array(
		'methods' => 'GET',
		'callback' => 'get_flockler_posts',
	));

	register_rest_route('zukunft/v1', '/flockler/(?P<id>\d+)/rating', array(
		'methods' => 'POST',
		'callback' => 'add_flockler_rating',
	));
});
