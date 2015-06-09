<?php if ($change_pwd){ ?>
<div class="jqmWindow jqmWindowShow warning" id="change_pwd_notification">
	<div class="modal_content_inner">
		<p><?=lang('warn_change_default_pwd', $this->config->item('default_pwd', 'fuel'))?></p>
		<div class="col-xs-12" id="yes_no_modal">
			<div class="col-xs-12 col-sm-6 text-center">
			    <a href="#" class="btn btn-danger jqmClose" id="change_pwd_cancel"><?=lang('dashboard_change_pwd_later')?></a>
			</div>
			<div class="col-xs-12 col-sm-6 text-center">
			    <a href="<?=fuel_url('my_profile/edit/')?>" class="btn btn-success" id="change_pwd_go"><?=lang('dashboard_change_pwd')?></a>
			</div>
		</div>
		<div class="clear"></div>
	</div>
</div>
<?php } ?>

<div id="fuel_main_content_inner">
	<p class="instructions"><?=lang('dashboard_intro')?></p>
	<?php foreach($dashboards as $dashboard) : ?>
		<div id="dashboard_<?=$dashboard?>" class="dashboard_module">
			<div class="loader"></div>
		</div>
	<?php endforeach; ?>
	
	<div class="clear"></div>
</div>