<div id="fuel_main_top_panel" class="col-lg-12">
	
	<div class="row">
        <ul class="col-xs-12 breadcrumb">
            <?php if (!empty($titlebar)) : ?>
                <?php if (is_array($titlebar)) : ?>
                    <?php $last_key = array_pop($titlebar);
                    foreach($titlebar as $url => $crumb) : ?>
                        <?php if (!$this->fuel->admin->is_inline()) : ?>
                            <li><a href="<?=fuel_url($url)?>"><i class="fa <?=$titlebar_icon?>"></i>
                        <?php endif; ?>
                        <?=$crumb?>
                        <?php if (!$this->fuel->admin->is_inline()) : ?>
                            </a></li>
                        <?php endif; ?>
                    <?php endforeach; ?>
                    <li>
                        <?php if(count($titlebar) == 0) { echo '<i class="fa '.$titlebar_icon.'"></i>'; } ?>
                        <?=$last_key?>
                    </li>
                <?php else: ?>
                    <li><i class="fa <?=$titlebar_icon?>"></i> <?=$titlebar?></li>
                <?php endif; ?>
            <?php endif; ?>
            
        </ul>
	</div>
	
	<!-- ACTION PANEL -->
    <?php if ($this->fuel->admin->has_panel('actions') AND !empty($actions)) : ?>
        <div id="fuel_actions" class="row">
            <?php if (!empty($actions)) : ?>
                <?=$actions?>
            <?php endif; ?>
        </div>    
    <?php endif; ?>
	
</div>
