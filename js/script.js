"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		windowReady = false,
		isNoviBuilder = false,
		pageTransitionAnimationDuration = 500,
		loaderTimeoutId,

		plugins = {
			bootstrapTooltip: $("[data-toggle='tooltip']"),
			rdNavbar: $(".rd-navbar"),
			maps: $(".google-map-container"),
			rdMailForm: $(".rd-mailform"),
			rdInputLabel: $(".form-label"),
			regula: $("[data-constraints]"),
			wow: $(".wow"),
			owl: $(".owl-carousel"),
			isotope: $(".isotope"),
			counter: $(".counter"),
			progressLinear: $(".progress-linear"),
			preloader: $(".preloader"),
			captcha: $('.recaptcha'),
			copyrightYear: $(".copyright-year"),
			buttonWinona: $('.button-winona'),
			videoOverlay: $('.video-overlay')
		};

	/**
	 * @desc Check the element was been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView ( elem ) {
		if ( isNoviBuilder ) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */


	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector('.page'),
				delay: 0,
				duration: pageTransitionAnimationDuration,
				classActive: 'animated',
				conditions: function (event, link) {
					return
					!/(\#|callto:|tel:|mailto:|:\/\/)/.test(link)
					&& !event.currentTarget.hasAttribute('data-lightgallery')
					&& event.currentTarget.getAttribute('href') !== 'javascript:void(0);';
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;


		/**
		 * @desc Initialize Bootstrap tooltip with required placement
		 * @param {string} tooltipPlacement
		 */
		function initBootstrapTooltip(tooltipPlacement) {
			plugins.bootstrapTooltip.tooltip('dispose');

			if (window.innerWidth < 576) {
				plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
			} else {
				plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
			}
		}

		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} c - carousel jQuery object
		 */
		function initOwlCarousel(c) {
			var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
				values = [0, 576, 768, 992, 1200, 1600],
				responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
						responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
					}
					if (!responsive[values[j]]["slideBy"] && c.attr("data" + aliaces[k] + "slideBy")) {
						responsive[values[j]]["slideBy"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "slide-by"), 10);
					}
					if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
						responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
					}
					if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
						responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
					}
				}
			}

			// Enable custom pagination
			if (c.attr('data-dots-custom')) {
				c.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
						customPag = $(carousel.attr("data-dots-custom")),
						active = 0;

					if (carousel.attr('data-active')) {
						active = parseInt(carousel.attr('data-active'), 10);
					}

					carousel.trigger('to.owl.carousel', [active, 300, true]);
					customPag.find("[data-owl-item='" + active + "']").addClass("active");

					customPag.find("[data-owl-item]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
					});

					carousel.on("translate.owl.carousel", function (event) {
						customPag.find(".active").removeClass("active");
						customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
					});
				});
			}

			c.owlCarousel({
				autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
				autoplayTimeout: c.attr("data-autoplay-timeout") ? parseInt(c.attr("data-autoplay-timeout"), 10) : 100,
				autoplaySpeed: c.attr("data-autoplay-speed") ? parseInt(c.attr("data-autoplay-speed"), 10) : 2800,
				autoplayHoverPause: true,
				loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
				items: 1,
				lazyLoad: true,
				center: c.attr("data-center") === "true",
				navContainer: c.attr("data-navigation-class") || false,
				mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
				nav: c.attr("data-nav") === "true",
				dots: c.attr("data-dots") === "true",
				dotsContainer: c.attr("data-pagination-class") || false,
				dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
				dotsSpeed: c.attr("data-dots-speed") ? parseInt(c.attr("data-dots-speed"), 10) : false,
				animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
				animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
				responsive: responsive,
				navText: function () {
					try {
						return JSON.parse(c.attr("data-nav-text"));
					} catch (e) {
						return [];
					}
				}(),
				navClass: function () {
					try {
						return JSON.parse(c.attr("data-nav-class"));
					} catch (e) {
						return ['owl-prev', 'owl-next'];
					}
				}()
			});
		}

	
		/**
		 * @desc Initialize the direction-aware hover
		 * @param {object} elements - jQuery object
		 */
		function initHoverDir(elements) {
			if (!isNoviBuilder && isDesktop) {
				for (var z = 0; z < elements.length; z++) {
					var $element = $(elements[z]);

					$element.hoverdir({
							hoverElem: $element.attr('data-hoverdir-target') ? $element.attr('data-hoverdir-target') : 'div'
						}
					);
				}
			}
		}


		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (var z = 0; z < plugins.rdNavbar.length; z++) {
				var $rdNavbar = $(plugins.rdNavbar[z]);

				for (i = j = 0, len = values.length; j < len; i = ++j) {
					value = values[i];
					if (!responsiveNavbar[values[i]]) {
						responsiveNavbar[values[i]] = {};
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
						responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
						responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
						responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
						responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
					}

					if (isNoviBuilder) {
						responsiveNavbar[values[i]]['stickUp'] = false;
					} else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
						var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
						responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
					}

					if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
						responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
					}
				}

				$rdNavbar.RDNavbar({
					anchorNav: !isNoviBuilder,
					stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
					responsive: responsiveNavbar
				});


				if ($rdNavbar.attr("data-body-class")) {
					document.body.className += ' ' + $rdNavbar.attr("data-body-class");
				}

			}
		}

		
		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Owl carousel
		if (plugins.owl.length) {
			for (var i = 0; i < plugins.owl.length; i++) {
				var c = $(plugins.owl[i]);
				plugins.owl[i].owl = c;

				initOwlCarousel(c);
			}
		}

		// Isotope
		if (plugins.isotope.length) {
			var isogroup = [];
			for (var i = 0; i < plugins.isotope.length; i++) {
				var isotopeItem = plugins.isotope[i],
					isotopeInitAttrs = {
						itemSelector: '.isotope-item',
						layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
						filter: '*'
					};

				if (isotopeItem.getAttribute('data-column-width')) {
					isotopeInitAttrs.masonry = {
						columnWidth: parseFloat(isotopeItem.getAttribute('data-column-width'))
					};
				} else if (isotopeItem.getAttribute('data-column-class')) {
					isotopeInitAttrs.masonry = {
						columnWidth: isotopeItem.getAttribute('data-column-class')
					};
				}

				var iso = new Isotope(isotopeItem, isotopeInitAttrs);
				isogroup.push(iso);
			}


			setTimeout(function () {
				for (var i = 0; i < isogroup.length; i++) {
					isogroup[i].element.className += " isotope--loaded";
					isogroup[i].layout();
				}
			}, 200);

			var resizeTimout;

			$("[data-isotope-filter]").on("click", function (e) {
				e.preventDefault();
				var filter = $(this);
				clearTimeout(resizeTimout);
				filter.parents(".isotope-filters").find('.active').removeClass("active");
				filter.addClass("active");
				var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
					isotopeAttrs = {
						itemSelector: '.isotope-item',
						layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
						filter: this.getAttribute("data-isotope-filter") === '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
					};
				if (iso.attr('data-column-width')) {
					isotopeAttrs.masonry = {
						columnWidth: parseFloat(iso.attr('data-column-width'))
					};
				} else if (iso.attr('data-column-class')) {
					isotopeAttrs.masonry = {
						columnWidth: iso.attr('data-column-class')
					};
				}
				iso.isotope(isotopeAttrs);

				var $iso = $(iso);
				if ($iso.hasClass('hoverdir')) {
					initHoverDir($iso.find('.hoverdir-item'));
				}

			}).eq(0).trigger("click")
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			setTimeout(function () {
				new WOW({
					mobile: false,
					live: false
				}).init();
			}, pageTransitionAnimationDuration);
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

	

		// jQuery Count To
		if (plugins.counter.length) {
			for (var i = 0; i < plugins.counter.length; i++) {
				var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
				$document.on("scroll", $.proxy(function () {
					var $this = this;

					if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
						$this.countTo({
							refreshInterval: 40,
							from: 0,
							to: parseInt($this.text(), 10),
							speed: $this.attr("data-speed") || 1000,
							formatter: function (value, options) {
								value = value.toFixed(options.decimals);
								if (value > 10000) {
									var newValue = "",
										stringValue = value.toString();

									for (var k = stringValue.length; k >= 0; k -= 3) {
										if (k <= 3) {
											newValue = ' ' + stringValue.slice(0, k) + newValue;
										} else {
											newValue = ' ' + stringValue.slice(k - 3, k) + newValue;
										}
									}

									return newValue;
								} else {

									return value;
								}
							}
						});
						$this.addClass('animated');
					}
				}, $counterNotAnimated))
					.trigger("scroll");
			}
		}

		// Linear Progress bar
		if (plugins.progressLinear.length) {
			for (i = 0; i < plugins.progressLinear.length; i++) {
				var progressBar = $(plugins.progressLinear[i]);
				$window.on("scroll load", $.proxy(function () {
					var bar = $(this);
					if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
						var end = parseInt($(this).find('.progress-value').text(), 10);
						bar.find('.progress-bar-linear').css({width: end + '%'});
						bar.find('.progress-value').countTo({
							refreshInterval: 40,
							from: 0,
							to: end,
							speed: 500
						});
						bar.addClass('animated-first');
					}
				}, progressBar));
			}
		}

		// Winona buttons
		if (plugins.buttonWinona.length && !isNoviBuilder) {
			initWinonaButtons(plugins.buttonWinona);
		}

		function initWinonaButtons(buttons) {
			for (var i = 0; i < buttons.length; i++) {
				var $button = $(buttons[i]),
					innerContent = $button.html();

				$button.html('');
				$button.append('<div class="content-original">' + innerContent + '</div>');
				$button.append('<div class="content-dubbed">' + innerContent + '</div>');
			}
		}

		// Custom Video Overlay
		if (plugins.videoOverlay.length) {
			for (var i = 0; i < plugins.videoOverlay.length; i++) {
				var overlay = $(plugins.videoOverlay[i]);

				if (overlay) {
					overlay.css({'opacity': '1'});
					overlay.on('click', function () {
						$(this).animate({
								opacity: 0
							},
							function () {
								this.style.display = 'none';
							}
						);
					});
				}
			}
		}

		// Bootstrap Tooltips
		if (plugins.bootstrapTooltip.length) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
			initBootstrapTooltip(tooltipPlacement);

			$window.on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

	function sendEmail() {
var nome = $("#nome");
var cnpj = $("#cnpj");
var cpf = $("#cpf");
var email = $("#email");
var cel = $("#cel");
var especialidade = $("#especialidade");
var mensagem = $("#mensagem");


if(isNotEmpty(nome) && isNotEmpty(email) && isNotEmpty(cel) && isNotEmpty(especialidade) && isNotEmpty(mensaggem)){
$.ajax({
	url: 'sendEmail.php',
	method: 'POST',
	dataType: 'json',
	data: {
		nome: nome.val(),
		email: email.val(),
		cel: cel.var(),
		especialidade: especialidaded.var(),
		mensagem: mensagem.var()
	}, sucess: function(response){
		$('#myForm')[0].reset();
		$('.sent-notification').text("Mensagem enviada com sucesso");
	}
});

}
		
		}
function isNotEmpty(caller){
	if(caller.val()==""){
caller.css('border', '1px solid red');
return false

	}
	else{
		caller.css('border', '');
		return true
	}
	
}
	});
	
}());
