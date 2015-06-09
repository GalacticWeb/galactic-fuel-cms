<?php 
// set some render variables based on what is in the panels array
$no_menu = (!$this->fuel->admin->has_panel('nav')) ? TRUE : FALSE;
$no_titlebar = (!$this->fuel->admin->has_panel('titlebar')) ? TRUE : FALSE;
$no_actions = (!$this->fuel->admin->has_panel('actions') OR empty($actions)) ? TRUE : FALSE;
$no_notification = (!$this->fuel->admin->has_panel('notification')) ? TRUE : FALSE;
?>

<?php $this->load->module_view(FUEL_FOLDER, '_blocks/fuel_header');  ?>

<body>

<div id="fuel_body"<?=($this->fuel->admin->ui_cookie('leftnav_hide') === '1') ? ' class="nav_hide"' : ''; ?>>


	<?php if ($this->fuel->admin->has_panel('nav')) : ?>
	<!-- LEFT MENU PANEL -->
	<?php $this->load->module_view(FUEL_FOLDER, '_blocks/nav'); ?>
	<?php endif; ?>

	
	<div id="fuel_main_panel<?=($no_menu) ? '_compact' : ''?>">

    	<?=$this->form->open('action="'.$form_action.'" method="'.((!empty($form_method)) ? $form_method : 'post').'" id="form" enctype="multipart/form-data" class="container-fluid '.((!empty($form_css)) ? $form_css : '').'"')?>	

            <?php if ($this->fuel->admin->has_panel('titlebar')) : ?>
                <!-- BREADCRUMB/TITLE BAR PANEL -->
                <div class="row">
                    <?php $this->load->module_view(FUEL_FOLDER, '_blocks/titlebar')?>
                </div>
            <?php endif; ?>


            <?php 
                $main_content_class = '';
                if($no_actions AND $no_notification) :
                    $main_content_class = 'noactions_nonotification';
                elseif($no_actions AND $no_titlebar) :
                    $main_content_class = 'noactions_notitlebar';
                elseif ($no_titlebar) :
                    $main_content_class = 'notitlebar';
                elseif ($no_actions) :
                    $main_content_class = 'noactions';
                endif;
             ?>
 
     
            <div class="row" id="fuel_main_content<?=($no_menu) ? '_compact' : ''?>"<?=(!empty($main_content_class)) ? ' class="'.$main_content_class.'"' : ''?>>
    
                <?php if ($this->fuel->admin->has_panel('notification')) : ?>
                    <!-- NOTIFICATION PANEL -->
                    <div id="fuel_notification" class="notification">
                        <?php if (!empty($notifications)) : ?>
                            <?=$notifications?>
                        <?php endif; ?>
                        <?php if (!empty($pagination)): ?>
                            <ul id="pagination" class="pagination pagination-sm"><?=$pagination?></ul>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
    
                <?php /* ?><?=$this->form->open('action="'.$form_action.'" method="post" id="form" enctype="multipart/form-data"')?><?php */ ?>

                <!-- BODY -->
                <?=$body?>
    
                <?=$this->form->hidden('fuel_inline', (int)$this->fuel->admin->is_inline())?>
            </div>
                
        <?=$this->form->close()?><!-- /fuel_main_panel form -->
	</div><!-- /fuel_main_panel -->
	
</div>

<div id="fuel_modal" class="modal fade" aria-hidden="true" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Modal title</h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer"></div>
        </div>
    </div>
</div>

<?php $this->load->module_view(FUEL_FOLDER, '_blocks/fuel_footer');  ?>

</body>
</html>