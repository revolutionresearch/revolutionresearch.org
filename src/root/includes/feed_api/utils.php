<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


function extract_unique_posts($posts, $start_index, $target_count, $post_ids, $key) {
	$unique_posts = [];
	$current_index =  $start_index;
	$current_count = 0;
	$posts_count = count($posts);
	
	while (($current_count < $target_count) && ($current_index < $posts_count)) {
		$post = $posts[$current_index];
		if (!in_array($post->ID, $post_ids)) {
			$post->order_type = $key;
			array_push($unique_posts, $post);
			array_push($post_ids, $post->ID);
			$current_count += 1;
		}
		$current_index += 1;
	}

	return [
		'posts' => $unique_posts,
		'post_ids' => $post_ids,
		'next_index' => $current_index
	];
}


function get_post_data($post) {
	// categories
	$category_ids = wp_get_post_categories($post->ID);
	$categories = array_map(function($category_id) {
		$category_data = get_category($category_id);
		return [
			'name' => $category_data->name,
			'slug' => $category_data->slug
		];
	}, $category_ids);
	
	// author
	$author = get_field('author', $post->ID)->data;

	$data = [
		'post_id' => $post->ID,
		'post_author' => (int)$post->post_author,
		'post_date' => $post->post_date,
		'post_content' => $post->post_content,
		'post_title' => $post->post_title,
		'post_status' => $post->post_status,
		'guid' => $post->guid,
		'post_type' => $post->post_type,
		'post_thumbnail_url' => wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' )[0],
		'categories' => $categories,
		'rating' => [
			'value' =>  get_field('rating_value', $post->ID),
			'count' => get_field('rating_count', $post->ID)
		],
		'youtube_url' => get_field('youtube_url', $post->ID),
		'author' => [
			'display_name' => $author->display_name,
			'user_login' => $author->user_login
		],
		'flockler' => get_post_meta($post->ID, 'flockler_post_full_data', true)
	];

	return $data;
}

/**
 * Replace the last match of $search in $subject with $replace
 * source: https://stackoverflow.com/a/3835653
 */
function replace_last_match($search, $replace, $subject) {
    $pos = strrpos($subject, $search);

    if ($pos !== false) {
        $subject = substr_replace($subject, $replace, $pos, strlen($search));
    }

    return $subject;
}
