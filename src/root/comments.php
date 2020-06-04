<?php

/**
 * COMMENTS
 */

if (!comments_open()) return; ?>

<div class="elementor-widget-heading" style="margin-bottom: 32px;">
    <div class="elementor-widget-container">
        <h2 class="elementor-heading-title elementor-size-default" style="color: #fff;">
            Peer Reviews
        </h2>
    </div>
</div>

<?php if (have_comments()) : ?>
    <ul class="post-comments">
        <?php
            wp_list_comments(array(
                'style'       => 'ul',
                'short_ping'  => true,
            ));
        ?>
    </ul>
<?php else: ?>
    <?php _e('Noch keine Peer Reviews vorhanden.'); ?>
<?php endif; ?>

<?php
/**
 * FORM
 */
$comment_form_args = [
    'title_reply' => __('Schreibe ein Peer Review!'),
    'label_submit' => __('Peer Review abschicken!'),
    'comment_field' => '<textarea placeholder="' . __('Was denkst Du?') . '" id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required"></textarea>'
];

comment_form($comment_form_args);