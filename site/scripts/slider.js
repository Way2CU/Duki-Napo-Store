
Caracal.Gallery.Slideshow = function() {
	var self = this;

	self.images = {};
	self.controls = {};

	// object functions

	// Function for applying visible class to image

	self.image_visible = function(index) {
		self.images.eq(index).addClass('visible');
	}

	/**
	 * Move images by one step forward.
	 */
	self.next_step = function() {
		if(self.images < self.images.list.length)
		self.image_visible(index + 1);
	};

	/**
	 * Move images by one step backward.
	 */
	self.previous_step = function() {
		self.image_visible(index - 1);
	};

	/**
	 *	set specified jquery selector as image container
	 *	@param container
	 *	return object
	*/
	self.images._container = function(container) {
		self.container = $(container);
		return self;
	}

	/**
	 *	Set or clear container status as busy.
	 *	@param boolean busy
	 *	return object
	*/
	self.images._container_status = function(busy) {
		if(busy)
				self.container.addClass('loading'); else
				self.container.removeClass('loading');
		return self;
	}

	/**
	 *	Add images from jQuery set or from specified selector to the list
	 *	@param images
	 *	return object
	*/
	self.images.add = function(images) {
		var list = typeof images == 'string' ? $(images) : images;
		$.extend(self.images.list, list);
		return self;
	};

	/**
	 *	Append list of images to container.
	 *	@param array images
	 *	return object
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

	/**
	 * Turn on auto-scrolling with specified timeout.
	 *
	 * @param integer timeout
	 * @return object
	 */
	self.controls.set_auto = function(timeout) {
		// store timeout for later use
		self.timeout = timeout;

		if (timeout == 0) {
			// clear existing timer
			if (self.timer_id != null)
				clearInterval(self.timer_id);
			self.timer_id = null;

		} else {
			// start new timer
			self.timer_id = setInterval(self.next_step, self.timeout);
		}

		// re-attach event handlers
		self.controls._attach_handlers(false, false, true);

		return self;
	};

}