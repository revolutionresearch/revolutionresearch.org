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

	$post_id = $posts[0]->ID;

	$current_ratings = get_field('ratings', $post_id);
	$current_rating_value = get_field('rating_value', $post_id);
	$current_rating_count = get_field('rating_count', $post_id);
	
	$next_ratings = isset($current_ratings) ? "$current_ratings;$value" : $value;
	update_field('ratings', $next_ratings, $post_id);
	update_field('rating_value', $current_rating_value + (int)$value, $post_id);
	update_field('rating_count', $current_rating_count + 1, $post_id);
}


function social_wall_controller($page) {
	$posts_config = [
		'flockler_best_rated' => [
			'count' => 9,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'meta_key' => 'rating_value',
				'orderby ' => 'meta_value_num',
				'order' => 'DESC'
			]
		],
		'flockler_worst_rated' => [
			'count' => 8,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'meta_key' => 'rating_value',
				'orderby ' => 'meta_value_num',
				'order' => 'ASC'
			]
		],
		'flockler_controversial' => [
			'count' => 9,
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'meta_key' => 'rating_value',
				'orderby' => 'meta_value_count',
				'order' => 'DESC',
				'meta_query' => [[
					'key'     => 'rating_value',
					'value'   => [-1, 1],
					'compare' => 'BETWEEN',
				]]
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
			'count' => 20, //2
			'next_index' => 0,
			'query' => [
				'post_type' => 'post',
				'posts_per_page' => -1,
				'category_name' => 'frage',
				// 'meta_key' => 'rating_value',
				// 'orderby ' => 'meta_value_num',
				// 'order' => 'ASC',
			]
		],
		'features' => [
			'count' => 20, //2
			'next_index' => 0,
			'query' => [
				'post_type' => 'post',
				'posts_per_page' => -1,
				'category_name' => 'featured',
				// 'meta_key' => 'rating_value',
				// 'orderby ' => 'date meta_value_num',
				// 'order' => 'DESC'
			]
		]
	];

	if ($page > 3) {
		return [
			'error' => 'More than 4 pages (starting on page 0) are not allowed'
		];
	}

	if ( !isset($page) ) {
		$page = 0;
	}

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
				$post_ids,
				$key
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
		
		$rating_value = 
		$rating_count = get_field('rating_count', $post->ID);
		
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
			'order_type' => $post->order_type,
			'rating' => [
				'value' =>  get_field('rating_value', $post->ID),
				'count' => get_field('rating_count', $post->ID)
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