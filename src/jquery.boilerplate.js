// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "shatter",
				defaults = {
				width: '.1',
				height: '.1'
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.$el = $(this.element);
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.options = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
					// Place initialization logic here
					// You already have access to the DOM element and
					// the options via the instance, e.g. this.element
					// and this.options
					// you can add more functions like the one below and
					// call them like so: this.yourOtherFunction(this.element, this.options).
					var shards = Math.floor((100/(this.options.width * 100))*(100/(this.options.height * 100)))

					var x = Math.floor(100/(this.options.width *100))
					var y = Math.floor(100/(this.options.height *100))

					this.positions = []

					for(i = 0; i < shards; i++) {

						var shard = {
							el:     '<div></div>',
							width:  (this.options.width * 100).toString() + '%',
							height: (this.options.height * 100).toString() + '%'
						}

						var original = {
							el:         '<div></div>',
							width:      this.$el.css('width'),
							height:     this.$el.css('height'),
							background: this.$el.css('background')
						}

						shard.xPosition = (((i % x) * this.options.width)*100).toString() + '%';
						shard.yPosition = ((Math.floor(i / x) * this.options.height)*100).toString() + '%';

						original.xPosition = '-' + ((i % x) * 100).toString() + '%';
						original.yPosition = '-' + (Math.floor(i / x) * 100).toString() + '%';

						this.positions.push({
							left: shard.xPosition,
							top:  shard.yPosition,
						})			

						this.$el.append($(shard.el).css({
							width:      shard.width,
							height:     shard.height,
							position:   'absolute',
							left:       shard.xPosition,
							top:        shard.yPosition,
							overflow:   'hidden',
							'-webkit-transition': 'all 1.5s ease'
							// '-webkit-transition': 'all 1.5s cubic-bezier(.64,-0.19,.58,1.22)'
						}))

						this.$el.children().last().append($(original.el).css({
							width:      original.width,
							height:     original.height,
							position:   'absolute',
							left:       original.xPosition,
							top:        original.yPosition,
							background: original.background
						}))


					}
					console.log(this.positions[0])
					this.$el.css('background', 'none')
					this.breakingPoint();
				},
				breakingPoint: function () {
					var that = this;
					this.$el.click(function() {
						that.$el.children().each(function() {
							// var verticalSides = ['top', 'bottom']
							// var horizontalSides = ['left', 'right']
							var randomDirection = {
								x: ((Math.floor(Math.random()*300) + 1) * (Math.floor(Math.random()*2) + 1 === 1 ? 1 : -1)).toString() + '%',
								y: ((Math.floor(Math.random()*300) + 1) * (Math.floor(Math.random()*2) + 1 === 1 ? 1 : -1)).toString() + '%',
								// sides: {}
							}
							// randomDirection.sides[verticalSides[(Math.floor(Math.random()*2))]] = randomDirection.x;
							// randomDirection.sides[horizontalSides[Math.floor(Math.random()*2)]] = randomDirection.y;
							// console.log(randomDirection.sides)
							$(this).css({
								// randomDirection.sides
								left: randomDirection.x,
								top:  randomDirection.y
								// opacity: '0'
								// '-webkit-transform': 'scale(.5)'
							})
						})
					that.humptyDumpty();
					})
				},

				humptyDumpty: function() {
					this.$el.unbind('click')
					var that = this;
					this.$el.click(function() {
						that.$el.children().each(function(index) {
							$(this).css(that.positions[index]);
						})
						that.breakingPoint();
					})
				}
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );


