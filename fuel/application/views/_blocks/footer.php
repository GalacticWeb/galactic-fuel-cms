
<footer class="footer">
	<div class="container text-center">
	    <p>Come visit <a href="http://www.galacticweb.de" target="_blank">Galactic Web</a></p>
	</div>
</footer>

<?php

	// Global Javascript files
	foreach( $this->fuel->config('global_js') as $js_file ) {
	    echo js($js_file);
	}

?>

</body>
</html>