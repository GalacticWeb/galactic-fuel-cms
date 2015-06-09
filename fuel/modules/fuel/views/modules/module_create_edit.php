<!-- RELATED ITEMS -->
<?php $this->load->module_view(FUEL_FOLDER, '_blocks/related_items'); ?>

<!-- NOTIFICATION EXTRA -->
<?php $this->load->module_view(FUEL_FOLDER, '_blocks/notification_extra'); ?>

<!-- WARNING WINDOW -->
<?php $this->load->module_view(FUEL_FOLDER, '_blocks/warning_window'); ?>


<div id="fuel_main_content_inner">

    <div class="panel panel-default">
        <div class="panel-heading">
            <?php if (!empty($instructions)) : ?>
                <h4 class="instructions"><?=$instructions?></h4>
            <?php endif; ?>
        </div>

        <div class="panel-body">
            <?=$form?>
        </div>
	</div>

</div>