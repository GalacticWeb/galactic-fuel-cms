<ul class="buttonbar btn-group btn-group-sm col-xs-12 col-sm-9 col-md-8" role="group" id="action_btns">
		<?php if (isset($action) AND $action == 'edit') : ?>
			
			<?php if ($this->fuel->auth->module_has_action('save')) : ?>
				<li class="btn btn-success"><a href="#" class="save" title="<?=$keyboard_shortcuts['save']?> to save"><i class="fa fa-floppy-o"></i> <?=lang('btn_save')?></a></li>
			<?php endif; ?>

			<?php if ($this->fuel->auth->module_has_action('delete') AND $this->fuel->auth->has_permission($this->permission, 'delete')) : ?>
				<li class="btn btn-danger"><a href="<?=fuel_url($this->module_uri.'/delete/'.$id, TRUE)?>" class="ico ico_delete delete_action"><i class="fa fa-trash-o"></i> <?=lang('btn_delete')?></a></li>
			<?php endif; ?>
			
			<?php if (!empty($this->preview_path) AND $this->fuel->auth->module_has_action('view')) : ?>
				<li class="btn btn-default"><a href="<?=site_url($this->preview_path, FALSE)?>" class="ico ico_view key_view_action<?php if (!$this->fuel->config('view_in_new_window')) : ?> view_action<?php endif; ?>" title="<?=$keyboard_shortcuts['view']?> to view" target="_blank"><i class="fa fa-eye"></i> <?=lang('btn_view')?></a></li>
			<?php endif; ?>

			<?php if ($this->fuel->auth->module_has_action('publish') AND $this->fuel->auth->has_permission($this->permission, 'publish')) : ?>
				<?php if (!empty($publish)) : ?>
			<li class="btn btn-default"><a href="#" class="fa fa-<?=strtolower($publish)?> <?=strtolower($publish)?>_action"><?=lang('btn_'.strtolower($publish))?></a></li>
				<?php endif; ?>
			<?php endif; ?>
			<?php if ($this->fuel->auth->module_has_action('activate') AND $this->fuel->auth->has_permission($this->permission, 'activate')) :  ?>
				<?php if (!empty($activate))  : ?>
			<li class="btn btn-default"><a href="#" class="fa fa-<?=strtolower($activate)?> <?=strtolower($activate)?>_action"><?=lang('btn_'.strtolower($activate))?></a></li>
				<?php endif; ?>
			<?php endif; ?>
			
			<?php if ($this->fuel->auth->module_has_action('duplicate')) : ?>
				<li class="btn btn-info"><a href="<?=fuel_url($this->module_uri.'/create', TRUE)?>" class="ico ico_duplicate duplicate_action"><i class="fa fa-files-o"></i> <?=lang('btn_duplicate')?></a></li>
			<?php endif; ?>
			
			<?php if ($this->fuel->auth->module_has_action('replace') AND !empty($others) AND $this->fuel->auth->has_permission($this->permission, 'edit') AND $this->fuel->auth->has_permission($this->permission, 'delete')) : ?>
				<li class="btn btn-warning"><a href="<?=fuel_url($this->module_uri.'/replace/'.$id, TRUE)?>" class="ico ico_replace replace_action"><i class="fa fa-undo"></i> <?=lang('btn_replace')?></a></li>
			<?php endif; ?>
			
			<?php if ($this->fuel->auth->module_has_action('others')) : ?>
			<?php foreach($this->item_actions['others'] as $other_action => $label) : 
				if ($this->fuel->auth->has_permission($this->permission, $other_action)) :
				$ico_key = str_replace('/', '_', $other_action);
				$lang_key = url_title($label, 'underscore', TRUE);
				if ($new_label = lang('btn_'.$lang_key)) $label = $new_label;
			?>
				<li class="btn btn-default"><?=anchor(fuel_url($other_action, TRUE), $label, array('class' => 'submit_action ico ico_'.$ico_key))?></li>
			<?php endif; ?>
			<?php endforeach; ?>
			<?php endif; ?>
			<?php if ($this->fuel->auth->module_has_action('create') AND $this->fuel->auth->has_permission($this->permission, 'create')) : ?>
				<li class="end btn btn-primary"><a href="<?=fuel_url($this->module_uri.'/create', TRUE)?>" class="ico ico_create"><i class="fa fa-file-o"></i> <?=lang('btn_create')?></a></li>
			<?php endif; ?>
			
			
		<?php elseif ($action == 'create' AND $this->fuel->auth->module_has_action('save')) : ?>
			<li class="btn btn-default end"><a href="#" class="ico ico_save save" title="<?=$keyboard_shortcuts['save']?> to save"><?=lang('btn_save')?></a></li>
		<?php endif; ?>
</ul>

<?php if (!empty($others) AND !$this->fuel->admin->is_inline()):?>
    <div id="other_items" class="col-xs-12 col-sm-3 col-md-4 form-inline">
        <div class="form-group pull-right">
            <?=$this->form->select('fuel_other_items', $others, '', 'class="form-control input-sm"', lang('label_select_another'), array($id))?>
        </div>
    </div>
<?php endif; ?>
