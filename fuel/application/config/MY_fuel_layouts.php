<?php 
/*
|--------------------------------------------------------------------------
| MY Custom Layouts
|--------------------------------------------------------------------------
|
| specify the name of the layouts and their fields associated with them
*/

$config['default_layout'] = 'main';

$config['layouts_folder'] = '_layouts';

$config['hidden'] = array();

$config['layouts']['main'] = array(
	'fields'	=> array(
		'Header' => array('type' => 'fieldset', 'label' => 'Header', 'class' => 'tab'),
		'page_title' => array('label' => lang('layout_field_page_title')),
		'meta_description' => array('label' => lang('layout_field_meta_description')),
		'meta_keywords' => array('label' => lang('layout_field_meta_keywords')),
		'Body' => array('type' => 'fieldset', 'label' => lang('layout_field_body'), 'class' => 'tab'),
		'heading' => array('label' => lang('layout_field_heading')),
		'body' => array('label' => lang('layout_field_body'), 'type' => 'textarea', 'description' => lang('layout_field_body_description')),
	)
);

$config['layouts']['galactic_layout'] = array(
	'fields'	=> array(
		'Header' => array('type' => 'fieldset', 'label' => 'Header', 'class' => 'tab'),
		'page_title' => array('label' => lang('layout_field_page_title')),
		'meta_description' => array('label' => lang('layout_field_meta_description')),
		'meta_keywords' => array('label' => lang('layout_field_meta_keywords')),
		'Body' => array('type' => 'fieldset', 'label' => lang('layout_field_body'), 'class' => 'tab'),
		'heading' => array('label' => lang('layout_field_heading')),
		'body' => array('label' => lang('layout_field_body'), 'type' => 'textarea', 'description' => lang('layout_field_body_description')),
		'top_background' => array('type' => 'asset', 'hide_options' => TRUE, 'label' => lang('layout_field_main_bg')),
		
		// image slider tab
		'Slider' => array('type' => 'fieldset', 'label' => 'Slider', 'class' => 'tab'),
		'slider_images' => array(
			'order' => 201,
			'display_label' => FALSE,
			'type'          => 'template', 
			'title_field'   => 'label',
			'fields'        => array(
				'section' => array('type' => 'section', 'value' => '__title__'),
				'label' => array('label' => 'Slider Name', 'required' => FALSE, 'comment' => lang('layout_field_body_description')),
				'image' => array('label' => 'Slider Image', 'type' => 'asset', 'hide_options' => TRUE, 'required' => TRUE, 'comment' => lang('layout_field_body_description')),
			),
			'class'         => 'repeatable',
			'add_extra'     => FALSE,
			'repeatable'    => TRUE,
			'value'			=> array(
				array('label' => 'Intergalactic Picture No 1', 'image' => 'galaxy.jpg', 'required' => 1),
			),
		)
	),
);

/* End of file MY_fuel_layouts.php */
/* Location: ./application/config/MY_fuel_layouts.php */
