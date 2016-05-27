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
    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.person-inform').fadeIn('400');
        afterFirstTap();
    });
    $('.user-name').val(localStorage.getItem('name'));
    $('.user-account').val(localStorage.getItem('account'));
     userInfoConfirm();
    $('.person-inform').keyup(userInfoConfirm);
    function userInfoConfirm() {
        if($('.user-name').val() !== '' && $('.user-account').val() !== ''){
            $('.user-name-confirm span').removeClass('disable');
            $('.user-name-confirm span').hammer().unbind('tap').bind("tap", function () {
                $('.person-inform').fadeOut('slow');
                $('.selection').fadeIn('400');
                localStorage.setItem('name', $('.user-name').val());
                localStorage.setItem('account', $('.user-account').val());
            });
        }
    }      
});


function afterFirstTap() {
    var isTapped = false;
    var scroll = 0;
    // dom prepare
    $('.selection .text-vcenter').first().addClass('underline');
    $('.option-list-title').first().addClass('active');
    $('.option-ul li').prepend('<div class="lineTop"></div>')
        .append('<div class="lineBottom"></div>');
    // question tap
    $('.active').hammer().bind("tap", unfold);

    // tap option and show tick
    // $('.option-item').hammer().bind("tap", function () {
    function optionTap() {
        var wrapperLi = $(this).parents('.option-title');
        var img = $(this).find('img');
        var userConfirm = wrapperLi.find('.user-confirm');
        if($(this).hasClass('js-single')){
            wrapperLi.find('img').hide();
            img.fadeIn('fast');
            fold.apply(this);
            wrapperLi.addClass('js-answered');
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
        if($(this).hasClass('js-other')){
            wrapperLi.find('img').hide();
            img.fadeIn('fast');

            var otherInput = $(this).find('.other-input');
            var confirmButton = wrapperLi.find('.user-other-confirm');
            otherInput.focus();
            if(otherInput.val() === ''){
                confirmButton.addClass('disable')
                    .hammer().unbind('tap');
                wrapperLi.removeClass('js-answered');
            }else{
                confirmButton.removeClass('disable')
                        .hammer().unbind('tap').bind("tap", fold);
                    wrapperLi.addClass('js-answered');
            }
        }
        if($(this).hasClass('js-other-mutiple')){
            if(img.css("display") === 'none'){
                img.fadeIn('fast');
            }else{
                img.fadeOut('fast');
            }
            var otherInput = $(this).find('.other-input');
            var confirmButton = wrapperLi.find('.user-other-confirm');
            otherInput.focus();
            if(otherInput.val() === ''){
                confirmButton.addClass('disable')
                    .hammer().unbind('tap');
                wrapperLi.removeClass('js-answered');
            }else{
                confirmButton.removeClass('disable')
                        .hammer().unbind('tap').bind("tap", fold);
                    wrapperLi.addClass('js-answered');
            }
        }
        if($(this).hasClass('js-hurt')){
            $(this).find('.hurt-mask').hide();
            $(this).find('.hurt-ul').css('visibility', 'visible');
            $(this).hammer().unbind('tap');
        }
        if(wrapperLi.attr('data-tapCount') == 0){
            userConfirm.hammer().unbind("tap");
            wrapperLi.find('.user-confirm').addClass('disable');
        }
        if(wrapperLi.attr('data-tapCount') > 0){
            userConfirm.hammer().unbind('tap').bind("tap", fold);
            userConfirm.removeClass('disable');
        }
        //  reset all following selected questions
        var selectedLi = wrapperLi.nextAll('.option-title');
        selectedLi.find('img').hide().end()
            .find('.option-list-title').removeClass('active')
                .css('background', '')
            .find('.text-vcenter').removeClass('underline');
    };

    // $('.js-single').hammer().bind("tap", fold);
    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.option-title');
        var temp = $(this);

        scroll = $('body').scrollTop();

        wrapperLi.find('.option-ul').children('.option-item').each(function(index, el) {
            $(el).css('background', '#' + color[wrapperLi.attr('id')][index + 1] );
        });

        $('.survey-question').addClass('full');

        wrapperLi.addClass('full').height('atuo')
            .find('.option-ul').addClass('flex')
            .find('.back-tip').show()
            .end().find('.option-item').hammer().unbind('tap').bind("tap", optionTap);          

         wrapperLi.nextAll().hide()
            .end().prevAll().hide();

        temp.hammer().unbind("tap", unfold)
            .transition({ height: '24%' }, 666)
            .nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).show().transition({ y: 0 }, 888, 'ease');
                }, index * 50);
            });

        // other input
        var otherInput = wrapperLi.find('.other-input');
        var confirmButton = wrapperLi.find('.user-other-confirm');
        if(otherInput.length > 0){
            wrapperLi.keyup(function(event) {
                if(otherInput.val() !== ''){
                    confirmButton.removeClass('disable')
                        .hammer().unbind('tap').bind("tap", fold);
                    wrapperLi.addClass('js-answered');
                }else{
                    confirmButton.addClass('disable')
                        .hammer().unbind('tap');
                    wrapperLi.removeClass('js-answered');
                }
            });
        }
    };
    function fold() {
        var self = this;
        // var index = $('.option-title').index($(this).parents('.option-title'));
        var temp = [];
        var count = 0;
        while(temp.length == 0 && count < 6){
            switch(count){
                case 0:temp = $(this).closest('.option-list-title');break;
                case 1:temp = $(this).siblings('.option-list-title');break;
                case 2:temp = $(this).closest('.option-item').siblings('.option-list-title');break;
                case 3:temp = $(this).closest('.option-hurt').siblings('.option-list-title');break;
            }
            count++;
        };
        // $(this).closest('.option-list-title').length ?  : 
        //                 $(this).siblings('.option-list-title').length ? $(this).siblings('.option-list-title') : $(this).closest('.option-item').siblings('.option-list-title');
        var wrapperLi = $(this).parents('.option-title');
        var inputsFields = wrapperLi.find('.option-item').filter(function(index, el) {
                        return $(el).find('img').css("display") !== 'none';
                    }).find('input');
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
            temp.nextAll('.option-item:not(.hurt)').each(function(index, el) {
                setTimeout(function () {
                    $(el).transition({ y: '-1800' }, 1000, 'ease');
                }, index * 50);
            });            
        }, tickStaytime);

        
        // next question
        setTimeout(function () {
            if(wrapperLi.hasClass('js-answered')){
                // question branch
                if(wrapperLi.hasClass('question3')){
                    if($(self).find('.omit89').length > 0){
                        $('.question8').addClass('omit').hide();
                        $('.question9').addClass('omit').hide();
                    }else{
                        $('.question8').removeClass('omit').show();
                        $('.question9').removeClass('omit').show();
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
                    .css('background', '#' + color[nextActive.attr('id')][0])
                    .find('.text-vcenter').addClass('underline')
                    .end().hammer().unbind("tap").bind("tap", unfold);

                // complete button
                if(nextActive.hasClass('complete')){
                    nextActive.addClass('active')
                        .find('.text-vcenter').addClass('underline');
                }
            };

            wrapperLi.find('.option-list-title').hammer().unbind("tap").bind("tap", unfold);
        }, 1400);
    }

    $('.complete').hammer().bind('tap', function(event) {
        if(!$(this).hasClass('active')){
            return false;
        }
        var poll = {};
        poll['user-name'] = ['姓名',$('.user-name').val()];
        poll['user-account'] = ['Nike账号',$('.user-account').val()];
        $('.option-ul').each(function(index, el) {
            // all not omit questions
            if(!$(el).closest('.option-title').hasClass('omit')){
                var key = [];
                // question content
                key.push($(el).find('.option-list-title span').text());
                // question selected option
                $(el).find('.option-item').filter(function(index, el) {
                        return $(el).find('img').css("display") !== 'none';
                    }).each(function(index, el) {
                        key.push($(el).find('.text-vcenter').text());
                        if($(el).find('input').val() !== '' && $(el).find('input').val() !== undefined){
                            key.push($(el).find('input').val());
                        }               
                });
                poll[index] = key;
            }            
        });
        console.log(poll);
        $.ajax({
            url: '/write', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify(poll)}
        ).success(function () {
            $('.selection').fadeOut('slow');
            $('.end').fadeIn('fast');
        });
    });
};


var color = {
    question3:['fb5f9d','fdbfd8','fd9fc4'],
    question4:['ca2d63','eaabc0','e7a0b9','e496b1','df81a1','da6c92','d55782'],
    question5:['fa81a1','fdccd9','fdc6d5','fcc0d0','fcb3c7','fca7bd','fb9ab4'],
    question6:['f3455e','fab4be','faabb6','f9a2ae','f88f9e','f77d8e','f66a7e'],
    question7:['fa6474','fdc1c7','fcb1b9','fca2ac'],
    question8:['d9303c','f0acb1','ec979d','e8838a','e56e77'],
    question9:['de4d3d','f2b8b1','eb948b'],
    question10:['ec7048','f7c6b6','f5b7a3','f4a991','f29b7f','f08d6d'],
    question11:['f2906a','fad2c3','f9cdbc','f8c2ad','f8c2ad','f7bca6','f7b79e','f6b197','f5a688'],
    question12:['e66c11','f5c4a0','f4bd94','f2b588','f4b78a','f0a770','efa064','ee9859','ec914d','eb8a41','ea8235'],
    question13:['e9823e','f6cdb2','f5c7a8','f4c09e','f2b48b','f0a878','ee9b65'],
    question14:['e49e32','f4d8ad','f3d3a3','f1ce98','f0ca8e','efc584','ecbb70','eab25b'],
    question15:['d59316','eed4a2','eac98a','e6be73','e2b45c'],
    question16:['e1b427','f3e1a8','f0d993','edd27d','eacb68','e7c352'],
    // question17:['ddcc1b','f1eaa4','f0e898','eee58d','ece382','ebe076','e9de6b','e7db60','e4d649','e3d43e','e1d233'],
    question17: ['d2bb15','e4d673','e2d367','e0d05b','ddcc50','dbc944','d9c638','d7c22d','d5bf21','d2bb15','d2bb15'],
    question18:['c5be2c','e8e5aa','e5e2a0','e2de95','dfdb8b','dcd880','d9d576','d7d26b','d1cb56'],
    // question19:['d9e50d','f0f49e','eef392','ecf286','eaf17a','e8ef6e','e6ee62','e5ed56','e1ea3e'],
    question19:['abae2b','cdce80','c9ca75','c4c66b','c0c260','bcbe56','b8ba4b','b4b641','abae2b'],
    // question20:['c4da0e','dce96e','d6e556','d0e23e'],
    question20:['b9c517','ced75d','c7d146','c0cb2f'],
    // question21:['d7f904','ebfc81','e7fb68','e3fb4f','dffa36'],
    question21:['cbdc21','d6e34e','d1e038','cede2d','cbdc21'],
    // question22:['a9e535','d4f29a','cbef86','c3ed72','baea5e'],
    question22:['b4cd1f','cedf6e','cbdc62','c3d74c','bcd236 ']
}
 




