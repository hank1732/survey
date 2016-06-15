(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$('.sec1').hammer().bind("tap", function () {
    $(this).fadeOut('slow');
    $('.sec2').show();
    $('.arrow-sec2').hide();
    var lis = $('li');
    for (var i = 0 ; i <= lis.length - 1; i++) {
        (function (j) {
            setTimeout(function () {
                $(lis[j]).show();
                $('body').animate({scrollTop: 500 }, '500', 'swing');
            }, j * 2000 + 200);
        })(i);
    }
    // setTimeout(function () {
        
    // }, 10 * 2000 + 250);
    setTimeout(function () {
        $('.arrow-sec2').show();
        swipeSection();
    }, 10 * 2000 + 1000);
});

function swipeSection() {
    $('img.rotate').hammer().bind("tap", function () {
    var that = $(this);
    if(that.hasClass('arrow-sec2')){
            $('.sec3').show();
        }
    if(that.hasClass('arrow-sec3')){
        $('.sec4').show();
    }
    that.parent().transition({ y: '-2500' }, 600, 'ease', function () {
        
    });
    });
    var hammertime = new Hammer($('.sec2')[0]);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipeup", function () {
        $('.sec2').transition({ y: '-2500' }, 600, 'ease');
        $('.sec3').show();
    });
    var hammertime2 = new Hammer($('.sec3')[0]);
    hammertime2.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime2.on("swipeup", function () {
        $('.sec3').transition({ y: '-2500' }, 600, 'ease');
        $('.sec4').show();
    });
}











