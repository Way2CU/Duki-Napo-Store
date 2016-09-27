/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};


Site.ItemView = function(item) {
	var self = this;

	self.item = item;
	self.cart = item.cart;
	self.image = null;
	self.container = null;
	self.section = null;
	self.label_name = null;
	self.label_color = null;
	self.label_size = null;
	self.label_quantity = null;
	self.label_price = null;
	self.label_removeItem = null;
	self.label_count = null;
	self.label_tax = null;
	self.base_url = document.querySelector('meta[property]').getAttribute('content');

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		var item_list = self.cart.get_list_container();

		self.container = $('<li>').appendTo(item_list);
		self.container
				.addClass('hidden')
				.addClass('item');

		// force reflow of this item
		self.container[0].offsetHeight;

		// create labels
		self.image = $('<img>').appendTo(self.container);
		self.section = $('<div>').appendTo(self.container);

		self.label_name = $('<span>').appendTo(self.section);
		self.label_name.addClass('name');

		self.label_color = $('<span>').appendTo(self.section);
		self.label_color.addClass('color');

		self.label_size = $('<span>').appendTo(self.section);
		self.label_size.addClass('size');

		self.label_quantity = $('<span>').appendTo(self.container);
		self.label_quantity.addClass('quantity');

		self.label_price = $('<span>').appendTo(self.container);
		self.label_price.addClass('price');

		self.label_removeItem = $('<a href="javascript:void(0)">').appendTo(self.container);

		self.label_close_image = $('<img>').appendTo(self.label_removeItem);
		self.label_close_image.attr('src', self.base_url + '/site/images/social/close-icon.svg');

		self.label_tax = $('div.total_count:first() span:last()');
	};

	/**
	 * Handle item count change.
	 */
	self.handle_change = function() {
		self.label_name.text(self.item.name[language_handler.current_language]);
		self.label_quantity.text("X" + self.item.count);

		// update shopping cart elements
		self.image
				.attr('src', self.item.image)
				.attr('alt', self.item.name[language_handler.current_language]);

		self.label_name.text(self.item.name[language_handler.current_language]);
		self.label_color.text(language_handler.getText(null, 'color_label') + self.item.properties.color);
		self.label_size.text(language_handler.getText(null, 'size_label') + self.item.properties.size);
		self.label_price.text(language_handler.getText(null, 'currency')  + self.item.price );

		self.label_removeItem.on('click',function() {
			self.item.remove();
		});

		self.label_tax.text("$" + self.item.tax);

		//show item if hidden
		if (self.container.hasClass('hidden'))
			self.container.removeClass('hidden');
	};

	/**
	 * Handle item removal.
	 */
	self.handle_remove = function() {
		self.container.remove();
	};

	// finalize object
	self._init();
}


Caracal.Gallery.Slideshow = function() {
    var self = this;

    self.images = {};
    self.controls = {};
    self._index = 0;
    self.timeout = 0;
    self.timer_id = null;

    /**
     * Complete object initialization.
     */
    self._init = function() {
        // create image container
        self.images.list = $();

       // create control containers
        self.controls.next = $();
        self.controls.previous = $();
    };

    /**
     * Show specified image.
     *
     * @param integer index
     */
    self.show_image = function(index) {
        self._index = index;
        var new_image = self.images.list.eq(index);
        new_image.addClass('visible');
        self.images.list.not(new_image).removeClass('visible');
    };

    /**
     * Show next image in line.
     */
    self.next_step = function() {
        var new_index = self._index + 1;

        // wrap when we reach end
        if (new_index >= self.images.list.length)
            new_index = 0;

        // show specified image
        self.show_image(new_index);
    }

    /**
     * show previous image in line
     */
     self.previous_step = function() {
         var new_index = self._index - 1;

         // wrap when we reach end
         if (new_index < 0)
             new_index = self.images.list.length - 1;

         // show specified image
         self.show_image(new_index);
     }

     /**
     * Turn on auto-scrolling with specified timeout.
     * @param integer timeout
     */
     self.set_auto = function(timeout) {
		self.timeout = timeout;
		setInterval(self.next_step, self.timeout);
     }

    /**
     *  Add images from jQuery set or from specified selector to the list
     *  @param images
     *  @return object
     */
    self.images.add = function(images) {
        var list = typeof images == 'string' ? $(images) : images;
        self.images.list = self.images.list.add(list);
        return self;
    };

    /**
     *  Append list of images to container.

     *  @param array images
     *  @return object
    */
    self.images.append = function(images) {
        self.container.append(images);
        return self;
    };

    /**
     * Remove all the images from DOM tree.
     *
     * @return object
     */
    self.images.clear = function() {
        self.images.list.remove();
        self.images.list = $();
        return self;
    };

    /**
     * Set specified jQuery object or selector as image container. Unless
     * container is specified gallery will only apply `visible` class to elements instead
     * of actually specifying their position.
     *
     * @param mixed container
     * @return object
     */
    self.images.set_container = function(container) {
		self.container = $(container);
		return self;
    };

    /**
     * Make specified jQuery object behave as previous button.
     *
     * @param object control
     * @return object
     */
    self.controls.attach_next = function(control) {
        // add control to the list
        self.controls.next = self.controls.next.add(control);

        // re-attach event handlers
        self.controls._attach_handlers(true, false, false);

        return self;
    };

    /**
     * Make specified jQuery object behave as previous button.
     *
     * @param object control
     * @return object
     */
    self.controls.attach_previous = function(control) {
        // add control to the list
        self.controls.previous =  self.controls.previous.add(control);

        // re-attach event handlers
        self.controls._attach_handlers(false, true, false);

        return self;
    };

    self._init();
}

/**
 * Handle clicking on add to cart button.
 *
 * @param object event
 */
Site.handle_add_to_cart = function(event) {
	event.preventDefault();

	var product_container = $('section.product div.info');
	var size = $('div.size select option:selected').text();
	var color = $('div.color span').text();
	var uid = product_container.data('uid');
	var properties = {
			'size':size,
			'color':color
		};

	var item_list = Site.cart.get_item_list_by_uid(uid);
	var found_item = null;

	for (var i = 0, count = item_list.length; i < count; i++) {
		var item = item_list[i];

		if (item.properties.size == properties.size && item.properties.color == properties.color) {
			found_item = item;
			break;
		}
	}

	if (!found_item) {
		// add new item
		Site.cart.add_item_by_uid(uid, properties, 1);
		$('div.popup').addClass('activeCart');
		$('a.cart_btn').addClass('enabled');

	} else {
		// increase count
		found_item.alter_count(1);
		$('div.popup').addClass('activeCart');
		$('a.cart_btn').addClass('enabled');
	}
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	// create mobile menu
	if (Site.is_mobile()) {
		Site.mobile_menu = new Caracal.MobileMenu();
		Site.mobile_title = $('.mobile_title');

		Site.mobile_cart_menu_item = $('a.cart_btn');
		Site.mobile_cart = $('div.popup');

		Site.mobile_cart_menu_item.on('click', function(event){
			event.preventDefault();
			$(this).toggleClass('enabled');
			Site.mobile_cart.toggleClass('activeCart');
		});
	}

	//Page control for product gallery
	Site.product_gallery = new PageControl('section.product div.images', 'img');
	Site.product_gallery
		.attachControls($('div.images div.thumbnails a'));

	//ClickHandler for Assistance_form_button
	Site.checkbox_button = $('#checkbox');
	Site.assistanceForm = $('div.assistance_form form');

	Site.checkbox_button.on('change', function() {
		if(this.checked == true) {
			Site.assistanceForm.addClass("visible");
		}else {
			Site.assistanceForm.removeClass("visible");
		}
	});

	// lightbox for all images on page
	if (!Site.is_mobile())
		Site.lightbox_gallery = new LightBox('div.gallery a', false, false, true);

	// create shopping cart
	Site.cart = new Caracal.Shop.Cart();
	Site.cart
		.set_checkout_url('/shop/checkout')
		.ui.connect_checkout_button($('div.popup div.controls button'))
		.ui.connect_checkout_button($('a.checkout'))
		.ui.add_item_list($('div.popup ul'))
		.ui.add_total_count_label($('div#cart div.popup ul li.item span.quantity'))
		.ui.add_total_count_label($('div#cart span.count'))
		.ui.add_total_count_label($('div.mobile_title span.mobile_count'))
		.ui.add_total_cost_label($('div#cart span.total'))
		.ui.add_total_cost_label($('span.cart_total'))
		.add_item_view(Site.ItemView);

	if (Site.is_mobile())
		Site.cart.ui.connect_checkout_button($('div#cart div.controls button[name=checkout]')); else
		Site.cart.ui.connect_checkout_button($('div.popup div.controls button[name=checkout]'));

	// create controls for each slide
	var slides = $('div#slider div.image_rotate');
	var control_container = $('div#slider div.controls');

	slides.each(function(index) {
		$('<a>')
			.attr('href', 'javascript: void(0);')
			.appendTo(control_container);
	});

	if ($('header').hasClass('home')) {
		Site.home_page_gallery = new PageControl('div#slider', 'div.image_rotate');
		Site.home_page_gallery
			.setInterval(4000)
			.attachControls('div#slider div.controls a')
			.setWrapAround(true);
	}

	// handle selecting color
	var color_links = $('div.color span');
	color_links.on('click', function(event) {
		var item = $(this);

		// select color
		item.addClass('active');
		color_links.not(item).removeClass('active');

		// hide error indicator
		$('span.color_error')
			.css('visibility', 'hidden')
			.css('opacity', '0');
	});

	// handle selecting item size
	var size_links = $('div.size span');
	size_links.on('click', function(event) {
		var item = $(this);

		// select size
		item.addClass('active');
		size_links.not(item).removeClass('active');

		// hide error indicator
		$('span.size_error')
			.css('visibility', 'hidden')
			.css('opacity', '0');
	});

	// handle clicking on add to cart
	var add_to_cart = $('div.info a.btn_cart');

	if (add_to_cart.length > 0)
		add_to_cart.on('click', Site.handle_add_to_cart);

	//  function for setting _blank attribute to article links
	$('div.press article a').attr('target','_blank');

	//   Setting text  on vip page submit button

	 $('section#vip button').text(language_handler.getText(null, 'send_vip_button'));

	// handle analytics event
	$('form').on('analytics-event', function(event, data) {
		if (!data.error)
			dataLayer.push({
            	'event':'leadSent'
            });
	});
};

// connect document `load` event with handler function
$(Site.on_load);