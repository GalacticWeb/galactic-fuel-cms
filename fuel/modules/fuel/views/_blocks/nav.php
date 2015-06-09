<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?=site_url('', FALSE)?>"><i class="fa fa-rocket"></i> <?=$this->fuel->config('site_name')?></a>
    </div>


    <ul class="nav navbar-top-links navbar-right">          

        <?php if (!$this->fuel->admin->is_inline() AND !empty($user)) : ?>
        <?php //if (!$this->fuel->admin->is_inline()) : ?>
            <!-- User Profile Dropdown -->
            <li class="dropdown">
        
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                    <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>
                </a>                
                    <ul id="fuel_login_logout" class="dropdown-menu dropdown-user">
                        <!--<?=lang('logged_in_as')?>-->
                        <li><a href="<?=fuel_url('my_profile/edit/')?>"><i class="fa fa-user fa-fw"></i> <strong><?=$user['user_name']?></strong>'s Profile</a></li>
                        <?php if ($this->session->userdata('original_user_id') AND $this->session->userdata('original_user_hash')) : ?>
                            <li><a href="<?=fuel_url('users/login_as/' . $this->session->userdata('original_user_id') . '/' . $this->session->userdata('original_user_hash'))?>"><i class="fa fa-gear fa-fw"></i> <?=lang('logout_restore_original_user')?></a></li>
                        <?php endif; ?>
                        <li><a href="<?=fuel_url('logout')?>"><i class="fa fa-sign-out fa-fw"></i> <?=lang('logout')?></a></li>
                    </ul><!-- /.dropdown-user -->
            </li><!-- /.dropdown -->
        <?php endif; ?>  
        
    </ul><!-- /.navbar-right -->
    
    
    <div class="collapse navbar-collapse">
    
        <!-- SIDEBAR -->
        <div class="navbar-default sidebar" role="navigation">
            <div class="sidebar-nav">

				<?php 
					// // Get all modules
					$modules = $this->fuel->modules->get();
					$mods = $icons = array();
					        
					foreach($modules as $mod)
					{
						$info = $mod->info();
					    if(isset($info['icon_class']))
					    {
					        // Index modules by their uri so we know which module belongs to a specific nav item
					        $mods[$info['module_uri']] = isset($info['permission']) ? $info['permission'] : '';
					        // Use custom icon classes
					        $icons[$info['module_uri']] = isset($info['icon_class']) ? $info['icon_class'] : "ico_".url_title(str_replace('/', '_', $info['module_uri']),'_', TRUE);
					    }
					}
					
					foreach($nav as $section => $nav_items)
					{
						if (is_array($nav_items))
						{
							$header_written = FALSE;
							foreach($nav_items as $key => $val)
							{
								$segments = explode('/', $key);
								$url = $key;
								
								// Check for a specific module's permission                                
								$perm = (isset($mods[$key]) AND !is_array($mods[$key])) ? $mods[$key] : $key;
								
								if (($this->fuel->auth->has_permission($perm)) || $perm == 'dashboard')
								{
									if  (!$header_written)
									{
										$section_hdr = lang('section_'.$section);
										if (empty($section_hdr))
										{
											$section_hdr = ucfirst(str_replace('_', ' ', $section));
										}
										echo "<ul class=\"left_nav_section nav\" id=\"leftnav_".str_replace('/', '_', $section)."\">\n";
										echo "<li>\n";
										echo "<a href=\"#\">".$section_hdr."<span class=\"fa arrow\"></span></a>\n";
										echo "<ul class=\"nav nav-second-level\">\n";
									}
									echo "<li";
									if (preg_match('#^'.$nav_selected.'$#', $url))
									{
										echo ' class="active"';
									}
									// Use custom icons or default to key as class
									$icon = isset($icons[$key]) ? $icons[$key] : "ico_".url_title(str_replace('/', '_', $key),'_', TRUE);
									echo "><a href=\"".fuel_url($url)."\"><i class=\"fa ".$icon."\"></i> ".$val."</a></li>\n";
									$header_written = TRUE;
								} 
							}
						}
						else
						{
							$header_written = FALSE;
						}
						
						if  ($header_written)
						{
							echo "\t\t</ul>\n";
							echo "\t</li>\n";
							echo "</ul>\n";
						}
						
					}
				?>
			
			<!-- Recently Viewed -->
			<!-- ... removed -->

		    </div><!-- /.sidebar-nav -->
	    </div><!-- /.sidebar -->
	    
	</div><!-- /.navbar-collapse -->
</nav>
