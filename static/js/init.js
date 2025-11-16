(function($, fnFrontend){
	"use strict";
	
	var FrenifyMow = {
		
		init: function() {

			var widgets = {
				'frel-posts.default' : FrenifyMow.posts,
				'frel-search.default' : FrenifyMow.searchMarquee,
				'frel-categories.default' : FrenifyMow.categories,
				'frel-title.default' : FrenifyMow.categoryMarquee,
				'frel-youtube-list.default' : FrenifyMow.youtube_list,
				'frel-gallery.default' : FrenifyMow.gallery,
			};

			$.each( widgets, function( widget, callback ) {
				fnFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			});
		},
		gallery: function(){
			FrenifyMow.lightGallery();	
			FrenifyMow.justified();	
			FrenifyMow.masonry();	
			FrenifyMow.galler_slider();	
			FrenifyMow.mosaic();	
		},
		
		mosaic: function(){
			$('.fn__cs_gallery_mosaic').each(function(){
				var e = $(this),
					w = e.width(),
					hgap = e.data('hgap'),
					vgap = hgap,
					r;
				if(w > 1200){
					r = 6;
				}else {
					r = 3;
				}
				w = w - (r-1)*vgap;
				var www = ((2 * w / r) - hgap * (-1) * (r-1))/2;
				var www2 = ((2 * w / r) - hgap * (r-1))/2;
				
				var itemsPerDiv = r;
				var $list = e.find('.listt');
				var $items = $list.children('li');

				// Create div containers and append items
				for (var i = 0; i < $items.length; i += itemsPerDiv) {
					var $div = $('<div class="item-group"></div>');
					var $ul = $('<ul></ul>');
					$items.slice(i, i + itemsPerDiv).appendTo($ul);
					$ul.appendTo($div);
					$div.appendTo(e);
				}

				// Remove the original ul
				$list.remove();
				
				e.find('.item-group:even').each(function(){
					$(this).find('li').each(function(){
						var li = $(this);
						li.css({width: (www + (li.index()%r)*hgap*(-1))/w * 100 + '%'});
					});
				});
				
				e.find('.item-group:odd').each(function(){
					$(this).find('li').each(function(){
						var li = $(this);
						li.css({width: (www2 + (li.index()%r)*hgap) / w * 100 + '%'});
					});
				});
			});
		},
		
		galler_slider: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn__cs_gallery_slider .swiper-container').each(function(){
				var element				= $(this);
				var object = {
					init: function(){
						this.autoplay.stop();
					},
					imagesReady: function(){
						this.autoplay.start();
					},
				};
				var direction 			= 'horizontal';
				// Main Slider
				var mainSliderOptions 	= {
					loop: true,
					rtl: rtl,
					speed: 1500,
					spaceBetween: 20,
					autoplay:{
						delay: 6000,
						disableOnInteraction: false,
					},
					slidesPerView: 4,
					direction: direction,
					loopAdditionalSlides: 20,
					watchSlidesProgress: true,
					touchStartPreventDefault: false,
					on: object
				};
				new Swiper(element, mainSliderOptions);
			});
			// FrenifyMow.svg();
		},
		
		
		
		masonry: function(){
			var masonry = $('.fn__masonry');
			if($().isotope){
				masonry.each(function(){
					$(this).isotope({
						itemSelector: '.mas__in',
						masonry: {}
					});
				});
			}
		},
		
		justified: function(){
			FrenifyMow.lightGallery();
			var justified = $(".fn__justified_gallery");
			justified.each(function(){
				var element 	= $(this);
				var height		= parseInt(element.attr('data-height'));
				var gutter		= parseInt(element.attr('data-gutter'));
				if(!height || height === 0){height = 300;}
				if(!gutter || gutter === 0){gutter = 20;}
				if($().justifiedGallery){
					element.justifiedGallery({
						rowHeight : height,
						lastRow : 'nojustify',
						margins : gutter,
						refreshTime: 500,
						refreshSensitivity: 0,
						maxRowHeight: null,
						border: 0,
						captions: false,
						randomize: false
					});
				}
			});
		},

		lightGallery: function(){
			if($().lightGallery){
				// FIRST WE SHOULD DESTROY LIGHTBOX FOR NEW SET OF IMAGES

				var gallery = $('.fn__lightbox_wrap');

				gallery.each(function(){
					var element = $(this);
					element.lightGallery(); // binding
					if(element.length){element.data('lightGallery').destroy(true); }// destroying
					element.lightGallery({
						selector: ".fn__lightbox_item",
						addClass: 'fn__lightgallery_lightbox',
						thumbnail: 1,
						loadYoutubeThumbnail: !1,
						loadVimeoThumbnail: !1,
						showThumbByDefault: !1,
						mode: "lg-fade",
						download: !1,
						getCaptionFromTitleOrAlt: !1,
					});
				});
			}	
		},

		
		youtube_list: function(){
			var ytlist = $('.fn_cs_youtube_list');
			if(ytlist.length){
				ytlist.each(function(){
					var $parent = $(this);
					var $player = $parent.find('.ylist_player');

					var $videopart = $parent.find('.video_part');
					var iframes = $videopart.html();
					$videopart.html('');
					var $iframes = $(iframes);
					$videopart.html($iframes.eq(0));
					$parent.find('.list_part li').off().on('click',function(){
						var $item = $(this);
						var $currentElement = $iframes.eq($item.index());
						if(!$item.hasClass('active')){
							$item.siblings('.active').removeClass('active');;
							$item.addClass('active');
							$videopart.html($currentElement);
						}
					});
				});
			}
		},

		posts: function(){
			FrenifyMow.posts_epsilon();
			FrenifyMow.posts_fslider();
			FrenifyMow.posts_cslider();
			FrenifyMow.posts_carousel();
			FrenifyMow.posts_yota();
			FrenifyMow.posts_interactive();
			FrenifyMow.categoryMarquee();
		},

		posts_interactive: function(){
			if($('.fn__widget_posts_interactive').length){
				$('.fn__widget_posts_interactive .interactive_item').on('mouseenter',function(){
					var $item = $(this),
					$parent = $item.closest('.fn__widget_posts_interactive'),
					$index = $item.index();
					$parent.find('.bg_list li.active').removeClass('active');
					$parent.find('.bg_list li:nth-child('+($index+1)+')').addClass('active');
				});
			}
		},

		posts_yota: function(){
			$('.fn__widget_posts_yota .col_secondary .item').on('mouseenter',function(){
				var element = $(this);
				var parent = element.closest('.fn__widget_posts_yota');
				parent.find('.col_primary .item.active').removeClass('active');
				element.siblings('.active').removeClass('active');
				parent.find('.col_primary .item:nth-child('+(element.index()+1)+')').addClass('active');
				element.addClass('active');
			});
			$('.fn__widget_posts_yota .col_secondary .nav-buttons .next-button').off().on('click',function(){
				var element 		= $(this);
				var parent 			= element.closest('.fn__widget_posts_yota');
				var secondaryItems 	= parent.find('.col_secondary .item');
				var primaryItems 	= parent.find('.col_primary .item');
				var index 			= parent.find('.col_secondary .item.active').index();
				var nextIndex = (index+1)%secondaryItems.length;
				secondaryItems.removeClass('active');
				primaryItems.removeClass('active');
				secondaryItems.eq(nextIndex).addClass('active');
				primaryItems.eq(nextIndex).addClass('active');
				
				
				if(parent.attr('data-layout') === 'yota_1'){
					var scrollContainer = parent.find('.col_secondary .col_in');
					var scrollTo = secondaryItems.eq(nextIndex).position().top + scrollContainer.scrollTop() - 50;
					var scroll = parent.find('.col_secondary .col_in');

					 scroll.stop().animate({
						scrollTop:scrollTo
					}, 'slow');
				}else{
					var translateX = -secondaryItems.eq(nextIndex).position().left;
					parent.find('.col_inn').css({transform: 'translateX('+translateX+'px)'});
				}
					
				return false;
			});
			$('.fn__widget_posts_yota .col_secondary .nav-buttons .prev-button').off().on('click',function(){
				var element 		= $(this);
				var parent 			= element.closest('.fn__widget_posts_yota');
				var secondaryItems 	= parent.find('.col_secondary .item');
				var primaryItems 	= parent.find('.col_primary .item');
				var index 			= parent.find('.col_secondary .item.active').index();
				var nextIndex = (index+secondaryItems.length-1)%secondaryItems.length;
				secondaryItems.removeClass('active');
				primaryItems.removeClass('active');
				secondaryItems.eq(nextIndex).addClass('active');
				primaryItems.eq(nextIndex).addClass('active');
				
				
				if(parent.attr('data-layout') === 'yota_1'){
					var scrollContainer = parent.find('.col_secondary .col_in');
					var scrollTo = secondaryItems.eq(nextIndex).position().top + scrollContainer.scrollTop() - 50;
					var scroll = parent.find('.col_secondary .col_in');

					 scroll.stop().animate({
						scrollTop:scrollTo
					}, 'slow');
				}else{
					var translateX = -secondaryItems.eq(nextIndex).position().left;
					parent.find('.col_inn').css({transform: 'translateX('+translateX+'px)'});
				}
					
				return false;
			});
		},

		categories: function(){
			FrenifyMow.categoryMarquee();
			FrenifyMow.categoryCarousel();
			FrenifyMow.categoryVInteractive();
			FrenifyMow.categoryHInteractive();
		},

		categoryVInteractive: function(){
			var $interactive = $('.fn_cs_cats_v_interactive');
			var $cursor = $('<div class="fn_cs_cats_v_ccc"></div>');
			
			if ($interactive.length) {
				$('body').append($cursor);
			}

			// Track mouse position globally on the body
			$('body').on('mousemove', function(e) {
				$cursor.css({
					top: e.clientY + 25,
					left: e.clientX + 25
				});
			});

			// Add class and update content when hovering over the target element
			$('.fn_cs_cats_v_interactive .item_list').on('mouseenter mousemove', function() {
				var $item = $(this),
					$img = $item.find('.img_holder');
				$cursor.css({backgroundImage: 'url(' + $img.data('url') + ')'}).html('').html($img.find('.sub').html()).addClass('opened');
			}).on('mouseleave', function() {
				$cursor.removeClass('opened');
			});
		},

		categoryHInteractive: function(){
			var $interactive = $('.fn_cs_cats_h_interactive');
			var $cursor = $('<div class="fn_cs_cats_h_ccc"></div>');
			
			if ($interactive.length) {
				$('body').append($cursor);
			}

			// Track mouse position globally on the body
			$('body').on('mousemove', function(e) {
				$cursor.css({
					top: e.clientY + 25,
					left: e.clientX + 25
				});
			});

			// Add class and update content when hovering over the target element
			$('.fn_cs_cats_h_interactive .item_list').on('mouseenter mousemove', function() {
				var $item = $(this),
					$img = $item.find('.img_holder');
				$cursor.css({backgroundImage: 'url(' + $img.data('url') + ')'}).html('').html($img.find('.sub').html()).addClass('opened');
			}).on('mouseleave', function() {
				$cursor.removeClass('opened');
			});
		},

		categoryCarousel: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn_cs_cats_carousel .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 0,
					navigation: {
						nextEl: $(this).closest('.fn_cs_cats_carousel').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn_cs_cats_carousel').find('.swiper-button-prev')[0],
					},
					slidesPerView: 'auto',
					autoplay: false,
				});
			});	
		},

		categoryMarquee: function(){
			var direction = $('body').hasClass('rtl') ? 'right' : 'left';

			$(".fn__cs_title_smarquee .marquee").each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						speed: 50,
						delayBeforeStart: 0,
						direction: direction,
						pauseOnHover: false,
						startVisible: true
					});
				}
			});

			$(".fn_cs_cats_big_marquee .marquee").each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						speed: 50,
						delayBeforeStart: 0,
						direction: direction,
						pauseOnHover: false,
						startVisible: true
					});
				}
			});

			$(".fn__widget_posts_boxed_marquee .marquee").each(function(){
				var e = $(this);
				direction = e.closest(".fn__widget_posts_boxed_marquee").data("direction");
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						speed: 50,
						delayBeforeStart: 0,
						direction: direction,
						pauseOnHover: false,
						startVisible: true
					});
				}
			});
			
			$(".fn_cs_cats_small_marquee .marquee").each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						speed: 30,
						delayBeforeStart: 0,
						direction: direction,
						pauseOnHover: true,
						startVisible: true
					});
				}
			});	
		},

		searchMarquee: function(){
			var direction = $('body').hasClass('rtl') ? 'right' : 'left';
			$(".fn_cs_searchbox .marquee").each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						speed: 50,
						delayBeforeStart: 0,
						direction: direction,
						pauseOnHover: false,
						startVisible: true
					});
				}
			});	
		},

		posts_carousel: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn__widget_posts_gcarousel .swiper').each(function() {
				var $item = $(this);
				var autoplay = $item.data('slider-autoplay');
				var loop = true;
				if(autoplay === 'enable'){
					autoplay = {delay: 7000,disableOnInteraction: false};
				}else{
					autoplay = false;
					loop = false;
				}
				var cols = $item.data('cols');
				var max1201, max1041, max1401;
				if(cols == 'col_2'){
					max1201 = 2;
					max1041 = 2;
					max1401 = 2;
				}else if(cols == 'col_3'){
					max1201 = 3;
					max1401 = 3;
				}else if(cols == 'col_4'){
					max1401 = 4;
					max1201 = 4;
					max1041 = 3;
				}else if(cols == 'col_5'){
					max1401 = 5;
					max1201 = 4;
					max1041 = 3;
				}
				const swiper = new Swiper($item[0], {
					loop: loop,
					rtl: rtl,
					speed: 500,
					spaceBetween: 30,
					navigation: {
						nextEl: $item.closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $item.closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: max1401,
					autoplay: autoplay,
					breakpoints: {
						0: {
							slidesPerView: 1,
						},
						769: {
							slidesPerView: 2,
						},
						1041: {
							slidesPerView: max1041,
						},
						1201: {
							slidesPerView: max1201,
						},
						1401: {
							slidesPerView: max1401,
						},
					}
				});
			});
			$('.fn__widget_posts_fcarousel .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 0,
					navigation: {
						nextEl: $(this).closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: 1,
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
				});
			});
			$('.fn__widget_posts_alpha .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 30,
					navigation: {
						nextEl: $(this).closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: 3,
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
					breakpoints: {
						0: {
							slidesPerView: 1,
						},
						769: {
							slidesPerView: 2,
						},
						1041: {
							slidesPerView: 3,
						},
					}
				});
			});
			$('.fn__widget_posts_mcarousel .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 0,
					navigation: {
						nextEl: $(this).closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: 1,
					autoplay: {
						delay: 70000,
						disableOnInteraction: false,
					},
				});
			});
		},

		posts_fslider: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn__widget_posts_fslider .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 0,
					navigation: {
						nextEl: $(this).closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: 1,
					autoplay: {
						delay: 700000,
						disableOnInteraction: false,
					},
				});
			});
		},

		posts_cslider: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn__widget_posts_cslider .swiper').each(function() {
				const swiper = new Swiper($(this)[0], {
					loop: true,
					rtl: rtl,
					speed: 500,
					spaceBetween: 50,
					navigation: {
						nextEl: $(this).closest('.fn__circle_slider').find('.swiper-button-next')[0],
						prevEl: $(this).closest('.fn__circle_slider').find('.swiper-button-prev')[0],
					},
					slidesPerView: 1,
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
				});
			});
		},

		posts_epsilon: function(){
			var rtl = $('body').hasClass('rtl') ? true : false;
			$('.fn__widget_posts_epsilon .swiper').each(function(){
				var swiper = $(this),
				parent = swiper.closest('.fn__circle_slider'),
				item = parent.find('.epsilon_item'),
				timeoutId,
				progressbar = parent.find('.progress-bar'),
				progressContainer = parent.find('.fn-block-progress-circle');

				new Swiper(swiper[0], {
					effect: 'fade',
					direction: 'horizontal',
					loop: false,
					rtl: rtl,
					speed: 500,
					spaceBetween: 0,
					slidesPerView: 1,
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
					on: {
						init: function(){
							if(item.length > 1){
								progressContainer.addClass('active');
							}
						},
						slideChange: function(){
							if(item.length > 1){
								var circumference = 2 * Math.PI * 15;
								progressbar.css({
									'transition-duration': '0s',
									'stroke-dashoffset': circumference
								});
								clearTimeout(timeoutId);
								timeoutId = setTimeout(function(){
									progressbar.css({
										'transition-duration': '7s',
										'stroke-dashoffset': 0
									});
								},10);
							}
								
						},
					}
				});

			});
		},
		
	};
	
	$( window ).on( 'elementor/frontend/init', FrenifyMow.init );
	
	
})(jQuery, window.elementorFrontend);