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
    var optionPanel = $('.option-panel');


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

    // question tap
    $('.option-list-title').hammer().bind("tap", unfold);
    $('.js-single').hammer().bind("tap", fold);
    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.option-title');
        var wrapperLiInPanel = wrapperLi.clone(true, true).addClass('liInPanel full').appendTo(optionPanel);
        var temp = wrapperLiInPanel.find('.option-list-title');

        // scroll = $('body').scrollTop();
        optionPanel.show();
        $('.back-tip').show();
        wrapperLiInPanel.find('.option-ul').addClass('flex');
        // $('.survey-question').addClass('full');

        // question title list
        // wrapperLi.nextAll().transition({ y: '2000' }, 666)
        //     .end().prevAll().transition({ y: '-2000' }, 666);
        // wrapperLi.addClass('full').transition({ height: 'atuo' }, 666);
        temp.transition({ height: '24%' }, 666);

        // option list
        temp.nextAll('.option-item').each(function(index, el) {
            setTimeout(function () {
                $(el).show().transition({ y: 0 }, 888, 'ease');
            }, index * 50);
        });

            // tap option and show tick
        wrapperLiInPanel.find('.option-item').hammer().bind("tap", function () {
            var wrapperLi = $(this).parents('.option-title');
            var img = $(this).find('img');
            if($(this).hasClass('js-single')){
                wrapperLi.find('img').hide();
                img.fadeIn('fast');
            }
            if($(this).hasClass('js-mutiple')){
                if(img.css("display") === 'none'){
                    img.fadeIn('fast');
                }else{
                    img.fadeOut('fast');
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
        });

        $('.option-list-title').hammer().unbind("tap", unfold);
        $('.back-entery').hammer().bind("tap", fold);
    };
    function fold(whichLi) {
        var index = $('.option-title').index($(this).parents('.option-title'));
        var temp = $(this).closest('.option-list-title').length ? $(this).closest('.option-list-title') : 
                        $(this).siblings('.option-list-title').length ? $(this).siblings('.option-list-title') : $(this).closest('.option-item').siblings('.option-list-title');
        var wrapperLi = $(this).parents('.option-title');
        var inputsFields = wrapperLi.find('input');
        var isInputEmpty = inputsFields.filter(function(index, el) {
            return $(el).val() === '' ;
        });

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
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').transition({ height: 'atuo' }, 666);
                $('body').scrollTop(scroll);
                // $('body').animate({scrollTop: scroll}, 100);
                wrapperLi.nextAll().transition({ y: '0' }, 666)
                    .end().prevAll().transition({ y: '0' }, 666);
                wrapperLi.find('.option-ul').removeClass('flex'); 
            });
            temp.nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).transition({ y: '-1800' }, 1000, 'ease');
                }, index * 50);
            });
            $('.back-tip').hide();
        }, 444);
        // next question
        setTimeout(function () {
            if(wrapperLi.hasClass('js-answered')){
                var nextActive = wrapperLi.next();
                while(nextActive && nextActive.hasClass('omit')){
                    nextActive = nextActive.next();
                };

                wrapperLi.find('.text-vcenter').removeClass('underline');
                nextActive.find('.option-list-title').addClass('active')
                    .find('.text-vcenter').addClass('underline');

                if(wrapperLi.hasClass('question1')){
                    if(wrapperLi.find('.omit89').length > 0){
                        $('.question6').transition({height:0}).addClass('omit');
                        $('.question7').transition({height:0}).addClass('omit');
                    }else{
                        $('.question6').transition({height:260}).removeClass('omit');
                        $('.question7').transition({height:260}).removeClass('omit');
                    }
                }                    
            };

            $('.back-entery').hammer().unbind("tap", fold);
            $('.option-list-title').hammer().bind("tap", unfold);

            temp.nextAll('.option-item').hide();
        }, 2000);
    }

    $(window).keyup(function(event) {
       if($('.user-name').val() !== '' && $('.user-account').val() !== ''){
            $('.user-name-confirm').removeClass('disable');
            $('.user-name-confirm').hammer().bind("tap", fold);
       }
    });
    $('.question11 .option-item').hammer().bind("tap", function () {
        $('.user-interest-confirm').removeClass('disable');
        $('.user-interest-confirm').hammer().bind("tap", fold);
    });
});

