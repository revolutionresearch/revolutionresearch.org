<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


require_once(__DIR__ . '/utils.php');
require_once(__DIR__ . '/controller.php');


/** ROUTES */

add_action('rest_api_init', function () {
	register_rest_route('zukunft/v1', '/social-wall', array(
		'methods' => 'GET',
		'callback' => 'get_posts_for_social_wall',
	));

	register_rest_route('zukunft/v1', '/flockler/(?P<id>\d+)/rating', array(
		'methods' => 'POST',
		'callback' => 'add_flockler_rating',
	));
});


/** HANDLER */

function get_posts_for_social_wall( $request ) {
	$page = $request->get_param('page');
	return social_wall_controller($page);
}

function add_flockler_rating( $request ) {
	$value = $request->get_param('value');
	$id = $request->get_param('id');

	add_rating_controller($value, $id);

	return [
		'rating_value' => get_field('rating_value', $id),
		'rating_count' => get_field('rating_count', $id)
	];
}