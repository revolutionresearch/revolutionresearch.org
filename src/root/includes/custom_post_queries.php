<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Get featured events and order by custom date field
 */
add_action( 'elementor/query/featured_events', function( $query ) {   
    // filter by featured meta field
    $query->set( 'meta_query', [[
        'key' => 'featured',
        'value' => '1',
    ]] );
    
    // order by date
    $query->set( 'meta_key', 'date' );
    $query->set( 'meta_type', 'DATE' );
    $query->set( 'orderby', 'meta_value' );
});


/**
 * Order events by custom date field and filter by get paramaters
 */
add_action( 'elementor/query/events_filtered', function( $query ) {
    // order by date
    $query->set( 'meta_key', 'date' );
    $query->set( 'meta_type', 'DATE' );
    $query->set( 'orderby', 'meta_value' );

    // filter by category
    if (isset($_GET['category']) && $_GET['category'] !== '') {
        $query->set('tax_query', [[
            'taxonomy' => 'event_category',
            'field'    => 'slug',
            'terms'    => $_GET['category']
        ]]);
    }

    $meta_query = [];

    // filter by artist
    if (isset($_GET['artist']) && $_GET['artist'] !== '') {
        $meta_query[] = [
            'key' => 'artist',
            'value' => $_GET['artist'],
            'compare' => '='
        ];
    }

    // filter by city
    if (isset($_GET['city']) && $_GET['city'] !== '') {
        $meta_query[] = [
            'key' => 'city',
            'value' => $_GET['city'],
            'compare' => '='
        ];
    }
    
    // filter by date
    if (isset($_GET['date']) && $_GET['date'] !== '') {
        $date_regex = $_GET['date'] . '[0-9]{1,2}';
        $meta_query[] = [
            'key' => 'date',
            'value' => $date_regex,
            'compare' => 'REGEXP'
        ];
    }

    $query->set( 'meta_query', $meta_query );
});


/**
 * Order wiki articles by order meta field
 * source: https://wordpress.stackexchange.com/a/301163
 */
add_action( 'elementor/query/query_wiki_articles', function( $query ) {
    $key = 'order';

    // Setting just `meta_key` is not sufficient, as this 
    // will ignore posts that do not yet, or never will have 
    // a value for the specified key. This meta query will 
    // register the `meta_key` for ordering, but will not 
    // ignore those posts without a value for this key.
    $query->set( 'meta_query', [
        'relation' => 'OR',
        [ 'key' => $key, 'compare' => 'EXISTS' ],
        [ 'key' => $key, 'compare' => 'NOT EXISTS' ]
    ]);

    // Order by the meta value, then by the title if multiple 
    // posts share the same value for the provided meta key.
    // Use `meta_value_num` if the meta values are numeric.
    $query->set( 'orderby', 'meta_value_num title ' );
    $query->set( 'order', 'ASC' );
});
