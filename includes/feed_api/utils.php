<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


function extract_unique_posts($posts, $start_index, $target_count, $post_ids) {
	$unique_posts = [];
	$current_index =  $start_index;
	$current_count = 0;
	$posts_count = count($posts);
	
	while (($current_count < $target_count) && ($current_index < $posts_count)) {
		$post = $posts[$current_index];
		if (!in_array($post->ID, $post_ids)) {
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