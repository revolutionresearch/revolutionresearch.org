<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Wiki Articles by Categories
 * 
 * Order wiki articles by order meta field
 * source: https://wordpress.stackexchange.com/a/301163
 */
add_shortcode( 'wiki_articles_by_categories', 'wiki_articles_by_categories_func' );
function wiki_articles_by_categories_func( $attributes, $content ) {
    
    $html = "<div class='wiki-articles-by-categories'>";
    
    // get wiki categories ordered by order meta field
    $category_name = 'wiki_category';
    $categories = get_terms([
        'taxonomy' => $category_name,
        'hide_empty' => false,
        'meta_key' => 'order',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
    ]);

    foreach ($categories as $category) {
        $html .= "
        <div class='category'>
        <div class='category-title'>$category->name</div>
        <div class='articles'>
        ";
        
        // get wiki articles for each category ordered by order meta value
        $articles = get_posts([
            'post_type' => 'wiki_article',
            'posts_per_page' => -1,
            'meta_query' => [
                'relation' => 'AND',
                [ 'key' => 'category', 'value' => $category->term_id ],
                [
                    'relation' => 'OR',
                    [ 'key' => 'order', 'compare' => 'EXISTS' ],
                    [ 'key' => 'order', 'compare' => 'NOT EXISTS' ]
                ]
            ],
            'orderby' => 'meta_value_num title',
            'order' => 'ASC'
        ]);

        // print_r(sizeof($articles));

        foreach ($articles as $article) {
            $permalink = get_permalink($article->ID);
            $html .= "
                <div class='article'>
                    <a href='$permalink' class='article-title'>
                        $article->post_title
                    </a>
                </div>
            ";
        }

        $html .= "
                </div>
            </div>
        ";
    }

    $html .= '</div>';
    
    return $html;
};
