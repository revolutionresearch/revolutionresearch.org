<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


function add_rating_controller($value, $id) {
    $posts = get_posts(array(
		'post_type' => FLOCKLER_POST_TYPE_NAME,
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) ) {
		return null;
	}

	$current_rating = get_field('rating', $posts[0]->ID);
	$next_rating = isset($current_rating) ? "$current_rating;$value" : $value;
    return update_field('rating', $next_rating, $posts[0]->ID);
}


function social_wall_controller($page) {
	$posts_config = [
		'flockler_best_rated' => [
			'count' => 9,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'order' => 'DESC',
				'orderby ' => 'date' // TODO: rating
			]
		],
		'flockler_worst_rated' => [
			'count' => 8,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'order' => 'ASC',
				'orderby ' => 'date' // TODO: rating
			]
		],
		'flockler_controversial' => [
			'count' => 9,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'order' => 'DESC', // TODO: change to DESC
				'orderby ' => 'date' // TODO: mosts rating with rating sum near 0
			]
		],
		'flockler_newests' => [
			'count' => 9,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'order' => 'ASC', // TODO: change to DESC
				'orderby ' => 'date'
			]
		],
		'questions' => [
			'count' => 2,
			'next_index' => 0,
			'query' => [
				// 'post_type' => 'posts',
				'posts_per_page' => -1,
				'category_name' => 'frage',
				'orderby ' => 'date' // and rating
			]
		],
		'features' => [
			'count' => 2,
			'next_index' => 0,
			'query' => [
				// 'post_type' => 'posts',
				'posts_per_page' => -1,
				'category_name' => 'featured',
				'orderby ' => 'date' // and rating
			]
		]
	];

	if ($page > 3) {
		return [
			'error' => 'More than 4 pages (starting on page 0) are not allowed'
		];
	}

	// return all posts if no page is set
	/* if ( !isset($page) ) {
		return array_merge(
			// $best_rated_flockler_posts,
			// $worst_rated_flockler_posts,
			// $controversial_flockler_posts,
			// $newest_flockler_posts,
			$question_posts,
			$featured_posts
		);
	} */

    $posts_per_page = 39;
	$posts_count = 0;
	$post_ids = [];
	$mixed_posts_by_page = array_fill_keys(range(0, $page), []);

	$newest_flockler_posts_index = 0;
	$newest_question_posts = 0;

	for ($i = 0; $i <= $page; $i++) { 
		foreach ($posts_config as $key => $config) {
			// get all posts
			$posts = get_posts($config['query']);

			// only use necessary number of unique posts
			$unique_posts = extract_unique_posts(
				$posts,
				$config['next_index'],
				$config['count'],
				$post_ids
			);

			// store unique posts, their indicies and the next index
			$mixed_posts_by_page[$i] = array_merge($mixed_posts_by_page[$i], $unique_posts['posts']);
			$post_ids = $unique_posts['post_ids'];
			$posts_config[$key]['next_index'] = $unique_posts['next_index'];
		}
	}

	// get meta fields
	$full_posts = array_map(function($post) {		
		
		// categories
		$category_ids = wp_get_post_categories($post->ID);
		$categories = array_map(function($category_id) {
			$category_data = get_category($category_id);
			return [
				'name' => $category_data->name,
				'slug' => $category_data->slug
			];
		}, $category_ids);
		
		// rating
		$rating_string = get_post_meta($post->ID, 'rating', true );
		$ratings = explode(';', $rating_string);
		$rating_value = array_reduce($ratings, function($acc, $r) {
			return $acc + (int)$r;
		}, 0);
		
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
			'categories' => $categories,
			'rating' => [
				'value' =>  $rating_value,
				'count' => count($ratings)
			],
			'author' => [
				'display_name' => $author->display_name,
				'user_login' => $author->user_login
			],
			'flockler' => get_post_meta($post->ID, 'flockler_post_full_data', true)
		];

		return $data;
	}, $mixed_posts_by_page[$page]);
	
	shuffle($full_posts);

	return $full_posts;
}