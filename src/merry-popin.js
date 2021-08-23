
/** @namespace */
var merryGoblin = merryGoblin || {};
merryGoblin.popin = merryGoblin.popin || {};

merryGoblin.popin.ctrl = (function($, merryGoblin) {

	var self = null;
	var iframePopinSelector = 'merry-goblin-iframe-popin-link';
	var inlinePopinSelector = 'merry-goblin-inline-popin-link';
	var triggerTypeReplacer = 'span';
	var counter = 0;

	function getTriggerUniqueId($element) {

		let id = $element.attr('id');
		if (id == null) {
			counter++;
			id = 'merry-goblin-popin-trigger-id'+counter;
			$element.attr('id', id);
		}

		return id;
	}

	function getPopinUniqueId($element) {

		counter++;
		let id = 'merry-goblin-popin-id'+counter;
		if ($element != null) {
			$element.attr('id', id);
		}

		return id;
	}

	function replaceIframeLink() {

		let $iframeLinkList = $('a.'+iframePopinSelector);
		$iframeLinkList.each(function(index) {
			let $trigger = $(this);
			let triggerId = getTriggerUniqueId($trigger);

			$trigger = replaceLinkWithTrigger(triggerId);
		});
	}

	function replaceLinkWithTrigger(id) {

		let $link = $('#'+id);
		let $trigger = null;
		if ($link[0] != null) {
			//	Store data associated to the current link
			let linkHref = $link.attr('href');
			let linkClass = $link.attr('class');
			let linkHtmlContent = $link.html();

			//	Remove id on the link to put it on the new element to create
			$link.attr('id', '');
			$link.after('<'+triggerTypeReplacer+' id="'+id+'"></'+triggerTypeReplacer+'>');
			$trigger = $('#'+id);
			
			//	Apply stored data on the created element
			$trigger.attr('data-href', linkHref);
			$trigger.attr('class', linkClass);
			$trigger.html(linkHtmlContent);

			//	Link destruction
			$link.remove();
		}

		return $trigger;
	}

	function activateIframeTrigger() {

		let $iframeTriggerList = $(triggerTypeReplacer+'.'+iframePopinSelector);
		if ($iframeTriggerList.length > 0) {
			$iframeTriggerList.click(function() {
				let triggerId = $(this).attr('id');
				self.openIframe(triggerId);
			});
		}
	}

	function isTriggerActive($trigger) {

		return $trigger.hasClass('inactive-trigger');
	}

	function inactivateTrigger($trigger) {

		$trigger.addClass('inactive-trigger');
	}

	function activateTrigger($trigger) {

		$trigger.removeClass('inactive-trigger');
	}

	/**
	 * Build popin HTML
	 * Returns popin id
	 * 
	 * @param  string  triggerId
	 * @return string
	 */
	function createIframePopin(triggerId) {

		let $trigger = $('#'+triggerId);
		//	Trigger doesn't exist or more thant one of this id exists
		if ($trigger.length != 1) {
			return null;
		}
		let href = $trigger.attr('data-href');
		let id = getPopinUniqueId();

		let cssStart = 'merry-goblin-iframe-popin';
		let wrapper = '<div id="'+id+'" class="'+cssStart+'-wrapper" data-trigger-id="'+triggerId+'">';
		let content = '<div class="'+cssStart+'-content">';
		let iframe = '<iframe class="'+cssStart+'-iframe" src="'+href+'"></iframe>';
		let close = '<div class="'+cssStart+'-close">';

		$('body').append(wrapper+content+iframe+close+'</div></div></div>');
		let $popin = $('#'+id);
		/* // To only quit with the cross button
		let $close = $popin.find('.'+cssStart+'-close');
		$close.click(function() {
			let $close = $(this);
			let $popin = $close.closest('.merry-goblin-iframe-popin-wrapper');
			let popinId = $popin.attr('id');
			self.closeIframe(popinId);
		});*/

		$popin.on('click', function() {
			let $popin = $(this);
			let popinId = $popin.attr('id');
			self.closeIframe(popinId);
		});

		return id;
	}

	function destroyIframePopin(popinId) {

		let $popin = $('#'+popinId);
		$popin.remove();
	}

	var scope = {

		/**
		 * Replace default jquery selectors by your own
		 * 
		 * @param  object  $settings
		 * @return null
		 */
		configure: function($settings) {

			if ($settings['iframePopinSelector'] != null) {
				iframePopinSelector = $settings['iframePopinSelector'];
			}
			if ($settings['inlinePopinSelector'] != null) {
				inlinePopinSelector = $settings['inlinePopinSelector'];
			}
			if ($settings['triggerTypeReplacer'] != null) {
				triggerTypeReplacer = $settings['triggerTypeReplacer'];
			}
		},

		/**
		 * Find any html element which matches with selectors
		 * Those elements will become triggers for a popin
		 * 
		 * @return null
		 */
		init: function() {

			self = this;
			replaceIframeLink();
			activateIframeTrigger();
		},

		/**
		 * Open the relative popin according to data-trigger-id attribute
		 * 
		 * @param  string triggerId
		 * @return string
		 */
		openIframe: function(triggerId) {

			let popinId = null;
			let $trigger = $('#'+triggerId);
			if (!isTriggerActive($trigger)) {
				inactivateTrigger($trigger);
				popinId = createIframePopin(triggerId);
			}

			return popinId;
		},

		/**
		 * Close a popin
		 * 
		 * @param  string triggerId
		 * @return null
		 */
		closeIframe: function(popinId) {

			let $popin = $('#'+popinId);
			let triggerId = $popin.attr('data-trigger-id');
			let $trigger = $('#'+triggerId);
			activateTrigger($trigger);
			destroyIframePopin(popinId);
		}

	};
	return scope;

})(jQuery, merryGoblin);
