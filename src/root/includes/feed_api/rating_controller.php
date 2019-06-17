<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

function validate_rating($value) {
    $rating = (int)$value;
    return $rating !== 0 && -4 <= $rating && $rating <= 4;
}


/**
 * ADD RATING
 */
function add_rating_controller($value, $id) {
  $posts = get_posts(array(
		'post_type' => 'any',
		'p' => $id // p = post_id
	));
	 
	if ( empty($posts) || !validate_rating($value) ) {
		return null;
	}

	$post_id = $posts[0]->ID;

	$current_rating_value = get_field('rating_value', $post_id);
	$current_rating_count = get_field('rating_count', $post_id);
	
	update_field('rating_value', $current_rating_value + (int)$value, $post_id);
	update_field('rating_count', $current_rating_count + 1, $post_id);
}


/**
 * REMOVE RATING
 */
function remove_rating_controller($value, $id) {
  $posts = get_posts(array(
		'post_type' => 'any',
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) || !validate_rating($value) ) {
		return null;
	}

	$post_id = $posts[0]->ID;

	$current_rating_value = get_field('rating_value', $post_id);
	$current_rating_count = get_field('rating_count', $post_id);
	
	update_field('rating_value', $current_rating_value - (int)$value, $post_id);
	update_field('rating_count', $current_rating_count - 1, $post_id);
}


/**
 * UPDATE RATING
 */
function update_rating_controller($old_value, $new_value, $id) {
    $posts = get_posts(array(
		'post_type' => 'any',
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) || !validate_rating($old_value) || !validate_rating($new_value)) {
		return null;
	}

	$post_id = $posts[0]->ID;

	$current_rating_value = get_field('rating_value', $post_id);
    update_field('rating_value', $current_rating_value - (int)$old_value + $new_value, $post_id);
    // rating count stays the same
}
