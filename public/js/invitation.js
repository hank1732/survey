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

$('.sec1 img').hide().delay(500).fadeIn('slow');

var isSlides= false;

var hammertime0 = new Hammer($('.sec1')[0]);
hammertime0.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
hammertime0.on("swipeup", function () {
    slide();
    isSlides = true;
});

setTimeout(function () {
    if(isSlides){
        return;
    }
    slide();
    isSlides = true;
}, 2500);

function slide() {
    $('.sec1').transition({ y: '-2500' }, 1000, 'ease');
    $('.sec2').show();  
    swipeSection();

    var lis = $('li');
    for (var i = 0 ; i <= lis.length - 1; i++) {
        (function (j) {
            setTimeout(function () {
                $(lis[j]).show();
                // if($('.sec2').height() > $('body').height()){
                //     $('body').animate({scrollTop: 500 }, '500', 'swing');
                // }
                console.log("$('.sec2').height()" + $('.sec2').height());
            }, j * 1000 + 1000);
        })(i);
    }
    $('.voice').hammer().bind("tap", function () {

        document.getElementById('demo').play();
    });
    
    setTimeout(function () {
        $('.arrow-sec2').show();
    }, 8 * 1000 + 1000);
}

function swipeSection() {
    $('img.rotate').hammer().bind("tap", function () {
    var that = $(this);
    if(that.hasClass('arrow-sec2')){
            $('.sec3').show();
        }
    if(that.hasClass('arrow-sec3')){
        $('.sec4').show();
    }
    that.parent().transition({ y: '-2500' }, 1000, 'ease', function () {
        
    });
    });
    var hammertime = new Hammer($('.sec2')[0]);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipeup", function () {
        $('.sec2').transition({ y: '-2500' }, 1000, 'ease');
        $('.sec3').show();
    });
    hammertime.on("swipedown", function () {
        $('.sec1').transition({ y: '0' }, 1000, 'ease');
    });
    var hammertime2 = new Hammer($('.sec3')[0]);
    hammertime2.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime2.on("swipeup", function () {
        $('.sec3').transition({ y: '-2500' }, 1000, 'ease');
        $('.sec4').show();
    });
    hammertime2.on("swipedown", function () {
        $('.sec2').transition({ y: '0' }, 1000, 'ease');
    });

    var hammertime3 = new Hammer($('.sec4')[0]);
    hammertime3.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime3.on("swipedown", function () {
        $('.sec3').transition({ y: '0' }, 1000, 'ease');
    });
}

document.getElementsByTagName('body')[0].addEventListener('touchmove', function (e) {
  e.preventDefault();
});












