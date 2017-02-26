(function($, window, document, undefined){

	customScripts = []; // namespace

	// get user agent
	customScripts.ua = navigator.userAgent;
	customScripts.mobileOS = customScripts.ua.match(/Android|iPhone|iPod/) ? true : false;
	customScripts.mobileLegacy = customScripts.ua.match(/Android 2/) ? true : false;

	// transition
	customScripts.transition = (!customScripts.ua.match(/MSIE 8/) && !customScripts.ua.match(/MSIE 9/)) ? true : false;

	// onload
	$(function(){

		// set layout mode
		// --------------------------------------------------------------------------------
		customScripts.breakpoint = 767;
		customScripts.mode = null;

		var setDisplaySize = function(d){

			customScripts.mode = d;
			$('body').attr('id', customScripts.mode );
			$(window).trigger('modeChange');
		}

		// addevent
		// ..................................................
		// IE8: fix PC mode
		if(customScripts.ua.match(/MSIE 8/)) {
			customScripts.mode = 'is-pc';
			$('body').attr('id', 'is-pc').addClass('is-ie8');
		}
		// mobileOS: fix SP mode
		else if(customScripts.mobileOS) {
			customScripts.mode = 'is-sp';
			$('body').attr('id', 'is-sp');
			if(customScripts.mobileLegacy) $('body').addClass('is-android2');
			else if(customScripts.ua.match(/Android 4/)) $('body').addClass('is-android4');
		}
		// PC: flexible mode
		else {
			$(window).on('resize', function(){
				var w = window.innerWidth;
				var displaySize = w <= customScripts.breakpoint ? 'is-sp' : 'is-pc';
				if($('body').attr('id') != displaySize) setDisplaySize(displaySize);
			});

			var w = window.innerWidth;
			var displaySize = w <= customScripts.breakpoint ? 'is-sp' : 'is-pc';
			setDisplaySize(displaySize);
		}

		// [sample] mode change event
		var debug_modeChange = function(){
			console.log(customScripts.mode);
		}
		$(window).on('modeChange', debug_modeChange);



		// navigation
		// --------------------------------------------------------------------------------
		customScripts.navigation = function(option){
			var self = this,

				o = $.extend({
					button: $('#btn_nav'),
					nav: $('#navigation'),
					base: $('body'),
					trigger: $('.area-main')
				}, option),

				transitionEvent = 'webkitTransitionEnd transitionend';

			self.act_nav = function(){

				// SP and noTransitionBrowser
				if(customScripts.mode == 'is-sp' || !customScripts.transition) {
					o.base.toggleClass('is-navi-open');
					o.nav.toggleClass('list');
					o.button.toggleClass('close');
				}

				// PC modernBrowser
				else {
					o.base.toggleClass('is-navi-open');
					o.nav.toggleClass('list');
					o.button.toggleClass('close');
				}
			}

			// addevent
			// ..................................................
			// smart phone
			if(customScripts.mode == 'is-sp') {
				o.button[0].addEventListener('touchstart', function(e){
					e.preventDefault();
					self.act_nav();
				}, false);
			}
			// PC
			o.button.on('click', function(){
				self.act_nav();
				return false;
			});

		}

		// follow navigation
		// ..................................................
		customScripts.spFollowNavigation = function(){
			var self = this,

				distance = {
					start: 0,
					end: 0,
					diff: 0
				},
				swipe_time = {
					start: 0,
					end: 0,
					diff: 0
				},

				transitionEvent = 'webkitTransitionEnd transitionend',

				base = $('.area-main');

			$('body').css({paddingTop: 50});
			$('.area-header').addClass('is-follow');
			distance.start = distance.end = $(window).scrollTop();

			self.swipeStart = function(){
				distance.start = distance.end =  event.changedTouches[0].clientY;
				swipe_time.start = swipe_time.end = new Date();
			}
			self.swipeMove = function(){
				distance.end =  event.changedTouches[0].clientY;
				distance.diff = distance.end - distance.start;

				var diff = distance.end - distance.start;
				if(distance.diff < 50) $('body').removeClass('is-scrolltop');
				if(distance.diff < 0) $('.is-follow').addClass('is-hide');
			}
			self.swipeEnd = function(){
				swipe_time.end = new Date();
				swipe_time.diff = swipe_time.end - swipe_time.start;

				var diff = distance.end - distance.start;

				// 1秒以内 10px以上移動したのタップのみ取得
				if(swipe_time.diff < 1000) {
					if(diff < 10) $('.is-follow').addClass('is-hide');
					else $('.is-follow').removeClass('is-hide');
				}
			}

			base[0].addEventListener('touchstart', self.swipeStart, false);
			base[0].addEventListener('touchmove', self.swipeMove, false);
			base[0].addEventListener('touchend', self.swipeEnd, false);
		}

		$('#navigation').each(function(){
			var glovalNavigation = new customScripts.navigation();
			if(!customScripts.ua.match(/Android/) && customScripts.mode == 'is-sp') {
				var followNav = new customScripts.spFollowNavigation();
			}

			if(customScripts.transition) {
				window.setTimeout(function(){
					$('body').addClass('is-transition');
				},10)
			}
		});

		// mode change event
		var navigation_modeChange = function(){
			if(!customScripts.ua.match(/Android/) && customScripts.mode == 'is-sp') {
				$('body').css({paddingTop: 50});
				$('.area-header').addClass('is-follow');
			}
			else {
				$('body').css({paddingTop: ''});
				$('.area-header').removeClass('is-follow');
			}
		}
		$(window).on('modeChange', navigation_modeChange);



		// is-scrolltop
		// --------------------------------------------------------------------------------
		customScripts.footerHeight = 0;　// footer parallax effect： 見た目上のfooterがすべて展開された時の高さ

		$(window).on('load scroll', function(){
			var t = $(this).scrollTop();
			if(t < $('.area-header').height()) {
				$('body').addClass('is-scrolltop');
				$('#navigation').removeClass('footer');
			}
			else {
				$('body').removeClass('is-scrolltop');
				$('#navigation').addClass('footer');
			}

			var banner = $('.area-banner').length ? $('.area-banner').height() : 0;
			var window_h = customScripts.ua.match(/MSIE 8/) ? $(window).height() : window.innerHeight;
			var pagetop_position = $('.area-header').height() + banner + $('.area-main').innerHeight() - window_h - $('a.recruit').innerHeight();


			// homepage only
			if($('.area-banner').length) {
				pagetop_position -= 132;
			}

			// button pagetop position
			$('#btn_page-top').css({
				position: 'fixed',
				display: customScripts.mode == 'is-sp' ? 'table-cell' : 'inline'
			});
			if(t >= pagetop_position) {
				$('#btn_page-top').addClass('is-static');
			}
			else {
				$('#btn_page-top').removeClass('is-static');
			}

			// footer parallax effect
			var footer = $('.area-footer, #navigation');

			var footerScrollTop = t - pagetop_position; // 見た目上のfooterへ到達するまでのスクロール距離

			// 見た目上のfooterがすべて展開された時の高さ
			if(customScripts.footerHeight < $('body').height() - (pagetop_position + window_h)) {
				customScripts.footerHeight = $('body').height() - (pagetop_position + window_h);
			}

			var footerTop = (customScripts.footerHeight - footerScrollTop) * -0.5;

			// PC版 & スクロール先頭ではない &　#btn_page-topの固定配置が解除されるところまでスクロールしている場合
			if((customScripts.mode == 'is-pc') && (!customScripts.ua.match(/iPad/)) && (t >= $('.area-header').height()) && (t >= pagetop_position)) {
				footer.css({
					top: footerTop
				});
			}
			else {
				footer.css({top: ''});
			}

		});
		// footer parallax effect： メニューを閉じた時に途中状態のパララックス効果を適用
		$(window).on('modeChange', function(){
			$(this).trigger('scroll');
		});



		// page top
		// --------------------------------------------------------------------------------
		$('#btn_page-top').each(function(){
			if(customScripts.mode == 'is-sp') {
				$('#btn_page-top')[0].addEventListener('touchstart', function(e){
					e.preventDefault();
					$('html,body').animate({scrollTop: 0},200);
				}, false);
			}
			// PC
			$('#btn_page-top').on('click', function(){
				$('html,body').animate({scrollTop: 0},200);
				return false;
			});
		});



		// PC tel link
		// --------------------------------------------------------------------------------
		$('a[href^=tel]').on('click', function(){
			if(customScripts.mode == 'is-pc') return false;
		});



		// toggle
		// --------------------------------------------------------------------------------
		$('.js-toggle').children('.head').on('click', function(){
			$(this).parents('.js-toggle').toggleClass('is-current');
		});



		// get news
		// --------------------------------------------------------------------------------
		customScripts.getNews = function(option){
			var o = $.extend({
					address: '/api/news.jsp', // API
					target: '.news-list', // 出力先DOM
					size: 3 // 読込件数（先頭からカウント）　0指定で全件読込
				}, option);

			$.ajax({
				type: 'POST',
				url: o.address,
				dataType: 'json',
				success: function(data){
					var size = o.size < 1 ? data.length : data.length < o.size ? data.length : o.size;
					for(var i = 0; i < size; i ++) {

						var item = $(
							'<div class="article js-accordion">' +
							'	<div class="head">' +
							'		<div class="date">' + data[i].date + '</div>' +
							'		<div class="type">' + data[i].type + '</div>' +
							'		<h2>' + data[i].subject + '</h2>' +
							'	</div>' +
							'	<div class="body">' +
							data[i].body +
							'	</div>' +
							'</div>'
						).each(function(){
							$(this).children('.head').on('click', function(){
								$(this).parents('.js-accordion').toggleClass('is-current').siblings('.js-accordion').removeClass('is-current');
							});
						});
						item.appendTo(o.target);
					}
				}
			});
		};
		$('#js-news-list').each(function(){

			//$(this).load("/news-list.html"); 
			/*
			customScripts.getNews({
				size: $(this).hasClass('body') ? 3 : 0 // .news-list.bodyなら3件のみ取得
			});
			*/
		})



		// narrow works list
		// --------------------------------------------------------------------------------
		$('.relation-search a').on('click', function(){

			// narrow flag
			window.sessionStorage.setItem('customScripts_narrow', true);

			// industries
			if($(this).attr('data-industries')) {
				window.sessionStorage.setItem('customScripts_industries', $(this).attr('data-industries'));
			}
			else {
				window.sessionStorage.removeItem('customScripts_industries');
			}

			// services
			if($(this).attr('data-services')) {
				window.sessionStorage.setItem('customScripts_services', $(this).attr('data-services'));
			}
			else {
				window.sessionStorage.removeItem('customScripts_services');
			}

		});



	});

})(jQuery, this, this.document);