<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


$domain = 'revolutionresearch';


/* source: https://www.smashingmagazine.com/2017/12/customizing-admin-columns-wordpress/ */


/**
 * Add custom columns to activism backend
 */
add_filter( 'manage_activism_posts_columns', 'revolutionresearch_activism_posts_columns' );
function revolutionresearch_activism_posts_columns( $default_columns ) {
    $columns = [
        'cb' => $default_columns['cb'], // input checkbox
        'title' => $default_columns['title'],
        'category' => __('Category'), // translate with wordpress default translations
        'artist' => __('Aktivist', $domain),
        'city' => __('Stadt', $domain),
        'event_date' => __('Date'),
        'author' => $default_columns['author'],
        'date' => $default_columns['date']
    ];

    return $columns;
}


/**
 * Fill the custom columns with data
 * This hook is run for each column in each post
 */
add_action( 'manage_activism_posts_custom_column', 'revolutionresearch_activism_column', 10, 2);
function revolutionresearch_activism_column( $column, $post_id ) {
    $single = true;
    
    
    
    // ARTIST
    if ( $column === 'artist' ) {
        $field = get_post_meta( $post_id, 'artist', $single);
        if ( $field ) {
            echo $field;
        }
    }
    
    // CITY
    if ( $column === 'city' ) {
        $field = get_post_meta( $post_id, 'city', $single);
        if ( !$field ) {
            echo $field;
        }
    }

    // EVENT_DATE
    if ( $column === 'event_date' ) {
        $field = get_post_meta( $post_id, 'date', $single);
        if ( $field) {
            $timestamp = strtotime(do_shortcode($field));
            setlocale(LC_TIME, "de_DE");
            $date = utf8_encode(strftime("%d.%m.%G", $timestamp));
            echo $date;
        }
    }

    // CATEGORY
    if ( $column === 'category' ) {
        $categories = wp_get_post_terms($post_id, 'event_category');
        
        if ( sizeof($categories) > 0) {
            $category_names = array_map(function($category) {
                return $category->name;
            }, $categories);
            echo join(', ', $category_names);
        } 
    }
}


/**
 * Make the costum columns sortable
 */
add_filter( 'manage_edit-activism_sortable_columns', 'revolutionresearch_activism_sortable_columns');
function revolutionresearch_activism_sortable_columns( $columns ) {
    $columns['artist'] = 'artist';
    $columns['city'] = 'city';
    $columns['event_date'] = 'date';
    return $columns;
}


/**
 * Add custom sort functions for the custom columns
 */
add_action( 'pre_get_posts', 'revolutionresearch_activism_orderby' );
function revolutionresearch_activism_orderby( $query ) {
    if ( ! is_admin() || !$query->is_main_query() ) {
        return;
    }

    // ARTIST
    if ( $query->get('orderby') === 'artist' ) {
        $query->set('meta_key', 'artist');
        $query->set('orderby', 'meta_value');
    }

    // CITY
    if ( $query->get('orderby') === 'city' ) {
        $query->set('meta_key', 'city');
        $query->set('orderby', 'meta_value');
    }

    // DATE
    if ( $query->get('orderby') === 'event_date' ) {
        $query->set('meta_key', 'date');
        $query->set('orderby', 'meta_value_num');
    }
}