<?php $this->load->module_view(FUEL_FOLDER, '_blocks/related_items'); ?>

<div id="notification_extra" class="notification">
	<?php if (!empty($data['published']) && !is_true_val($data['published'])) : ?>
			<div class="warning fa ico_warn"><?=lang('pages_not_published')?></div>
	<?php endif; ?>
	

	<?php if (!empty($routes)) : ?>
	<div class="warning fa ico_warn">
		<?=lang('page_route_warning', APPPATH.'config/routes.php')?>
		<?php foreach($routes as $val) : ?>
			<ul>
				<li><?=$val?></li>
			</ul>
		<?php endforeach; ?>
	</div>
	<?php endif; ?>

	<?php if ($uses_controller) : ?>
		<div class="warning fa ico_warn">
			<?=lang('page_controller_assigned', $view_twin)?>
		</div>
	<?php endif; ?>
</div>

<?php if ($import_view) : ?>
	<div class="warning jqmWindow jqmWindowShow" id="view_twin_notification">
		<div class="modal_content_inner">
			<p><?=lang('page_updated_view', $view_twin)?></p>
	
			<div class="buttonbar" id="yes_no_modal">
				<ul>
					<li class="unattached"><a href="#" class="fa ico_no" id="view_twin_cancel"><?=lang('page_no_upload')?></a></li>
					<li class="unattached"><a href="#" class="fa ico_yes" id="view_twin_import"><?=lang('page_yes_upload')?></a></li>
				</ul>
			</div>
			<div class="clear"></div>
		</div>
	</div>

<?php endif; ?>


<div id="fuel_main_content_inner">

	<p class="instructions"><?=$this->instructions?></p>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3><?=lang('page_information')?></h3>
        </div>

        <div id="page_property_vars" class="panel-body">
            <?=$form?>
        </div>
	</div>
	
	<div class="panel panel-default">
        <div class="panel-heading">
            <h3><?=lang('page_layout_vars')?></h3>
        </div>

        <div id="layout_vars" class="panel-body">
            <?=$layout_fields?><div class="loader hidden"></div>
        </div>
	</div>

</div>