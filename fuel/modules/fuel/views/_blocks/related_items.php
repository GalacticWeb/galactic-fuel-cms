<?php  if (!empty($related_items) AND ((is_array($related_items) AND current($related_items)) OR is_string($related_items)) OR !empty($versions) AND !$this->fuel->admin->is_inline()) : ?>

<div id="related_items" class="">
    <div class="panel panel-default">
        <!--<div class="panel-heading">Related Items</div>-->
        <div class="panel-body">
        
            <div class="col-xs-12 col-sm-6">
                <?php if (is_array($related_items)) : ?>
                    <?php $this->load->module_view(FUEL_FOLDER, '_blocks/related_items_array'); ?>
                <?php elseif (is_string($related_items)) : ?>
                    <?=$related_items?>
                <?php endif; ?>
            </div>
    
            <?php if (isset($action) AND $action == 'edit') : ?>
                <?php if (!empty($versions)) : ?>
                    <div class="col-xs-12 col-sm-6">
                        <div class="versions"><?=$this->form->select('fuel_restore_version', $versions, '', 'class="form-control input-sm pull-right"', lang('label_restore_from_prev'))?></div>
                        <?=$this->form->hidden('fuel_restore_ref_id', $id)?>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        
        </div>
	</div>
	
</div>

<?php endif; ?>