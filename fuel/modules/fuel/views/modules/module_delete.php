<div id="fuel_main_content_inner">
	<?php if (!empty($success)) : ?>

	<p class="instructions"><?=$success?></p>

	<?php else : ?>
	
	<p class="instructions"><?=lang('delete_item_message')?><br/> <span class="delete"><?=$title?></span></p>
	<?=$this->form->hidden('id', $id)?>

	<div class="buttonbar clearfix col-xs-12">
		<a href="<?=$back_action?>" class="btn btn-success ico_no"><?=lang('btn_no_dont_delete')?></a>
		<a href="#" class="btn btn-danger ico_yes" id="submit"><?=lang('btn_yes_dont_delete')?></a>
		</ul>
	</div>

	<?php endif; ?>
</div>