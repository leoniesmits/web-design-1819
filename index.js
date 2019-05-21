"use strict"

/* Progress bar */


jQuery(document).ready(function($){
  
  var scrollTop = window.scrollY;
  var viewportHeight = document.body.clientHeight - window.innerHeight;
  var scrollPercent = (scrollTop / viewportHeight) * 100;
  var progressBar = document.querySelector('#js-progressbar');

  progressBar.setAttribute('value', scrollPercent);

  window.addEventListener('scroll', function() {
    scrollTop = window.scrollY;
    viewportHeight = document.body.clientHeight - window.innerHeight;
    scrollPercent = (scrollTop / viewportHeight) * 100;
    progressBar.setAttribute('value', scrollPercent);
	});


  var articlesWrapper = $('.cd-articles');
	var windowHeight = window.innerHeight;
	var articles = articlesWrapper.find('article');
	var aside = $('.cd-read-more');
	var articleSidebarLinks = aside.find('li');

		var	scrolling = false;
		var sidebarAnimation = false;
		var resizing = false;
		var mq = checkMQ();
		var svgCircleLength = parseInt(Math.PI*(articleSidebarLinks.eq(0).find('circle').attr('r')*2));
		
		// check media query and bind corresponding events
      // $(window).on('scroll', checkRead);
      window.addEventListener('scroll', checkRead);
      window.addEventListener('resize', resetScroll);

	

		aside.on('click', 'a', function(event){
			event.preventDefault();
			var selectedArticle = articles.eq($(this).parent('li').index()),
				selectedArticleTop = selectedArticle.offset().top;

			$(window).off('scroll', checkRead);

			$('body,html').animate(
				{'scrollTop': selectedArticleTop + 2}, 
				300, function(){
					checkRead();
					$(window).on('scroll', checkRead);
				}
			); 
	    });

	function checkRead() {
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(updateArticle, 300) : window.requestAnimationFrame(updateArticle);
		}
	}

	function resetScroll() {
		if( !resizing ) {
			resizing = true;
			(!window.requestAnimationFrame) ? setTimeout(updateParams, 300) : window.requestAnimationFrame(updateParams);
		}
	}

	function updateParams() {
		windowHeight = $(window).height();
		mq = checkMQ();
		$(window).off('scroll', checkRead);
		
		if( mq == 'desktop') {
			$(window).on('scroll', checkRead);
		}
		resizing = false;
	}

	function updateArticle() {
		var scrollTop = $(window).scrollTop();

		articles.each(function(){
			var article = $(this),
				articleTop = article.offset().top,
				articleHeight = article.outerHeight(),
				articleSidebarLink = articleSidebarLinks.eq(article.index()).children('a');

			if( article.is(':last-of-type') ) articleHeight = articleHeight - windowHeight;

			if( articleTop > scrollTop) {
				articleSidebarLink.removeClass('read reading');
			} else if( scrollTop >= articleTop && articleTop + articleHeight > scrollTop) {
				var dashoffsetValue = svgCircleLength*( 1 - (scrollTop - articleTop)/articleHeight);
				articleSidebarLink.addClass('reading').removeClass('read').find('circle').attr({ 'stroke-dashoffset': dashoffsetValue });
			} else {
				articleSidebarLink.removeClass('reading').addClass('read');
			}
		});
		scrolling = false;
	}



	function checkMQ() {
		return window.getComputedStyle(articlesWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}
});

