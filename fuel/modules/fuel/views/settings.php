<div id="fuel_main_content_inner">
<?php if (empty($settings)) : ?>
	<p class="instructions"><?=lang('settings_none')?></p>
<?php else : ?>
	<p class="instructions"><?=lang('settings_manage')?><p>
	
	<div class="boxbuttons">
		<ul class="module-thumb-list">
			<?php foreach ($settings as $key => $module) : ?>
			<li class="module-thumb col-xs-6 col-sm-4 col-md-2">
			    <a href="<?=site_url("fuel/settings/manage/{$module->folder()}")?>" alt="<?=$module->friendly_name()?>">
				    <span class="module-thumb-icon">
			            <i class="fa <?=$module->icon()?>"></i>
			        </span>
				    <p><?=$module->friendly_name()?></p>
			    </a>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
<?php endif; ?>
</div>