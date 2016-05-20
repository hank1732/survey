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

    $('.option-item').transition({ y: '-4000' }, 500);
    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.selection').fadeIn('400');
    });
    // $('.text-vcenter').first().addClass('underline');

    $('.option-item').hammer().bind("tap", function () {
        var wrapperLi = $(this).parents('.option-title');
        var img = $(this).find('img');
        if($(this).hasClass('js-single')){
            wrapperLi.find('img').hide();
            img.fadeIn('fast');
        }
        // if($(this).hasClass('js-mutiple')){
        //     if(img.css("display") === 'none'){
        //         img.fadeIn('fast');
        //     }else{
        //         img.fadeOut('fast');
        //     }
        // }
        // if($(this).hasClass('js-mutiple2')){
        //     if(wrapperLi.attr('data-tapCount') === undefined ){
        //         wrapperLi.attr('data-tapCount', 0);
        //     }
        //     if(img.css("display") === 'none'){
        //         if(wrapperLi.attr('data-tapCount') < 2){
        //             img.fadeIn('fast');
        //             wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 0 + 1);
        //         }                
        //     }else{
        //         img.fadeOut('fast');
        //         wrapperLi.attr('data-tapCount', wrapperLi.attr('data-tapCount') - 1);
        //     }
        // }     
    });
    $('.option-list-title').hammer().bind("tap", unfold);
    $('.js-single').hammer().bind("tap", fold);
    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.option-title');
        var temp = $(this);

        scroll = $('body').scrollTop();
        // $('.back-tip').fadeIn('fast');

        $('.survey-question').addClass('full');
        wrapperLi.find('.option-ul').addClass('flex');
        // $(this).addClass('center');
                         
        wrapperLi.nextAll().transition({ y: '2000' }, 666)
            .end().prevAll().transition({ y: '-2000' }, 666);
        wrapperLi.addClass('full').transition({ height: 'atuo' }, 666);
        temp.transition({ height: '24%' }, 666);

        temp.nextAll('.option-item').each(function(index, el) {
            if(wrapperLi.hasClass('twoInOne')){
                setTimeout(function () {
                    $(el).transition({ y: 0 }, 777);
                }, Math.floor(index/2) * 100);
            }else{
                setTimeout(function () {
                    $(el).transition({ y: 0 }, 777);
                }, index * 100);
            }
        });
        $('.option-list-title').hammer().unbind("tap", unfold);
        $('.back-entery').hammer().bind("tap", fold);
    };
    function fold() {
        var index = $('.option-title').index($(this).parents('.option-title'));
        var temp = $(this).hasClass('option-item') ? $(this).siblings('.option-list-title') : $(this);
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
        $('.back-tip').fadeOut('fast');

        setTimeout(function () {
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').transition({ height: 'atuo' }, 666)
                    .nextAll().transition({ y: '0' }, 666)
                    .end().prevAll().transition({ y: '0' }, 666);
                $('body').scrollTop(scroll);
                wrapperLi.find('.option-ul').removeClass('flex'); 
            });
            temp.nextAll('.option-item').each(function(index, el) {
                if(wrapperLi.hasClass('twoInOne')){
                    setTimeout(function () {
                        $(el).transition({ y: '-2000' }, 777);
                    }, Math.floor(index/2) * 100);
                }else{
                    setTimeout(function () {
                        $(el).transition({ y: '-2000' }, 777);
                    }, index * 100);
                }
            });
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
        }, 2000);
    }
});

