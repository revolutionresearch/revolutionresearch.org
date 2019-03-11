<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<footer id="site-footer" class="site-footer" role="contentinfo">

	<?php if ( function_exists( 'hfe_render_footer' ) ) : ?>
		<?php hfe_render_footer(); ?>
	<?php endif; ?>

</footer>
