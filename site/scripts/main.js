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
	self.label_total = null;
	self.label_tax = null;

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

		self.label_count = $('div.total_count:last() span:last()');

		self.label_tax = $('div.total_count:first() span:last()');


	};

	/**
	 * Handle item count change.
	 */
	self.handle_change = function() {


		// update shopping cart elements
		self.image
				.attr('alt', self.item.name[language_handler.current_language])
				.attr('src', self.item.image);

		self.label_name.text(self.item.name[language_handler.current_language]);

		self.label_color.text("- COLOR " + self.item.properties.color);

		self.label_size.text("- SIZE " + self.item.properties.size);

		self.label_quantity.text("x" + self.item.properties.quantity);

		self.label_price.text("$" + self.item.price);

		self.label_removeItem.on('click',function() {
			event.preventDefault();
			self.item.remove();
		});

		self.label_count.text("$" + self.item.price);

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

/**
 * Function called when document and images have been completely loaded.
 */

Site.on_load = function() {


	Caracal.lightbox = new LightBox('a.image.direct', false, false, true);

	Site.cart = new Caracal.Shop.Cart();
	Site.cart
			.ui.add_item_list($('div.popup ul'))
			.ui.add_total_count_label($('div#cart span:last()'))
			.ui.add_total_cost_label($('div.total_count:last() span:last()'))
			.add_item_view(Site.ItemView);

	// Function Displaying Product Big Image
	function showImage() {
		var item = $(this);
		var bImage = $('section.product > img').attr('src',item.data('image'));
	}

	var images = $('div.product_gallery img');
	images.hover(showImage);

	// Function making color names be active
	function selectedColor() {
		var item = $(this);
		item.addClass('active');
		colorLinks.not(item).removeClass('active');
		$('span.color_error').css('visibility','hidden')
							 .css('opacity','0');
	}

	var colorLinks = $('div.color span');
	colorLinks.on('click',selectedColor);

	// Function making size values  be active
	function selectedSize() {
		var item = $(this);
		item.addClass('active');
		sizesLinks.not(item).removeClass('active');
		$('span.size_error').css('visibility','hidden')
							 .css('opacity','0');
	}

	var sizesLinks = $('div.size span');
	sizesLinks.on('click',selectedSize);



	/*
	*
	* Function Which Handles Add to cart call
	*/
	function insertToCart() {
		var product_container = $('div.info_wrap');
		var quantity = $('input[type="number"]').val();
		var size = $('div.size span.active').attr('value');
		var color = $('div.color span.active').data('value');
		var uid = product_container.data('uid');

		var properties = {'size':size,'color':color};

		// get item with specified unique id
			// var item_list = Site.cart.get_item_list_by_uid(uid);
			// console.log(item_list);

		if(color == undefined) {
			$('span.color_error').css('visibility','visible')
								 .css('opacity','1');

		} else if(size == undefined) {
			$('span.size_error').css('visibility','visible')
								 .css('opacity','1');
		} else {

			var item_list = Site.cart.get_item_list_by_uid(uid);
			console.log(item_list);
			var found_item = null;

			for (var i=0, count=item_list.length; i<count; i++) {
				var item = item_list[i];
				console.log(item);

				if (item.properties.size == properties.size &&
					item.properties.color == properties.color) {
					found_item = item;
					break;
				}
			}

			if (found_item == null) {
				// add new item
				Site.cart.add_item_by_uid(uid,{'size':size,'color':color,'quantity':quantity});
			} else {
				// increase count
				found_item.alter_count(1);
			}

		}

	}

	var cartBtn = $('div.size a');
	cartBtn.on('click',insertToCart);








};


// connect document `load` event with handler function
$(Site.on_load);
