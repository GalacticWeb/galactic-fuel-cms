<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

 	<title><?=$page_title?></title>
	<?=css('fuel.min', FUEL_FOLDER)?>
	<?php if (!empty($css)) : ?>
	<?=$css?>
	<?php endif; ?>
	<script type="text/javascript">
	<?=$this->load->module_view(FUEL_FOLDER, '_blocks/fuel_header_jqx', array(), TRUE)?>
	</script>
	<?=js('jquery/jquery', FUEL_FOLDER)?>
	<?=js('jqx/jqx', FUEL_FOLDER)?>
	<script type="text/javascript">
		jqx.addPreload('fuel.controller.BaseFuelController');
		jqx.init('fuel.controller.LoginController', {});
	</script>

	<link href='http://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>

	<style>
	.login_logo_font h1 {
		font-family: 'Lato', sans-serif;
		font-weight:100;
		font-size:33px;
		color:#fff;
		text-align: center;
	}
	</style>

</head>


<body>
<div id="login">
		
		<div class="login_logo_font">
			<h1>GALACTIC CMS</h1>
		</div>

		<div id="login_notification" class="notification">
			<?=$notifications?>
		</div>
		<?php if (!empty($instructions)) : ?>
		<p><?=$instructions?></p>
		<?php endif; ?>
		<?=$form?>
		<?php if ($display_forgotten_pwd) : ?>
			<a href="<?=fuel_url('login/pwd_reset')?>" id="forgotten_pwd"><?=lang('login_forgot_pwd')?></a>
		<?php endif; ?>
	</div>
</div>
</body>
</html>