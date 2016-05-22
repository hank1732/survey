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
    var bodyHeight = $('body').height();
    var visbleWindowHeight = $(window).height();
    var tapSelectCount = 0;


    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.selection').fadeIn('400');
    });

    // dom prepare
    // $('.option-item').transition({ y: '-1800' }, 500).hide();
    $('.option-item').transition({ y: '-1800' }, 500);
    $('.text-vcenter').first().addClass('underline');
    $('.option-ul').first().find('.option-list-title').addClass('active');
    $('.option-ul li').prepend('<div class="lineTop"></div>')
        .append('<div class="lineBottom"></div>');

    // tap option and show tick
    $('.option-item').hammer().bind("tap", function () {
        var wrapperLi = $(this).parents('.option-title');
        var img = $(this).find('img');
        var userConfirm = wrapperLi.find('.user-confirm');
        if($(this).hasClass('js-single')){
            wrapperLi.find('img').hide();
            img.fadeIn('fast');
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
                userConfirm.hammer().bind("tap", fold);
                userConfirm.removeClass('disable');
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
            userConfirm.hammer().unbind("tap", fold);
            wrapperLi.find('.user-confirm').addClass('disable');
        }else{          
            userConfirm.hammer().unbind('tap').bind("tap", fold);
            userConfirm.removeClass('disable');
        }
        //  reset selected
        var selectedLi = wrapperLi.nextAll('.option-title');
        selectedLi.find('img').hide()
            .end().find('.option-list-title').removeClass('active')
            .end().find('.text-vcenter').removeClass('underline');
    });

    // question tap
    $('.option-list-title').hammer().bind("tap", unfold);
    $('.js-single').hammer().bind("tap", fold);
    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.option-title');
        var temp = $(this);

        scroll = $('body').scrollTop();
        $('.back-tip').show();
        wrapperLi.find('.option-ul').addClass('flex');
        $('.survey-question').addClass('full');

        // question title list
        // wrapperLi.nextAll().transition({ y: '2000' }, 666)
        //     .end().prevAll().transition({ y: '-2000' }, 666);
        //     
        wrapperLi.nextAll(':not(.omit)').hide()
            .end().prevAll(':not(.omit)').hide();
        wrapperLi.addClass('full').transition({ height: 'atuo' }, 666);
        temp.transition({ height: '24%' }, 666);
        // temp.height('24%');

        // option list
        temp.nextAll('.option-item').each(function(index, el) {
            setTimeout(function () {
                $(el).show().transition({ y: 0 }, 888, 'ease');
            }, index * 50);
        });
        wrapperLi.find('.option-list-title').hammer().unbind("tap", unfold);
        // $('.back-entery').hammer().bind("tap", fold);
    };
    function fold() {
        var self = this;
        var index = $('.option-title').index($(this).parents('.option-title'));
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
        // $('.user-confirm').hammer().unbind("tap", fold);

        // this question
        setTimeout(function () {
            $('.back-tip').hide();
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').transition({ height: 'atuo' }, 666);
                // $('body').animate({scrollTop: scroll}, 100);
                // wrapperLi.nextAll().transition({ y: '0' }, 666)
                //     .end().prevAll().transition({ y: '0' }, 666);
                //     
                wrapperLi.nextAll(':not(.omit)').show()
                    .end().prevAll(':not(.omit)').show();
                $('body').scrollTop(scroll);
                wrapperLi.find('.option-ul').removeClass('flex');
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
                var nextActive = wrapperLi.next();
                while(nextActive && nextActive.hasClass('omit')){
                    nextActive = nextActive.next();
                };

                wrapperLi.find('.text-vcenter').removeClass('underline');
                nextActive.find('.option-list-title').addClass('active')
                    .find('.text-vcenter').addClass('underline');

                if(nextActive.hasClass('complete')){
                    nextActive.addClass('active')
                        .find('.text-vcenter').addClass('underline');
                }

                if(wrapperLi.hasClass('question1')){
                    if(wrapperLi.find('.omit89').length > 0){
                        // $('.question6').transition({height:0}).addClass('omit');
                        // $('.question7').transition({height:0}).addClass('omit');
                        $('.question6').hide();
                        $('.question7').hide();
                    }else{
                        // $('.question6').transition({height:260}).removeClass('omit');
                        // $('.question7').transition({height:260}).removeClass('omit');
                        $('.question6').show();
                        $('.question7').show();
                    }
                }
            };

            // $('.back-entery').hammer().unbind("tap", fold);
            wrapperLi.find('.option-list-title').hammer().bind("tap", unfold);
            // wrapperLi.find('.option-item').hammer().unbind("tap", fold);
            temp.nextAll('.option-item').hide();
        }, 1000);
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

