<?php $this->load->view('_blocks/header')?>
	


<style>

	/* sticky footer esserntials */
	html { position: relative; min-height: 100%; }
	body { margin-bottom: 60px; }

	/* image slider */
	.carousel-inner .item img { width:100%; height:auto; }
	.carousel-inner .item .carousel-caption { font-size:20px; text-transform:uppercase; }

	.footer { position: absolute; bottom: 0; width: 100%; height: 60px; background-color: #f5f5f5; }
	.footer p { margin:20px 0; }
</style>



<!-- Twitter Bootstrap image slider -->
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  	<!-- Indicators -->
  	<ol class="carousel-indicators"></ol>

  	<!-- Wrapper for slides -->
  	<div class="carousel-inner" role="listbox"></div>

  	<!-- Controls -->
  	<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
    	<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
  	</a>
  	<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
    	<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
  	</a>
</div>	


<!-- Main page content -->
<div class="container">

	<div class="page-header text-center">
		<h1>Welcome to Space!</h1>
	</div>
	<p class="lead text-center">
		<?php echo fuel_var('body', 'This is a default layout. To change this layout go to the fuel/application/views/_layouts/main.php file.'); ?>
	</p>
	
</div>



<script type="text/javascript">

	$(document).ready(function () {
		
		// receive image slider elements
		var slides = <?php echo isset($slider_images) ? json_encode($slider_images) : null; ?>; 
		var img_path = "<?php echo img_path(); ?>";  // fuel cms image path folder

		// append images to HTML dom
		if ( slides !== null ) {
			
			for ( var i = 0; i < slides.length; i++ ) {
				$('<div class="item"><img src="' + img_path + slides[i]['image'] + '"><div class="carousel-caption">' +slides[i]['label']+ '</div></div>').appendTo('.carousel-inner');
    			$('<li data-target="#carousel-example-generic" data-slide-to="' +i+ '"></li>').appendTo('.carousel-indicators');
			}

			$('.item').first().addClass('active');
			$('.carousel-indicators > li').first().addClass('active');
			$('#carousel-example-generic').carousel();
		}

	});

</script>


	
<?php $this->load->view('_blocks/footer')?>
