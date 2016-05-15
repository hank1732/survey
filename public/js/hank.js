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
    $('.option-item').transition({ y: '-4000' }, 500);

    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.selection').fadeIn('400');
    });
    $('.option-item').hammer().bind("tap", function () {
        var wrapperLi = $(this).parents('.option-title');
        var img = $(this).find('img');
        if(wrapperLi.hasClass('mutiple')){
            if(img.css("display") === 'none'){
                img.fadeIn('fast');
            }else{
                img.fadeOut('fast');
            }
        }else{
            wrapperLi.find('img').hide();
            img.fadeIn('fast');
        }        
    });
    $('.option-list-title').hammer().bind("tap", function () {
        if(!$(this).hasClass('active')){
            return false;
        }
        // $(this).addClass('tapped');
        isTapped = !isTapped;
        var index = $('.option-title').index($(this).parents('.option-title'));
        var temp = $(this);
        var wrapperLi = $(this).parents('.option-title');
        if(isTapped){
            scroll = $('body').scrollTop();

            $('.survey-question').addClass('full');
                             
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
        }else{

            $('.survey-question').removeClass('full');

            if($('body').height() - visbleWindowHeight > scroll){
                    $('body').scrollTop(index * 260);
                };
            
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').transition({ height: 'atuo' }, 666)
                    .nextAll().transition({ y: '0' }, 666)
                    .end().prevAll().transition({ y: '0' }, 666);
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
            // next question
            setTimeout(function () {                        
                var liSelect = wrapperLi.find('.check-icon:not(":hidden")');
                if(liSelect.length > 0){
                    var nextActive = wrapperLi.next();
                    while(nextActive && nextActive.hasClass('omit')){
                        nextActive = nextActive.next();
                    }
                    nextActive.find('.option-list-title').addClass('active');

                    if(wrapperLi.hasClass('question1')){
                        if(liSelect.siblings('.omit89').length > 0){
                            $('.question6').transition({height:0}).addClass('omit');
                            $('.question7').transition({height:0}).addClass('omit');
                        }else{
                            $('.question6').transition({height:260}).removeClass('omit');
                            $('.question7').transition({height:260}).removeClass('omit');
                        }
                    }                    

                    if($('body').height() - visbleWindowHeight > scroll){
                        $('body').stop().animate({
                            scrollTop: (index + 1) * 260
                        }, 666);
                        // $('body').scrollTop(scroll);
                    }
                };                           
                
            }, 1500);
            
        }
    });
    // $('.next-icon').hammer().bind("tap", function () {
    //     var li = $(this).parents('.option-list-li');
    //     li.transition({ x: '-1000px' }, 500);
    //     var liSelect = $('.option-list .check-icon:not(":hidden")').siblings('div');
    //     console.log(liSelect.text());
    // });
    // $('.pre-icon').hammer().bind("tap", function () {
    //     // var li = $(this).parents('.option-list-li');
    //     $('.option-list-li1').transition({ x: '0px' }, 500);
    //     // var liSelect = $('.option-list .check-icon:not(":hidden")').siblings('div');
    //     // console.log(liSelect.text());
    // });
    // $('.next2').hammer().bind("tap", function () {
    //     $('.selection').fadeOut('400');
    //     // var liSelect = $('.option-list .check-icon:not(":hidden")').siblings('div');
    //     // console.log(liSelect.text());
    // });
});

