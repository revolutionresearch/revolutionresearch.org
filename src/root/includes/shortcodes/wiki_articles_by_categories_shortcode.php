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
        // get wiki articles for each category ordered by the order meta value
        $articles = get_posts([
            'post_type' => 'wiki_article',
            'posts_per_page' => -1,
            'meta_key' => 'order',
            'orderby' => 'meta_value_num title',
            'order' => 'ASC',
            'meta_query' => [[
                'key' => 'category',
                'value' => $category->term_id
            ]]
        ]);

        $article_count = sizeof($articles);
        $article_count_string = '' . $article_count . ' ' . ($article_count > 1 ? 'Bände' : 'Band');

        $html .= "
            <div class='category'>
                <div class='category-header'>
                    <div class='category-header-content'>
                        <span class='category-title'>
                            $category->name&nbsp;
                        </span>
                        <span class='article-count'>($article_count_string)</span>
                 </div>
                </div>
            <div class='articles'>
        ";

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
