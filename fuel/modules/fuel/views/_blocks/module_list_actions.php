<ul class="buttonbar btn-group btn-group-sm col-xs-12 col-sm-8 col-md-6" role="group">

	<?php 
	$create_url = (!empty($this->model->filters['group_id'])) ? $this->module_uri.'/create/'.$this->model->filters['group_id'] : $this->module_uri.'/create';
	if (!empty($tree)) : ?>
        <li class="btn btn-default"><a href="#" id="toggle_list" class="ico ico_table" title="<?=$keyboard_shortcuts['toggle_view']?> to toggle view"><i class="fa fa-list-ul"></i> <?=lang('btn_list')?></a></li>
        <li class="btn btn-default"><a href="#" id="toggle_tree" class="ico ico_tree" title="<?=$keyboard_shortcuts['toggle_view']?> to toggle view"><i class="fa fa-tree"></i> <?=lang('btn_tree')?></a></li>
	<?php endif; ?>
	<?php if (!empty($this->list_actions)) : ?>
		<?php 
		foreach($this->list_actions as $action => $label) : 
            $lang_key = str_replace('/', '_', $action);
            ?>
            <?php if ($this->fuel->auth->has_permission($this->permission, $action)) : ?>
                <li class="btn btn-default"><?=anchor(fuel_url($action), $label, array('class' => 'fa fa-'.$lang_key))?></li>
            <?php endif; ?>
		<?php endforeach; ?>
	<?php endif; ?>

	<li class="btn btn-default"><a href="#" class="ico ico_select_all"><?=lang('btn_select_all')?></a></li>

	<li class="btn btn-default"><a href="#" class="ico ico_precedence" id="rearrange"><i class="fa fa-reorder"></i> <?=lang('btn_rearrange')?></a></li>

	<?php if ($this->fuel->auth->module_has_action('delete') && $this->fuel->auth->has_permission($this->permission, 'delete')) : ?>
	<li class="btn btn-default"><a href="#" class="ico ico_delete" id="multi_delete"><?=lang('btn_delete_multiple')?></a></li>
	<?php endif; ?>
		
	<?php if ($this->exportable AND $this->fuel->auth->has_permission($this->permission, 'export')) : ?>
		<li class="btn btn-default"><a href="<?=fuel_url($this->module_uri.'/export')?>" class="ico ico_export" id="export_data"><?=lang('btn_export_data')?></a></li>
	<?php endif; ?>
		
	<?php if ($this->fuel->auth->module_has_action('create') AND $this->fuel->auth->has_permission($this->permission, 'create')) : ?>
		<li class="end btn btn-primary"><a href="<?=fuel_url($create_url)?>" class="ico ico_create"><i class="fa fa-file-o"></i> <?=$this->create_action_name?></a></li>
	<?php endif; ?>
	
</ul>
<?php if (!empty($params['view_type'])) : ?>
    <?=$this->form->hidden('view_type', $params['view_type'])?>
<?php endif; ?>


	
<!--<a href="<?=fuel_url($this->module_uri.'/reset_page_state', FALSE)?>" class="reset btn btn-default"></a>-->
	
<div class="search_input<?php if ( ! empty($this->advanced_search)) : ?> advanced<?php endif; ?> col-xs-12 col-sm-4 col-md-6 form-inline pull-right" role="search">
	
	<div class="form-group pull-right">
	    <label for="limit"><?=lang('label_show')?></label> 
	    <?=$this->form->select('limit', $this->limit_options, $params['limit'], 'class="form-control input-sm"')?>
    </div>
    
	<div class="input-group pull-right">
	    <?=$this->form->search('search_term', $params['search_term'], 'placeholder="'.lang('label_search').'" class="form-control input-sm"')?>
	    <span class="input-group-btn">
	        <?=$this->form->submit(lang('btn_search'), 'search', 'class="btn btn-default btn-sm"')?>
	    </span>
	</div>
	
	<!-- Advanced Search -->
	<!-- //// -->
</div>