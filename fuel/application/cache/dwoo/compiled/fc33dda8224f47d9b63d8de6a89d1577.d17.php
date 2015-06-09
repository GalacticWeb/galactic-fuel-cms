<?php
/* template head */
/* end template head */ ob_start(); /* template body */ ?><!DOCTYPE html>
<html lang="en-US">
<head>
	<meta charset="utf-8">
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="keywords" content="<!--__FUEL_MARKER__0-->">
	<meta name="description" content="<!--__FUEL_MARKER__1-->To infinity ... and beyond">

 	<title>
		<!--__FUEL_MARKER__2-->Galactic Demo Page	</title>

	
	<script src="/fuel_template_git/assets/js/jquery.min.js?c=-62169987600" type="text/javascript" charset="utf-8"></script>
	<link href="/fuel_template_git/assets/css/bootstrap.min.css?c=-62169987600" media="all" rel="stylesheet"/>
	   
	
</head>
<body>

	<!-- Twitter Bootstrap Navigation -->
	<div class="navbar navbar-default">
		<div class="container">
			<div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><!--__FUEL_MARKER__3-->To infinity ... and beyond</a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                
<ul class="nav navbar-nav">
	<li class="first last active"><a href="http://localhost:8888/fuel_template_git/home">home</a></li>
</ul>
            </div>
		</div>
	</div>	
<style>
.carousel-inner .item img { width:100%; height:auto; }
.carousel-inner .item .carousel-caption { font-size:20px; }
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

	<!--__FUEL_MARKER__4-->This is a default layout. To change this layout go to the fuel/application/views/_layouts/main.php file.
</div>


<script type="text/javascript">
	$(document).ready(function () { 
		
		// receive image slider elements
		var slides = [{ "label":"Intergalactic Picture No 1","image":"galaxy.jpg"}]; 
		var img_path = "/fuel_template_git/assets/images/";  // fuel cms image path folder

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

	

<div class="container-fluid">
	<footer class="footer">
	    <p>Come visit <a href="http://www.galacticweb.de" target="_blank">Galactic Web</a></p>
	</footer>
</div>

<script src="/fuel_template_git/assets/js/jquery.min.js?c=-62169987600" type="text/javascript" charset="utf-8"></script>
	<script src="/fuel_template_git/assets/js/bootstrap.min.js?c=-62169987600" type="text/javascript" charset="utf-8"></script>
	
</body>
</html><?php  /* end template body */
return $this->buffer . ob_get_clean();
?>