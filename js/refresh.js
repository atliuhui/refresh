/* global jQuery */

(function ($) {
    var defaults = {
        type: 'fade', // flip push fade
        direction: 'left' //left right top bottom
    };
    $.fn.refresh = function (options) {
        // arguments
        var settings = $.extend({}, defaults, options);
        var refreshFlip = function(content, callback, context) {
            var degree = Math.abs(context.$el.data('degree') || 0);
            context.$currentFront = (degree % 360 === 0 ? context.$front : context.$back);
            context.$currentBack = (degree % 360 === 180 ? context.$front : context.$back);
            
            var flipX = function(degree) {
                context.$container.css({
                    '-ms-transform': 'rotateX(' + degree + 'deg)',
                    '-moz-transform': 'rotateX(' + degree + 'deg)',
                    '-webkit-transform': 'rotateX(' + degree + 'deg)',
                    '-o-transform': 'rotateX(' + degree + 'deg)',
                    'transform': 'rotateX(' + degree + 'deg)'
                });
            };
            var flipY = function(degree) {
                context.$container.css({
                    '-ms-transform': 'rotateY(' + degree + 'deg)',
                    '-moz-transform': 'rotateY(' + degree + 'deg)',
                    '-webkit-transform': 'rotateY(' + degree + 'deg)',
                    '-o-transform': 'rotateY(' + degree + 'deg)',
                    'transform': 'rotateY(' + degree + 'deg)'
                });
            };
            
            context.$currentBack.html(content);
            switch (settings.direction) {
            case 'top':
                var degree = context.$el.data('degree') || 0
                context.$el.data('degree', degree + 180);
                flipX(context.$el.data('degree'));
                break;
            case 'bottom':
                var degree = context.$el.data('degree') || 0
                context.$el.data('degree', degree - 180);
                flipX(context.$el.data('degree'));
                break;
            case 'right':
                var degree = context.$el.data('degree') || 0
                context.$el.data('degree', degree + 180);
                flipY(context.$el.data('degree'));
                break;
            case 'left':
            default:
                var degree = context.$el.data('degree') || 0
                context.$el.data('degree', degree - 180);
                flipY(context.$el.data('degree'));
                break;
            }
            
            callback.call(context);
        };
        var refreshPush = function(content, callback, context) {
            var f = parseInt(context.$front.css('z-index'));
            var b = parseInt(context.$back.css('z-index'));
            context.indexFront = Math.max(f, b);
            context.indexBack = Math.min(f, b);
            context.$currentFront = (f > b ? context.$front : context.$back);
            context.$currentBack = (f < b ? context.$front : context.$back);
            
            var push = function() {
                context.$currentBack.css('z-index', context.indexFront + 1);
                context.$currentBack.animate({
                    top: 0,
                    left: 0
                }, 'slow', function() {
                    callback.call(context);
                });
            };
            
            context.$currentBack.html(content);
            switch (settings.direction) {
            case 'top':
                context.$currentBack.css('top', context.height);
                push();
                break;
            case 'bottom':
                context.$currentBack.css('top', -1 * context.height);
                push();
                break;
            case 'right':
                context.$currentBack.css('left', -1 * context.width);
                push();
                break;
            case 'left':
            default:
                context.$currentBack.css('left', context.width);
                push();
                break;
            }
        };
        var refreshFade = function(content, callback, context) {
            var f = parseInt(context.$front.css('z-index'));
            var b = parseInt(context.$back.css('z-index'));
            context.indexFront = Math.max(f, b);
            context.indexBack = Math.min(f, b);
            context.$currentFront = (f > b ? context.$front : context.$back);
            context.$currentBack = (f < b ? context.$front : context.$back);
            
            context.$currentBack.html(content);
            context.$currentFront.animate({
                opacity: 0
            }, 'slow', function() {
                context.$currentFront.css({ 'opacity': 1, 'z-index': 2 });
                context.$currentBack.css({ 'opacity': 1, 'z-index': 3 });
                
                callback.call(context);
            });
        };
        
        var results = this.map(function () {
            var $this = $(this);
            
            $this.addClass(
                'refresh refresh-{type} {direction}'
                .replace('{type}', settings.type)
                .replace('{direction}', settings.direction)
            );
            $this.html('<div class="refresh-container"><div class="refresh-container-front"></div><div class="refresh-container-back"></div></div>');
            
            var $container = $this.find('.refresh-container');
            var $front = $container.find('.refresh-container-front');
            var $back = $container.find('.refresh-container-back');
            
            var result = {
                $el: $this,
                $container: $container,
                $front: $front,
                $back: $back,
                width: $this.width(),
                height: $this.height()
            };
            result.refresh = function(content, callback) {
                switch (settings.type) {
                case 'flip':
                    refreshFlip(content, callback, result);
                    break;
                case 'push':
                    refreshPush(content, callback, result);
                    break;
                case 'fade':
                default:
                    refreshFade(content, callback, result);
                    break;
                }
            };
            return result;
        });
        
        return results.length === 1 ? results[0] : results;
    };
})(jQuery);