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

	$current_rating_value = get_field('rating_value', $post_id);
	$current_rating_count = get_field('rating_count', $post_id);
	
	update_field('rating_value', $current_rating_value + (int)$value, $post_id);
	update_field('rating_count', $current_rating_count + 1, $post_id);
}

function remove_rating_controller($value, $id) {
    $posts = get_posts(array(
		'post_type' => FLOCKLER_POST_TYPE_NAME,
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) ) {
		return null;
	}

	$post_id = $posts[0]->ID;

	$current_rating_value = get_field('rating_value', $post_id);
	$current_rating_count = get_field('rating_count', $post_id);
	
	update_field('rating_value', $current_rating_value - (int)$value, $post_id);
	update_field('rating_count', $current_rating_count - 1, $post_id);
}

function update_rating_controller($old_value, $new_value, $id) {
    $posts = get_posts(array(
		'post_type' => FLOCKLER_POST_TYPE_NAME,
		'p' => $id // p = post id
	));
	 
	if ( empty($posts) ) {
		return null;
	}

	$post_id = $posts[0]->ID;

	$current_rating_value = get_field('rating_value', $post_id);
	update_field('rating_value', $current_rating_value - (int)$old_value + $new_value, $post_id);
}


function social_wall_controller($page) {
	if ($page > 3) {
		return [
			'error' => 'More than 4 pages (starting on page 0) are not allowed'
		];
	}

	if ( !isset($page) ) {
		$page = 0;
    }
    

    /********************************/
    /*********** FLOCKLER ***********/
    /********************************/

	$flockler_posts_configs = [
		'flockler_best_rated' => [
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
			'next_index' => 0,
			'query' => [
				'post_type' => FLOCKLER_POST_TYPE_NAME,
				'posts_per_page' => -1,
				'order' => 'DESC',
				'orderby ' => 'date'
			]
		]
	];

  $flockler_posts_per_page = 39 - 3 - 4 - 5; // 3 acts, 4 questions, 4 forms
	$flockler_max_count = $flockler_posts_per_page * ($page + 1);
	$flockler_posts_count = 0;
	$flockler_post_ids = [];
	$posts = [];

	// get all flockler posts
	foreach ( $flockler_posts_configs as $key => $config ) {
		$flockler_posts_configs[$key]['posts'] = get_posts($config['query']);
	}

	// loop over all flockler posts until the max count is reached
	while ( $flockler_posts_count < $flockler_max_count ) {
		// looper over all order types
		foreach ( $flockler_posts_configs as $key => $config ) {
			// get current post and increase next index
			$post = $config['posts'][$config['next_index']];
			$flockler_posts_configs[$key]['next_index'] += 1;

			// validation
			if ( $flockler_posts_count >= $flockler_max_count ) { break; }
			if ( !isset($post) ) { continue; }
			if ( !in_array($post->ID, $flockler_post_ids) ) {
				// get post meta fields
				$post_data = get_post_data($post);
				$post_data['order_type'] = $key;
				
				// push post and post id
				array_push($posts, $post_data);
				array_push($flockler_post_ids, $post->ID);
				
				// increase post count
				$flockler_posts_count += 1;
			}
		}
	}

	$page_posts = array_slice($posts, -1 * $flockler_posts_per_page, $flockler_posts_per_page);

	// shuffle flockler posts
	shuffle($page_posts);


    /********************************/
    /************* ACTS *************/
    /********************************/

    // get acts
	$acts = [
		'one'   => get_posts([ 'post_type' => 'post', 'category_name' => 'act-one'   ])[0],
		'two'   => get_posts([ 'post_type' => 'post', 'category_name' => 'act-two'   ])[0],
		'three' => get_posts([ 'post_type' => 'post', 'category_name' => 'act-three' ])[0]
	];

	// insert acts with meta fields at index 0, 1/3 and 2/3
	$posts_count = count($page_posts);
	array_splice( $page_posts, 0, 						    0, [ get_post_data($acts['one'])   ]);
	array_splice( $page_posts, floor($posts_count / 3), 	0, [ get_post_data($acts['two'])   ]);
	array_splice( $page_posts, floor($posts_count / 3 * 2), 0, [ get_post_data($acts['three']) ]);


    /********************************/
    /*********** QUESTION ***********/
    /********************************/
    
    // get questions
	$questions = get_posts([
		'post_type' => 'post',
		'posts_per_page' => 4,
		'category_name' => 'frage',
		'orderby ' => 'date',
		'order' => 'DESC',
    ]);
    
    $question = get_post_data($questions[0]);

    // insert question at position 4 and -4
	array_splice( $page_posts, 4, 0, [ $question ]);
	array_splice( $page_posts, ceil(count($page_posts) / 2), 0, [ $question ]);
	array_splice( $page_posts, -4, 0, [ $question ]);
    

    /********************************/
    /************* FORM *************/
    /********************************/

	// insert forms
	if (function_exists('user_submitted_posts')) {
		// insert 4 forms starting from the end
		$interval = floor(count($page_posts) / 4);
		for ($i = 0; $i < 5; $i++) { 
            $form = [ 'post_type' => 'user_submitted_posts_form' ];
			array_splice( $page_posts, -1 * ($interval * $i + 1), 0, [ $form ]);
		}
	};
	
	// return [
	// 	'count' => count($page_posts),
	// 	'posts' => array_map(function($post) {
	// 		return $post['post_type'];
	// 	}, $page_posts)
	// ];

	return $page_posts;
}