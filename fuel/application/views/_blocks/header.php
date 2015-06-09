<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta charset="utf-8">
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="keywords" content="<?php echo fuel_var('meta_keywords')?>">
	<meta name="description" content="<?php echo fuel_var('meta_description')?>">

 	<title>
		<?php 
			if (!empty($is_blog)) :
				echo $CI->fuel_blog->page_title($page_title, ' : ', 'right');
			else:
				echo fuel_var('page_title', '');
			endif;
		?>
	</title>

	
	<?php
	    
	    // add jQuery (remaining JS is added in the footer)
		echo js('jquery.min');
	    
	    // Global CSS files
		foreach( $this->fuel->config('global_css') as $css_file ) {
	        echo css($css_file);
	    }

        // Blog module
		if (!empty($is_blog)):
			echo $CI->fuel_blog->header();
		endif;
		
	?>   
	
</head>
<body>

	<!-- Twitter Bootstrap Navigation -->
	<div class="navbar navbar-default">
		<div class="container">
			<div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><?php echo fuel_var('heading', 'Galactic Page'); ?></a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <?php echo fuel_nav(array('container_tag_class' => 'nav navbar-nav')); ?>
            </div>
		</div>
	</div>