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
    $('.option-item').transition({ y: '-2000' }, 500);

    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.selection').fadeIn('400');
    });
    $('.option-item').hammer().bind("tap", function () {
        var img = $(this).find('img');
        if(img.css("display") === 'none'){
            img.fadeIn('fast');
        }else{
            img.fadeOut('fast');
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
            $('.survey-question').addClass('full');
                             
            wrapperLi.nextAll().transition({ y: '2000' }, 666)
                .end().prevAll().transition({ y: '-2000' }, 666);
            wrapperLi.addClass('full').transition({ height: 'atuo' }, 666);
            temp.transition({ height: '24%' }, 666);

            temp.nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).transition({ y: '0' }, 777);
                }, index * 100);
            });
        }else{
            $('.survey-question').removeClass('full');
            
            temp.transition({ height: '260' }, 666, function () {
                wrapperLi.removeClass('full').transition({ height: 'atuo' }, 666)
                    .nextAll().transition({ y: '0' }, 666)
                    .end().prevAll().transition({ y: '0' }, 666);
            });
            temp.nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).transition({ y: '-2000' }, 777);
                }, index * 100);
            });
            // next question
            setTimeout(function () {                        
                var liSelect = $('.option-ul .check-icon:not(":hidden")');
                if(liSelect.length > 0){
                    wrapperLi.next().find('.option-list-title').addClass('active');
                }
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

