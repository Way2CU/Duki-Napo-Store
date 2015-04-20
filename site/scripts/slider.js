Caracal.Gallery.Slideshow = function() {
    var self = this;

    self.images = {};
    self.controls = {};
    self._index = 0;
    self.timeout = 2000;


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
     self.control.set_auto = function(timeout) {
         self.timeout = timeout;
         clearInterval(self.next_step,self.timout);
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
     *  return object
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
}