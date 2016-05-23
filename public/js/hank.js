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

$(function () {
    var isTapped = false;
    var scroll = 0;

    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.selection').fadeIn('400');
    });

    // dom prepare
    // $('.option-item').transition({ y: '-1800' }, 500).hide();
    $('.option-item').transition({ y: '-1800' }, 500);
    $('.text-vcenter').first().addClass('underline');
    $('.option-list-title').first().addClass('active');
    $('.option-ul li').prepend('<div class="lineTop"></div>')
        .append('<div class="lineBottom"></div>');
    // question tap
    $('.option-list-title').hammer().bind("tap", unfold);

    // tap option and show tick
    $('.option-item').hammer().bind("tap", function () {
        var wrapperLi = $(this).parents('.option-title');
        var img = $(this).find('img');
        var userConfirm = wrapperLi.find('.user-confirm');
        if($(this).hasClass('js-single')){
            wrapperLi.find('img').hide();
            img.fadeIn('fast');
            fold.apply(this);
        }
        if($(this).hasClass('js-mutiple')){
            if(wrapperLi.attr('data-tapCount') === undefined ){
                wrapperLi.attr('data-tapCount', 0);
            }
            if(img.css("display") === 'none'){
                img.fadeIn('fast');
                wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 0 + 1);
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 1);
            }
        }
        if($(this).hasClass('js-mutiple2')){
            if(wrapperLi.attr('data-tapCount') === undefined ){
                wrapperLi.attr('data-tapCount', 0);
            }
            if(img.css("display") === 'none'){
                if(wrapperLi.attr('data-tapCount') < 2){
                    img.fadeIn('fast');
                    wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 0 + 1);
                    if(wrapperLi.attr('data-tapCount') == 2 ){
                        fold.apply(this);
                    }
                }
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 1);
            }
        }
        if($(this).hasClass('js-mutiple3')){
            if(wrapperLi.attr('data-tapCount') === undefined ){
                wrapperLi.attr('data-tapCount', 0);
            }
            if(img.css("display") === 'none'){
                if(wrapperLi.attr('data-tapCount') < 3){
                    img.fadeIn('fast');
                    wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 0 + 1);
                    if(wrapperLi.attr('data-tapCount') == 3 ){
                        fold.apply(this);
                    }
                }
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 1);
            }
        }
        if(wrapperLi.attr('data-tapCount') == 0){
            userConfirm.hammer().unbind("tap");
            wrapperLi.find('.user-confirm').addClass('disable');
        }else{          
            userConfirm.hammer().unbind('tap').bind("tap", fold);
            userConfirm.removeClass('disable');
        }
        //  reset all following selected questions
        var selectedLi = wrapperLi.nextAll('.option-title');
        selectedLi.find('img').hide().end()
            .find('.option-list-title').removeClass('active')
            .find('.text-vcenter').removeClass('underline');
    });

    // $('.js-single').hammer().bind("tap", fold);
    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.option-title');
        var temp = $(this);

        scroll = $('body').scrollTop();

        $('.survey-question').addClass('full');

        wrapperLi.addClass('full').height('atuo')
            .find('.option-ul').addClass('flex')
            .find('.back-tip').show();          

         wrapperLi.nextAll().hide()
            .end().prevAll().hide();

        temp.hammer().unbind("tap", unfold)
            .transition({ height: '24%' }, 666)
            .nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).show().transition({ y: 0 }, 888, 'ease');
                }, index * 50);
            });
    };
    function fold() {
        var self = this;
        // var index = $('.option-title').index($(this).parents('.option-title'));
        var temp = $(this).closest('.option-list-title').length ? $(this).closest('.option-list-title') : 
                        $(this).siblings('.option-list-title').length ? $(this).siblings('.option-list-title') : $(this).closest('.option-item').siblings('.option-list-title');
        var wrapperLi = $(this).parents('.option-title');
        var inputsFields = wrapperLi.find('input');
        var isInputEmpty = inputsFields.filter(function(index, el) {
            return $(el).val() === '' ;
        });
        var tickStaytime = 444;
        if ($(this).hasClass('user-confirm')) {
            tickStaytime = 10;
        }

        // no field left empty
        if(inputsFields.length === 0 || isInputEmpty.length === 0){
            // answer poll
            var liSelect = wrapperLi.find('.check-icon');
            if(liSelect.length === 0){
                wrapperLi.addClass('js-answered');
            }else{
                if(liSelect.filter(':visible').length > 0){
                    wrapperLi.addClass('js-answered');
                }
            }
        };

        $('.survey-question').removeClass('full');

        // this question
        setTimeout(function () {
            wrapperLi.find('.back-tip').hide();
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').height('atuo')
                    .find('.option-ul').removeClass('flex');

                wrapperLi.nextAll(':not(.omit)').show()
                    .end().prevAll(':not(.omit)').show();

                $('body').scrollTop(scroll);
            });
            temp.nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).transition({ y: '-1800' }, 1000, 'ease');
                }, index * 50);
            });            
        }, tickStaytime);

        
        // next question
        setTimeout(function () {
            if(wrapperLi.hasClass('js-answered')){
                // question branch
                if(wrapperLi.hasClass('question1')){
                    if(wrapperLi.find('.omit89').length > 0){
                        $('.question6').hide();
                        $('.question7').hide();
                    }else{
                        $('.question6').show();
                        $('.question7').show();
                    }
                }
                if(wrapperLi.hasClass('question15')){
                    $('.Q15').hide().addClass('omit');
                    $('.Q21').hide().addClass('omit');
                    if($(self).hasClass('OP15A')){
                        $('.Q15A').not('.Q21').show().removeClass('omit');
                    }
                    if($(self).hasClass('OP15B')){
                        $('.Q15B').show().removeClass('omit');
                    }
                    if($(self).hasClass('OP15C')){
                        $('.Q15C').show().removeClass('omit');
                    }
                    if($(self).hasClass('OP15D')){
                        $('.Q15D').show().removeClass('omit');
                    }
                }
                if(wrapperLi.hasClass('question21')){
                    if($(self).hasClass('OP21A')){
                        $('.Q21A').show().removeClass('omit');
                    }
                    if($(self).hasClass('OP21B')){
                        $('.Q21B').show().removeClass('omit');
                    }
                    if($(self).hasClass('OP21C')){
                        $('.Q21C').show().removeClass('omit');
                    }
                }
                // next question
                var nextActive = wrapperLi.next();
                while(nextActive && nextActive.hasClass('omit')){
                    nextActive = nextActive.next();
                };
                wrapperLi.find('.text-vcenter').removeClass('underline');
                nextActive.find('.option-list-title').addClass('active')
                    .find('.text-vcenter').addClass('underline');

                // complete button
                if(nextActive.hasClass('complete')){
                    nextActive.addClass('active')
                        .find('.text-vcenter').addClass('underline');
                }
            };

            wrapperLi.find('.option-list-title').hammer().unbind("tap").bind("tap", unfold);
        }, 1500);
    }

    $(window).keyup(function(event) {
       if($('.user-name').val() !== '' && $('.user-account').val() !== ''){
            $('.user-name-confirm').removeClass('disable');
            $('.user-name-confirm').hammer().unbind('tap').bind("tap", fold);
       }
    });

    $('.complete').hammer().bind('tap', function(event) {
        if(!$(this).hasClass('active')){
            return false;
        }
        $('.selection').fadeOut('slow');
        $('.end').fadeIn('fast');
    });
});

