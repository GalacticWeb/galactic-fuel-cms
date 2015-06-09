<div id="fuel_main_content_inner">

<p class="instructions"><?=lang('cache_instructions')?></p>
<?=$this->form->open(array('id' => 'form', 'method' => 'post'))?>

<div class="col-xs-12">
    <a href="<?=fuel_url('manage/')?>" class="ico ico_no btn btn-success"><?=lang('cache_no_clear')?></a>
	<a href="#" class="ico ico_yes btn btn-danger" id="submit"><?=lang('cache_yes_clear')?></a>
</div>

<?=$this->form->hidden('action', 'cache')?>
<?=$this->form->close()?>