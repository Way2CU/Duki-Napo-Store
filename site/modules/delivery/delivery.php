<?php

/**
 * Duki&Napo Fixed Delivery
 *
 * Author: Mladen Mijatov
 */
use Core\Module;


class delivery extends Module {
	private static $_instance;

	/**
	 * Constructor
	 */
	protected function __construct() {
		global $section;

		parent::__construct(__FILE__);

		if (class_exists('shop')) {
			require_once('units/method.php');
			$delivery = Duki_DeliveryMethod::get_instance($this);
		}
	}

	/**
	 * Public function that creates a single instance
	 */
	public static function get_instance() {
		if (!isset(self::$_instance))
			self::$_instance = new self();

		return self::$_instance;
	}

	/**
	 * Transfers control to module functions
	 *
	 * @param array $params
	 * @param array $children
	 */
	public function transfer_control($params = array(), $children = array()) {
	}

	/**
	 * Event triggered upon module initialization
	 */
	public function initialize() {
	}

	/**
	 * Event triggered upon module disabling
	 */
	public function cleanup() {
	}
}

?>
