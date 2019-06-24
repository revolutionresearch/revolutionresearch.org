<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Flockler Posts
 * 
 * returns post, rating, flockler_post_full_data
 */
function get_all_flockler_posts() {
    // get posts
    $posts = get_posts([
        'post_type' => FLOCKLER_POST_TYPE_NAME,
        'posts_per_page' => -1
    ]);
    
    // get meta data
    $posts_data = array_map(function($post_object) {
        // post
        $post = (array) $post_object;
        $post_id = $post['ID'];

        // rating
        $post['rating'] = [
            'value' =>  get_field('rating_value', $post_id),
            'count' => get_field('rating_count', $post_id)
        ];
        
        // flockler_post_full_data
        $post['flockler_post_full_data'] = get_post_meta($post_id, 'flockler_post_full_data', true);
        
        return $post;
    }, $posts);
    
	return [
        'post_count' => count($posts_data),
        'data' => $posts_data,
        'error' => null
    ];
}


/**
 * Events
 * 
 * returns post, categories, post_thumbnail, event_meta
 */
function get_all_events() {
    // get posts
    $posts = get_posts([
        'post_type' => 'activism',
        'posts_per_page' => -1
    ]);
    
    // get meta data
    $posts_data = array_map(function($post_object) {
        // post
        $post = (array) $post_object;
        $post_id = $post['ID'];

        // categories
        $categories = wp_get_post_terms($post_id, 'event_category');
	    $categories_slug = array_map(function($category) {
            return $category->slug;
        }, $categories);
        $post['categories'] = $categories_slug;

        // post_thumbnail
        $post_thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'single-post-thumbnail' );
        $post['post_thumbnail'] = [
            'src' => $post_thumbnail[0],
            'width' => $post_thumbnail[1],
            'height' => $post_thumbnail[2]
        ];

        // event_meta
        $post['event_meta'] = [
            'location' => get_field('location', $post_id),
            'ticket_link' => get_field('ticket_link', $post_id),
            'date' => get_field('date', $post_id),
            'start_time' => get_field('start_time', $post_id),
            'end_time' => get_field('end_time', $post_id),
            'featured' => get_field('featured', $post_id),
            'artist' => get_field('artist', $post_id),
            'city' => get_field('city', $post_id)
        ];

        return $post;
    }, $posts);
    
	return [
        'post_count' => count($posts_data),
        'data' => $posts_data,
        'error' => null
    ];
}


/**
 * User Submitted Posts
 * 
 * returns post, rating, categories, post_thumbnail, youtube_link
 */
function get_all_user_submitted_posts() {	
	// get posts
    $posts = get_posts([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'category_name' => 'du-beitrag'
    ]);
    
    // get meta data
    $posts_data = array_map(function($post_object) {
        // post
        $post = (array) $post_object;
        $post_id = $post['ID'];

        // categories
        $category_ids = wp_get_post_categories($post_id);
	    $categories = array_map(function($category_id) {
            return get_category($category_id)->slug;
        }, $category_ids);
        $post['categories'] = $categories;

        // post_thumbnail
        $post_thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'single-post-thumbnail' );
        $post['post_thumbnail'] = [
            'src' => $post_thumbnail[0],
            'width' => $post_thumbnail[1],
            'height' => $post_thumbnail[2]
        ];
        
        // youtube_url
        $post['youtube_url'] = esc_url(get_field('youtube_url', $post_id));
        
        // rating
        $post['rating'] = [
            'value' =>  get_field('rating_value', $post_id),
            'count' => get_field('rating_count', $post_id)
        ];

        return $post;
    }, $posts);
    
	return [
        'post_count' => count($posts_data),
        'data' => $posts_data,
        'error' => null
    ];
}


/**
 * Berlin Manifesto
 * 
 * returns revisions
 */
function get_all_berlin_manifesto_revisions() {	
	$POST_ID = 2296; // berlin-manifesto
    $revisions = wp_get_post_revisions($POST_ID);

	return [
        'post_count' => count($revisions),
        'data' => $revisions,
        'error' => null
    ];
}