(function($, window, document, undefined){

	var isie8 = customScripts.ua.match(/MSIE 8/) ? true : false;
	var isipad = customScripts.ua.match(/iPad/) ? true : false;

	// onload
	$(function(){


		// parallax
		// --------------------------------------------------------------------------------

		// main-visual
		$('.banner').each(function(){

			if(!isipad && !isie8 && (customScripts.mode == 'is-pc')) {

				var add_class = function(){
					var t = $('.banner').offset().top;
					if(t <= $(window).scrollTop()) {
						$('body').addClass('is-visual-bg-fixed');

						// parallax...固定配置の背景のtop値をスクロールの1/2の速度で加算し遠近感を出す
						var positionY = ($(window).scrollTop() - t) * -0.5;
						$('.banner .scene').css({backgroundPosition: 'center ' + positionY + 'px'});
					}
					else {
						$('body').removeClass('is-visual-bg-fixed');

						// parallax
						$('.banner .scene').css({backgroundPosition: ''});
					}
				}
				$(window).on('load scroll', add_class);
			}
			
		});

		// homepage
		$('.area-banner').each(function(){

			if(!isipad && !isie8 && (customScripts.mode == 'is-pc')) {

				// parallax...固定配置の背景のtop値をスクロールの1/2の速度で加算し遠近感を出す
				var act_parallax = function(){
					var t = $('.area-header').height();
					if(t <= $(window).scrollTop()) {
						var positionY = ($(window).scrollTop() - t) * -0.5;
						$('#video').css({top: positionY + 'px'});
					}
					else {
						$('#video').css({top: ''});
					}
				}

				$(window).on('load scroll', act_parallax);
			}

		});



		// slider
		// --------------------------------------------------------------------------------
		$('.banner').each(function(){

			var sliderSize = $(this).find('.scene').size();
			var current = 0;
			var preview;

			if(sliderSize > 1) {

				var btnPrev = $('<span class="btn-prev" role="button"></span>');
				var btnNext = $('<span class="btn-next" role="button"></span>');
				var pageing = $('<ul class="pageing"></ul>');

				var autoPlayTimer;

				$(this).addClass('is-slide').append(pageing);


				// init
				// ..................................................
				current = 1;
				$('.scene[data-scene='+current+']').addClass('is-current');
				for(var i=0; i<sliderSize; i++) {
					pageing.append('<li data-scene="'+(i+1)+'"></li>');
				};
				pageing.find('li[data-scene='+current+']').addClass('is-current').siblings().removeClass('is-current');

				// set autoPlay
				autoPlayTimer = setInterval(function(){
					act_change(1)
				}, 4000);


				// current change
				// ..................................................
				var act_change = function(direction) {
					preview = current;

					var next = current + direction;
					current = next == 0 ? sliderSize : next > sliderSize ? 1 : next;

					$('.scene').removeClass('is-current').removeClass('is-preview');
					$('.scene[data-scene='+preview+']').addClass('is-preview');
					$('.scene[data-scene='+current+']').addClass('is-current');
					$('.pageing').find('li[data-scene='+current+']').addClass('is-current').siblings().removeClass('is-current');

					// reset autoPlay
					clearInterval(autoPlayTimer);
					delete autoPlayTimer;
					autoPlayTimer = setInterval(function(){
						act_change(1)
					}, 4000);
				}

				if((customScripts.mode == 'is-pc') && !isipad) {
					$(this).append(btnPrev).append(btnNext);

					// prev
					btnPrev.on('click', function(){
						act_change(-1);
					});

					// next
					btnNext.on('click', function(){
						act_change(1);
					});
				}


				// swipe
				// ..................................................
				var distanceX = {
						start: 0,
						end: 0,
						diff: 0
					},
					distanceY = {
						start: 0,
						end: 0,
						diff: 0
					},
					swipe_time = {
						start: 0,
						end: 0,
						diff: 0
					};

				var swipeStart = function() {
					distanceX.start = distanceX.end =  event.changedTouches[0].clientX;
					distanceY.start = distanceY.end =  event.changedTouches[0].clientY;
					swipe_time.start = swipe_time.end = new Date();
				}

				var swipeMove = function() {
					distanceX.end =  event.changedTouches[0].clientX;
					distanceX.diff = distanceX.end - distanceX.start;
					
					distanceY.end =  event.changedTouches[0].clientY;
					distanceY.diff = distanceY.end - distanceY.start;

					if(isipad) {
						event.preventDefault();
					}
				}

				var swipeEnd = function() {

					swipe_time.end = new Date();
					swipe_time.diff = swipe_time.end - swipe_time.start;

					if(swipe_time.diff > 50) {

						if(Math.abs(distanceX.diff) > (window.innerWidth * 0.1)) {
							event.preventDefault();
							var direction = distanceX.diff < 0 ? 1 : -1;
							
							// current change
							act_change(direction, distanceX.diff);
						}
					}

					distanceX.diff = 0;
				}

				// add event listener
				if((customScripts.mode == 'is-sp') || isipad) {
					$('.scenes')[0].addEventListener('touchstart', swipeStart, false);
					$('.scenes')[0].addEventListener('touchmove', swipeMove, false);
					$('.scenes')[0].addEventListener('touchend', swipeEnd, false);
				}

			}
		});
	});

})(jQuery, this, this.document);