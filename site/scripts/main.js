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
		
		var base_url = $('base').attr('href');
		self.label_close_image = $('<img>').appendTo(self.label_removeItem);
		self.label_close_image.attr('src', base_url + '/site/images/social/close-icon.svg');

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
			event.preventDefault();
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
 * Dialog system for logging in and out and as well as registering
 * new accounts on the system.
 */
Site.DialogSystem = function() {
	var self = this;

	self.message = {};
	self.sign_up = {};
	self.login = {};
	self.recovery = {};

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// create error reporting dialog
		self.message.content = $('<div>');
		self.message.dialog = new Dialog();
		self.message.dialog
				.setSize(Site.is_mobile() ? 300 : 400, 'auto')
				.setScroll(false)
				.setClearOnClose(false)
				.setContent(self.message.content)
				.addClass('login');

		// create sign up dialog
		self.sign_up.dialog = new Dialog();
		self.sign_up.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.sign_up.dialog.setScroll(false);
		self.sign_up.dialog.setClearOnClose(false);
		self.sign_up.dialog.setError(false);
		self.sign_up.dialog.addClass('login sign-up');

		self.sign_up.content = $('<form>');
		self.sign_up.message = $('<p>');

		self.sign_up.label_first_name = $('<label>');
		self.sign_up.input_first_name = $('<input>');

		self.sign_up.label_last_name = $('<label>');
		self.sign_up.input_last_name = $('<input>');

		self.sign_up.label_username = $('<label>');
		self.sign_up.input_username = $('<input>');

		self.sign_up.label_password = $('<label>');
		self.sign_up.input_password = $('<input>');

		self.sign_up.label_repeat_password = $('<label>');
		self.sign_up.input_repeat_password = $('<input>');

		self.sign_up.label_terms_agree = $('<label>');
		self.sign_up.input_terms_agree = $('<input>');
		self.sign_up.span_terms_agree = $('<span>');

		// configure elements
		self.sign_up.input_first_name
				.attr('name', 'first_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_last_name
				.attr('name', 'last_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_username
				.attr('name', 'username')
				.attr('type', 'email')
				.attr('maxlength', 50)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_password
				.attr('name', 'password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_repeat_password
				.attr('name', 'repeat_password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_terms_agree
				.attr('name', 'agreed')
				.attr('type', 'checkbox')
				.on('click', self._handleAgreeClick);

		// pack sign up dialog
		self.sign_up.message.appendTo(self.sign_up.content);

		self.sign_up.label_first_name
				.addClass('inline')
				.append(self.sign_up.input_first_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_last_name
				.addClass('inline')
				.append(self.sign_up.input_last_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_username
				.append(self.sign_up.input_username)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_password
				.append(self.sign_up.input_password)
				.appendTo(self.sign_up.content);

		self.sign_up.label_repeat_password
				.append(self.sign_up.input_repeat_password)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_terms_agree
				.append(self.sign_up.input_terms_agree)
				.append(self.sign_up.span_terms_agree)
				.appendTo(self.sign_up.content);

		self.sign_up.dialog.setContent(self.sign_up.content);

		// create sign up button
		self.sign_up.signup_button = $('<a>');
		self.sign_up.signup_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleSignUpClick);
		self.sign_up.dialog.addControl(self.sign_up.signup_button);

		// prepare dialog
		self.login.dialog = new Dialog();
		self.login.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.login.dialog.setScroll(false);
		self.login.dialog.setClearOnClose(false);
		self.login.dialog.setError(false);
		self.login.dialog.addClass('login');

		// create login button
		self.login.login_button = $('<a>');
		self.login.login_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleLoginClick);
		self.login.dialog.addControl(self.login.login_button);

		// create login dialog content
		self.login.content = $('<form>');
		self.login.captcha_container = $('<div>');
		self.login.message = $('<p>');

		self.login.label_username = $('<label>');
		self.login.input_username = $('<input>');

		self.login.label_password = $('<label>');
		self.login.input_password = $('<input>');

		self.login.link_recovery = $('<a>');

		self.login.label_captcha = $('<label>');
		self.login.input_captcha = $('<input>');
		self.login.image_captcha = $('<img>');

		self.login.label_remember_me = $('<label>');
		self.login.input_remember_me = $('<input>');
		self.login.span_remember_me = $('<span>');

		// configure elements
		self.login.input_username
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'email')
				.attr('type', 'email');

		self.login.input_password
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'password')
				.attr('type', 'password');

		self.login.input_remember_me
				.attr('name', 'lasting')
				.attr('type', 'checkbox');

		self.login.link_recovery
				.click(self._showRecoveryDialog)
				.attr('href', 'javascript: void(0)');

		self.login.content
				.attr('action', '/')
				.attr('method', 'post');

		// load username if previously stored
		var cached_username = localStorage.getItem('username');
		if (cached_username)
			self.login.input_username.val(cached_username);

		// pack elements
		self.login.content.append(self.login.message);
		self.login.label_username
				.append(self.login.input_username)
				.appendTo(self.login.content);

		self.login.label_password
				.append(self.login.input_password)
				.appendTo(self.login.content);

		self.login.label_captcha
				.append(self.login.input_captcha)
				.append(self.login.image_captcha)
				.appendTo(self.login.captcha_container);

		self.login.label_remember_me
				.append(self.login.input_remember_me)
				.append(self.login.span_remember_me)
				.appendTo(self.login.content);

		self.login.captcha_container
				.addClass('captcha')
				.hide()
				.appendTo(self.login.content);

		self.login.content.append(self.login.link_recovery);
		self.login.dialog.setContent(self.login.content);

		// prepare recovery dialog
		self.recovery.dialog = new Dialog();
		self.recovery.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.recovery.dialog.setScroll(false);
		self.recovery.dialog.setClearOnClose(false);
		self.recovery.dialog.setError(false);
		self.recovery.dialog.addClass('login recovery');

		// create recover button
		self.recovery.recover_button = $('<a>');
		self.recovery.recover_button
				.attr('href', 'javascript: void(0);')
				.click(self._handleRecoverClick);

		self.recovery.dialog.addControl(self.recovery.recover_button);

		// create recovery dialog content
		self.recovery.content = $('<div>');
		self.recovery.captcha_container = $('<div>');
		self.recovery.message = $('<p>');

		self.recovery.label_email = $('<label>');
		self.recovery.input_email = $('<input>');

		self.recovery.label_captcha = $('<label>');
		self.recovery.input_captcha = $('<input>');
		self.recovery.image_captcha = $('<img>');

		self.recovery.input_email
				.attr('name', 'email')
				.attr('type', 'text')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress);

		// prepare captcha image
		var base = $('base').attr('href');

		self.recovery.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.login.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.recovery.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');
		self.login.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');

		// pack elements
		self.recovery.content.append(self.recovery.message);
		self.recovery.label_email
				.append(self.recovery.input_email)
				.appendTo(self.recovery.content);

		self.recovery.label_captcha
				.append(self.recovery.input_captcha)
				.append(self.recovery.image_captcha)
				.appendTo(self.recovery.captcha_container);

		self.recovery.captcha_container
				.addClass('captcha')
				.appendTo(self.recovery.content);
		self.recovery.dialog.setContent(self.recovery.content);

		// bulk load language constants
		var constants = [
				'login', 'login_dialog_title', 'login_dialog_message', 'label_email', 'label_password',
				'label_password_recovery', 'recovery_dialog_title', 'recovery_dialog_message', 'submit',
				'label_captcha', 'captcha_message', 'signup_dialog_title', 'sign_up', 'signup_dialog_message',
				'label_repeat_password', 'label_first_name', 'label_last_name', 'label_agree_to_terms',
				'label_remember_me'
			];
		language_handler.getTextArrayAsync(null, constants, self._handleStringsLoaded);

		// connect events
		$('a.login').click(self._showLoginDialog);
		$('a.logout').click(self._handleLogout);
		$('a.sign-up').click(self._showSignUpDialog);
		$('form.sign-up input').on('focusin', self._handleFocusIn);
	}

	/**
	 * Remove invalid class on focus in.
	 *
	 * @param object event
	 */
	self._handleFocusIn = function(event) {
		$(this).removeClass('invalid');
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleLoginKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.login.login_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.login.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in recovery dialog.
	 *
	 * @param object event
	 */
	self._handleRecoveryKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.recovery.recover_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.recovery.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.sign_up.signup_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.sign_up.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle clicking on agree to terms.
	 *
	 * @param object event
	 */
	self._handleAgreeClick = function(event) {
		var item = $(this);
		item.removeClass('invalid');
	};

	/**
	 * Handle loading language constants from server.
	 *
	 * @param object data
	 */
	self._handleStringsLoaded = function(data) {
		with (self.login) {
			dialog.setTitle(data['login_dialog_title']);
			message.html(data['login_dialog_message']);
			login_button.html(data['login']);

			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_captcha.attr('placeholder', data['label_captcha']);
			link_recovery.html(data['label_password_recovery']);
			image_captcha.attr('title', data['captcha_message']);
			span_remember_me.html(data['label_remember_me']);
		}

		with (self.recovery) {
			dialog.setTitle(data['recovery_dialog_title']);
			message.html(data['recovery_dialog_message']);
			recover_button.html(data['submit']);

			input_email.attr('placeholder', data['label_email']);
			input_captcha.attr('placeholder', data['label_captcha']);
			image_captcha.attr('title', data['captcha_message']);
		}

		with (self.sign_up) {
			dialog.setTitle(data['signup_dialog_title']);
			message.html(data['signup_dialog_message']);
			signup_button.html(data['sign_up']);

			input_first_name.attr('placeholder', data['label_first_name']);
			input_last_name.attr('placeholder', data['label_last_name']);
			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_repeat_password.attr('placeholder', data['label_repeat_password']);
			span_terms_agree.html(data['label_agree_to_terms']);
		}
	};

	/**
	 * Logout user and navigate to linked page.
	 *
	 * @param object event
	 */
	self._handleLogout = function(event) {
		event.preventDefault();

		// perform logout
		new Communicator('backend')
				.on_success(function(data) {
					if (!data.error)
						window.location.reload();
				})
				.get('json_logout');
	};

	/**
	 * Handle clicking on login link.
	 *
	 * @param object event
	 */
	self._showLoginDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.login.dialog.show();

		// focus username
		setTimeout(function() {
			self.login.input_username[0].focus();
		}, 100);
	};

	/**
	 * Show password recovery dialog.
	 *
	 * @param object event
	 */
	self._showRecoveryDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		self.login.dialog.hide();
		self.recovery.dialog.show();

		// focus username
		setTimeout(function() {
			self.recovery.input_email[0].focus();
		}, 100);
	};

	/**
	 * Show sign up dialog when user clicks on get started link.
	 *
	 * @param object event
	 */
	self._showSignUpDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.sign_up.dialog.show();

		// focus username
		setTimeout(function() {
			self.sign_up.input_username[0].focus();
		}, 100);
	};

	/**
	 * Reload captcha image.
	 */
	self._handleCaptchaClick = function(event) {
		event.preventDefault();

		var base = $('base').attr('href');
		var url = base + '?section=captcha&action=print_image&' + Date.now();

		self.recovery.image_captcha.attr('src', url);
		self.login.image_captcha.attr('src', url);
	};

	/**
	 * Handle clicking on sign up button in dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpClick = function(event) {
		// prevent form from submitting
		event.preventDefault();

		// check if all the fields are valid
		if (self.sign_up.input_first_name.val() == '')
			self.sign_up.input_first_name.addClass('invalid');

		if (self.sign_up.input_last_name.val() == '')
			self.sign_up.input_last_name.addClass('invalid');

		if (self.sign_up.input_username.val() == '')
			self.sign_up.input_username.addClass('invalid');

		if (self.sign_up.input_password.val() == '')
			self.sign_up.input_password.addClass('invalid');

		if (self.sign_up.input_password.val() != self.sign_up.input_repeat_password.val()) {
			self.sign_up.input_password.addClass('invalid');
			self.sign_up.input_repeat_password.addClass('invalid');
		}

		if (!self.sign_up.input_terms_agree.is(':checked'))
			self.sign_up.input_terms_agree.addClass('invalid');

		// cache objects
		var fields = self.sign_up.content.find('input');

		// collect data
		var data = {};
		fields.each(function(index) {
			var field = $(this);
			var name = field.attr('name');

			if (field.attr('type') != 'checkbox')
				data[name] = field.val(); else
				data[name] = field.is(':checked') ? 1 : 0;
		});

		// submit data
		if (fields.filter('.invalid').length == 0)
			self._performSignUp(data);
	};

	/**
	 * Perform sign up process with specified data.
	 *
	 * @param object data
	 */
	self._performSignUp = function(data) {
		// make sure user agrees
		if (data.agreed != 1)
			return;

		// fill in remaining data
		data.email = data.username;
		data.show_result = 1;

		// create new user and redirect
		new Communicator('backend')
				.on_success(self._handleSignupSuccess)
				.on_error(self._handleSignupError)
				.send('save_unpriviledged_user', data);
	};

	/**
	 * Handle successful submission of sign up data.
	 *
	 * @param object data
	 */
	self._handleSignupSuccess = function(data) {
		if (!data.error) {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'signup_completed_message'));
			self.message.dialog.show();

		} else {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle communication error during sign up process.
	 *
	 * @param object xhr
	 * @param string status_code
	 * @param string description
	 */
	self._handleSignupError = function(xhr, status_code, description) {
		// hide signup dialog
		self.sign_up.dialog.hide();

		// show error message
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'signup_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on login button in dialog.
	 *
	 * @param object event
	 */
	self._handleLoginClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.login.input_username.val(),
				password: self.login.input_password.val(),
				captcha: self.login.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleLoginSuccess)
				.on_error(self._handleLoginError)
				.get('json_login', data);
	};

	/**
	 * Handle successful login response.
	 *
	 * @param object data
	 */
	self._handleLoginSuccess = function(data) {
		if (data.logged_in) {
			// hide login dialog
			self.login.dialog.hide();

			// store username for next time
			var username = self.login.input_username.val();
			localStorage.setItem('username', username);

			// reload page on successful login
			window.location.reload();

			self.message.content.html(language_handler.getText(null, 'login_successful'));
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'))
					.setCloseCallback(function() {
						window.location.reload();
						this.clearCloseCallback();
					});
			self.message.dialog.show();

		} else {
			// hide login dialog
			self.login.dialog.hide();

			// show error message
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'login_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.setCloseCallback(function() {
						setTimeout(function() {
							self.login.dialog.show();
						}, 100);
					});
			self.message.dialog.show();

			// show captcha if required
			if (data.show_captcha)
				self.login.captcha_container.slideDown(); else
				self.login.captcha_container.slideUp();
		}
	};

	/**
	 * Handle communication error.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleLoginError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.login.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'login_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on recover button in dialog.
	 *
	 * @param object event
	 */
	self._handleRecoverClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.recovery.input_email.val(),
				email: self.recovery.input_email.val(),
				captcha: self.recovery.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleRecoverSuccess)
				.on_error(self._handleRecoverError)
				.get('password_recovery', data);
	};

	/**
	 * Handle response from server for password recovery.
	 *
	 * @param object data
	 */
	self._handleRecoverSuccess = function(data) {
		if (!data.error) {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'recovery_completed_message'));
			self.message.dialog.show();

		} else {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle error in communication with server.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleRecoverError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.recovery.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	// finalize object
	self._init();
}

/**
 * @param object menu               jQuery object
 * @param object trigger_element    jQuery object
 */
function FloatingMenu(menu, trigger_element){
    var self = this;

    self.menu = menu;
    self.position = trigger_element.offset().top;
    self.active = false;
      
    /**
     * Object initialization.
     */
    self._init = function() {
        // connect signals
        $(window).on('scroll', self.handle_scroll);

        // set initial state
        self.handle_scroll(null);
    };
    
    /**
     * Handle window scroll.
     *
     * @param object event
     */
    self.handle_scroll = function(event) {
        var over_position = $(window).scrollTop() >= self.position;
        
        if (over_position && !self.active) {
            self.menu.addClass('active');
            self.active = true;

        } else if (!over_position && self.active) {
            self.menu.removeClass('active');
            self.active = false;
        }
    };

    // finalize object
    self._init();
}

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

	// create user dialogs
	Site.dialog_system = new Site.DialogSystem();

	// create floating menu
	Site.menu = new FloatingMenu($('header'),$('header').next());

	// lightbox for all images on page
	if (!Site.is_mobile())
		Site.lightbox = new LightBox('div.images > a', false, false, true);
		Site.lightbox1 = new LightBox('div.images figure a', false, false, true);
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
