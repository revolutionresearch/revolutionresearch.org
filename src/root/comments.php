<?php

/**
 * COMMENTS
 */
// $comments_query = new WP_Comment_Query;
// $comments = $comments_query->query([
//     'post_ID'  => get_the_ID(),
//     'status' => 'approve' 
// ]);

if (have_comments()) : ?>
    <ul class="post-comments">
        <?php
            wp_list_comments(array(
                'style'       => 'ul',
                'short_ping'  => true,
            ));
        ?>
    </ul>
<?php else:
    echo __('Noch keine Peer Reviews vorhanden.');
endif;


/**
 * FORM
 */
$comment_form_args = [
    'title_reply' => __('Schreibe ein Peer Review!'),
    'label_submit' => __('Peer Review abschicken!'),
    'comment_field' => '<textarea placeholder="' . __('Was denkst Du?') . '" id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required"></textarea>'
];

comment_form($comment_form_args);