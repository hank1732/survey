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

// window.onload = init;
$('.sec1 img').ready(init);

function init() {

var isSlides= false;
var isSec3= false;
var loopId = 0;
var loopIdProgress = 0;
var progress = 0;
    $('.sec1 img').delay(1000).fadeIn('slow');

// var hammertime0 = new Hammer($('.sec1')[0]);
// hammertime0.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
// hammertime0.on("swipeup", function () {
//     slide();
//     isSlides = true;
// });

$('.sec1').hammer().bind("tap", function () {
    $('.sec1').fadeOut('slow');
    setTimeout( function () {
        slide();
    }, 1000);
    $('.show-jump').show();
    $('.sec2').show(); 
    isSlides = true;
    // document.getElementById('demo').play();
    $('.voice').hammer().bind("tap", function () {
        // loopId = setInterval(function () {
        //     document.getElementById('demo').play();
        // },time * 10000 + 100);         
        loopProgress();
    });
});

setTimeout(function () {
    if(isSlides){
        return;
    }
    $('.sec1').fadeOut('slow');
    setTimeout( function () {
        $('.show-jump').show();
        slide();
    }, 500);
    $('.sec2').show(); 
    isSlides = true;
    document.getElementById('demo').play();
    loopProgress();
    $('.voice').hammer().bind("tap", function () {
        // loopId = setInterval(function () {
            // document.getElementById('demo').play();
        // },time * 10000 + 100);         
        loopProgress();
    });
}, 3000);

function slide() {
    // $('.sec1').transition({ y: '-2500' }, 500, 'ease');
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
            }, j * 1111 + 666);
        })(i);
    }
    
    setTimeout(function () {
        $('.arrow-sec2').show();
    }, 8 * 1111 + 666);
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
        that.parent().clearQueue().transition({ y: '-2500' }, 500, 'ease');

        videoStop();
    });


    var hammertime = new Hammer($('.sec2')[0]);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipeup", function () {
        $('.sec2').clearQueue().transition({ y: '-2500' }, 500, 'ease');
        $('.sec3').show();
        isSec3 = false;
        setTimeout(function () {
            if(isSec3){
                return;
            }
            $('.sec3').fadeOut('slow');
             //.clearQueue().transition({ y: '-2500' }, 500, 'ease');
            $('.sec4').show();
            isSec3 = true;
        }, 3000);
        videoStop();
    });
    // hammertime.on("swipedown", function () {
    //     $('.sec1').clearQueue().transition({ y: '0' }, 500, 'ease');
    // });


    // var hammertime2 = new Hammer($('.sec3')[0]);
    // hammertime2.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    // hammertime2.on("swipeup", function () {
    //     $('.sec3').clearQueue().transition({ y: '-2500' }, 500, 'ease');
    //     $('.sec4').show();
    // });
    // hammertime2.on("swipedown", function () {
    //     // $('.sec2').clearQueue().transition({ y: '0' }, 500, 'ease');
    //     isSec3 = true;
    // });


    // var hammertime3 = new Hammer($('.sec4')[0]);
    // hammertime3.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    // hammertime3.on("swipedown", function () {
    //     $('.sec3').clearQueue().transition({ y: '0' }, 500, 'ease');
        // isSec3 = false;
        // setTimeout(function () {
        //     if(isSec3){
        //         return;
        //     }
        //     $('.sec3').clearQueue().transition({ y: '-2500' }, 500, 'ease');
        //     $('.sec4').show();
        //     isSec3 = true;
        // }, 2500);
    // });
}

document.getElementsByTagName('body')[0].addEventListener('touchmove', function (e) {
  e.preventDefault();
});

function videoStop() {
    clearInterval(loopId);
    document.getElementById('demo').pause();
}

function loopProgress() {
    var i = 0;
    var id = 0;
    var progress = 0;
    document.getElementById('demo').pause();
    document.getElementById('demo').currentTime = 0;
    document.getElementById('demo').play();
    clearInterval(loopIdProgress);
    clearInterval(id);

    loopIdProgress = setInterval(function () {
        progress += 100/(time * 2);
        if(progress >= 100){
            $('.progress').width('100%');
            clearInterval(loopIdProgress);
            clearInterval(id);
            $('.voice img').attr('src', 'imgg/voice.svg');
        }else{
            $('.progress').width(progress + '%');
        }        
    }, 500);
    id = setInterval(function () {
        i++;
        $('.voice img').attr('src', 'imgg/voice' + (i%3 + 1) + '.svg');
        // if(i === 1){
            // clearInterval(id);
            // $('.voice img').attr('src', 'imgg/voice.svg');
        // }            
    },400);
}


};












