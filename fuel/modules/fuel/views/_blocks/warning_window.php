<?php if (!empty($warning_window)) : ?>
	<div class="warning jqmWindow jqmWindowShow" id="warning_window">
		<div class="modal_content_inner">
			<p><?=$warning_window?></p>
		
			<div class="col-xs-12" id="yes_no_modal">
				<a href="#" class="btn btn-danger" id="no_modal"><?=lang('btn_no')?></a>
				<a href="#" class="btn btn-success" id="yes_modal"><?=lang('btn_yes')?></a>
			</div>
			<div class="clear"></div>
		</div>
	</div>
<?php endif; ?>