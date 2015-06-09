<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    
 	<title><?=$page_title?></title>

 	<meta name="viewport" content="width=device-width">

    <?=css('bootstrap.min', 'fuel')?>
    <?=css('font-awesome.min', 'fuel')?>
	<?=css('admin', 'fuel')?>
	<?php foreach($css as $m => $c) : echo css(array($m => $c))."\n\t"; endforeach; ?>
	
	<?php $fuel_css = $this->fuel->config('fuel_css'); ?>
	<?php foreach($fuel_css as $m => $c) : echo css(array($m => $c))."\n\t"; endforeach; ?>
	
	<?=js('jquery/jquery', 'fuel')?>
	<?=js('jquery-migrate-1.2.1', 'fuel')?>
	<?=js('bootstrap.min', 'fuel')?>
	<?=js('admin', 'fuel')?>
	
	<script type="text/javascript">
		<?=$this->load->module_view(FUEL_FOLDER, '_blocks/fuel_header_jqx', array(), TRUE)?>
	</script>

	<link href='http://fonts.googleapis.com/css?family=Lato:100,200,300,500' rel='stylesheet' type='text/css'>
	
</head>