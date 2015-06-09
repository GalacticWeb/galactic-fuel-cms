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
	<!--__FUEL_MARKER__4-->This is a default layout. To change this layout go to the fuel/application/views/_layouts/main.php file.
	
	

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