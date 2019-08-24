<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


$domain = 'revolutionresearch';


/* source: https://www.smashingmagazine.com/2017/12/customizing-admin-columns-wordpress/ */


/**
 * Add custom columns to wiki_articles backend
 */
add_filter( 'manage_wiki_article_posts_columns', 'revolutionresearch_wiki_article_posts_columns' );
function revolutionresearch_wiki_article_posts_columns( $default_columns ) {
    $columns = [
        'cb' => $default_columns['cb'], // input checkbox
        'title' => $default_columns['title'],
        'author' => $default_columns['author'],
        'category' => __('Category'), // translate with wordpress default translations
        'order' => __('Order'),
        'date' => $default_columns['date']
    ];

    return $columns;
}


/**
 * Fill the custom columns with data
 * This hook is run for each column in each post
 */
add_action( 'manage_wiki_article_posts_custom_column', 'revolutionresearch_wiki_article_column', 10, 2);
function revolutionresearch_wiki_article_column( $column, $post_id ) {
    $single = true;

    // ORDER
    if ( $column === 'order' ) {
        $field = get_post_meta( $post_id, 'order', $single);
        if ( !$field && $field != 0) {
            _e('n/a'); // translate and echo
        } else {
            echo $field;
        }
    }

    // CATEGORY
    if ( $column === 'category' ) {
        $category_id = get_post_meta( $post_id, 'category', $single);
        
        if ( !$category_id && $category_id != 0) {
            _e('n/a');
        } else {
            $category = get_term($category_id);
            echo $category->slug;
        } 
    }
}


/**
 * Make the costum columns sortable
 */
add_filter( 'manage_edit-wiki_article_sortable_columns', 'revolutionresearch_wiki_article_sortable_columns');
function revolutionresearch_wiki_article_sortable_columns( $columns ) {
    $columns['author'] = 'author';
    $columns['order'] = 'order';
    // $columns['category'] = 'category';
    return $columns;
}


/**
 * Add custom sort functions for the custom columns
 */
add_action( 'pre_get_posts', 'revolutionresearch_wiki_article_orderby' );
function revolutionresearch_wiki_article_orderby( $query ) {
    if ( ! is_admin() || !$query->is_main_query() ) {
        return;
    }

    // ORDER
    if ( $query->get('orderby') === 'order' ) {
        $query->set('meta_key', 'order');
        $query->set('orderby', 'meta_value_num');
    }

    // CATEGORY is not possible because I don't know how to sort by the category slug instead of the
    // category id, that is stored in the meta field
}