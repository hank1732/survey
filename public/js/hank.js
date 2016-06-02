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

var poll = JSON.parse(localStorage.getItem('nike')) || 
            {
                'user-name':[],
                'user-account':[]
            };

$(function () {
    $('.enter-button').hammer().bind("tap", function () {
        $(this).hide();
        $('.welcome').fadeOut('slow');
        $('.person-inform').fadeIn('400');
    });

    //restore personel infomation
    $('.user-name').val(poll['user-name'][1]);
    $('.user-account').val(poll['user-account'][1]);
    userInfoConfirm();

    $('.person-inform').keyup(userInfoConfirm);
    function userInfoConfirm() {
        var uname = $('.user-name').val();
        var uaccount = $('.user-account').val();
        var allWrapperLi = $('.wrapper-li');
        var maxWrapperLi = null;
        if(uname !== '' && uaccount !== ''){
            $('.user-name-confirm span').removeClass('disable');
            $('.user-name-confirm span').hammer().unbind('tap').bind("tap", function () {
                $('.person-inform').fadeOut('slow');
                $('.selection').fadeIn('400');

                // if the name and account unchange
                if(poll['user-name'][1] === uname && poll['user-account'][1] === uaccount){
                    // restore selected
                    // for(var param in poll){
                    //     $(param).find('.option-item .text-vcenter').filter(function(index, el) {
                    //         return $(el).text() === poll[param];
                    //     }).find('img').show();
                    // }
                    allWrapperLi.each(function(index, el) {
                        var thisEl = $(el);
                        var elClass = thisEl.attr('class').replace(/js-answered/,'')
                                        .replace(/omit/,'')
                                        .replace(/wrapper-li/,'')
                                        .trim();
                        if(poll[elClass] !== undefined){
                            // console.log(poll[elClass]);
                            thisEl.addClass('js-answered')
                                .find('.option-list-title').addClass('active')
                                .css('background', '#' + color[thisEl.attr('data-id')][0]);
                            var selected = thisEl.find('.option-item').filter(function(index, el) {
                                for (var i = poll[elClass].length - 1; i >= 0; i--) {
                                    if($(el).find('.text-vcenter').text() === poll[elClass][i]){
                                        if($(el).hasClass('js-other') || $(el).hasClass('js-other-mutiple')){
                                            $(el).find('input').val(poll[elClass][i + 1]);
                                            thisEl.find('.user-other-confirm').removeClass('disable');
                                        }
                                        // if($(el).hasClass('hurt')){
                                        //     $('.hurt-mask').hide();
                                        // }
                                        return true;
                                    }
                                }
                                return false;
                            });
                            selected.find('img').show();
                            if(selected.length > 0){
                                thisEl.attr('data-tap-count', selected.length);
                                thisEl.find('.user-confirm').removeClass('disable');
                            }

                            if(thisEl.hasClass('question3')){
                                if(selected.find('.omit89').length > 0){
                                    $('.question8').addClass('omit').hide();
                                    $('.question9').addClass('omit').hide();
                                }else{
                                    $('.question8').removeClass('omit').show();
                                    $('.question9').removeClass('omit').show();
                                }
                            }

                            if(thisEl.hasClass('question15')){
                                $('.Q15').hide().addClass('omit');
                                $('.Q21').hide().addClass('omit');
                                if(selected.hasClass('OP15A')){
                                    $('.Q15A').not('.Q21').show().removeClass('omit');
                                }
                                if(selected.hasClass('OP15B')){
                                    $('.Q15B').show().removeClass('omit');
                                }
                                if(selected.hasClass('OP15C')){
                                    $('.Q15C').show().removeClass('omit');
                                }
                                if(selected.hasClass('OP15D')){
                                    $('.Q15D').show().removeClass('omit');
                                }
                            }
                            if(thisEl.hasClass('question21')){
                                if(selected.hasClass('OP21A')){
                                    $('.Q21A').show().removeClass('omit');
                                }
                                if(selected.hasClass('OP21B')){
                                    $('.Q21B').show().removeClass('omit');
                                }
                                if(selected.hasClass('OP21C')){
                                    $('.Q21C').show().removeClass('omit');
                                }
                            }
                            maxWrapperLi = thisEl;
                        }
                    });
                    
                    // next question
                    if(maxWrapperLi){
                        var nextActive = maxWrapperLi.next();
                        while((nextActive && nextActive.hasClass('omit')) || nextActive.hasClass('js-answered')){
                            nextActive = nextActive.next();
                        };
                        nextActive.find('.option-list-title').addClass('active')
                            .css('background', '#' + color[nextActive.attr('data-id')][0])
                            .find('.text-vcenter').addClass('underline');

                        // complete button
                        if(nextActive.hasClass('complete')){
                            nextActive.addClass('active')
                                .find('.text-vcenter').addClass('underline');
                        }
                    }else{
                        // just keep the name and account
                        poll['user-name'] = ['姓名', uname];
                        poll['user-account'] = ['Nike账号', uaccount];
                        localStorage.setItem('nike', JSON.stringify(poll));
                        // dom prepare
                        $('.option-list-title').first().addClass('active')
                                .find('.text-vcenter').first().addClass('underline');
                    }                   

                }else{
                    // just keep the name and account
                    poll['user-name'] = ['姓名', uname];
                    poll['user-account'] = ['Nike账号', uaccount];
                    localStorage.setItem('nike', JSON.stringify(poll));
                    // dom prepare
                    $('.option-list-title').first().addClass('active')
                            .find('.text-vcenter').first().addClass('underline');
                }
                afterFirstTap();
            });            
        }
    }      
});


function afterFirstTap() {
    var scroll = 0;
    // dom prepare
    $('.option-ul li').prepend('<div class="lineTop"></div>')
        .append('<div class="lineBottom"></div>');
    // question tap
    $('.active').hammer().bind("tap", unfold);

    // tap option and show tick
    function optionTap() {
        var wrapperLi = $(this).parents('.wrapper-li');
        var img = $(this).find('img');
        var userConfirm = wrapperLi.find('.user-confirm');
        var otherInput = $(this).find('.other-input');
        var confirmButton = wrapperLi.find('.user-other-confirm');

        if($(this).hasClass('js-single')){
            // hide all
            wrapperLi.find('img').hide();
            // show clicked
            img.fadeIn('fast');
            fold.apply(this);
            wrapperLi.addClass('js-answered');
            wrapperLi.find('.back-tip').addClass('disable');
            // wrapperLi.find('input').blur();
        }
        if($(this).hasClass('js-mutiple')){
            // use count to trigger able or disable
            if(wrapperLi.attr('data-tap-count') === undefined ){
                wrapperLi.attr('data-tap-count', 0);
            }
            if(img.css("display") === 'none'){
                img.fadeIn('fast');
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 0 + 1);
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 1);
            }
            mutipleAble();
        }
        if($(this).hasClass('js-mutiple2')){
            if(wrapperLi.attr('data-tap-count') === undefined ){
                wrapperLi.attr('data-tap-count', 0);
            }
            if(img.css("display") === 'none'){
                if(wrapperLi.attr('data-tap-count') < 2){
                    img.fadeIn('fast');
                    wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 0 + 1);
                    if(wrapperLi.attr('data-tap-count') == 2 ){
                        fold.apply(this);
                    }
                }
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 1);
            }
            mutipleAble();
        }
        if($(this).hasClass('js-mutiple3')){
            if(wrapperLi.attr('data-tap-count') === undefined ){
                wrapperLi.attr('data-tap-count', 0);
            }
            if(img.css("display") === 'none'){
                if(wrapperLi.attr('data-tap-count') < 3){
                    img.fadeIn('fast');
                    wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 0 + 1);
                    if(wrapperLi.attr('data-tap-count') == 3 ){
                        fold.apply(this);
                    }
                }
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 1);
            }
            mutipleAble();
        }
        function mutipleAble() {  
            if(userConfirm.length > 0){
                if(wrapperLi.attr('data-tap-count') == 0){
                    userConfirm.hammer().unbind("tap");
                    wrapperLi.find('.user-confirm').addClass('disable');
                }
                if(wrapperLi.attr('data-tap-count') > 0){
                    userConfirm.hammer().unbind('tap').bind("tap", fold);
                    userConfirm.removeClass('disable');
                }
            }     
        }

        // other-input
        if($(this).hasClass('js-other')){
            if(otherInput.val() === ''){
                confirmButton.addClass('disable')
                    .hammer().unbind('tap');
                wrapperLi.removeClass('js-answered');
            }else{
                confirmButton.removeClass('disable')
                        .hammer().unbind('tap').bind("tap", fold);
                    wrapperLi.addClass('js-answered');
            }
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
            wrapperLi.find('img').hide();
            img.fadeIn('fast',function () {
                // otherInput.focus();
            });
        }
        if($(this).hasClass('js-other-mutiple')){
            if(otherInput.length > 0){
                wrapperLi.keyup(function(event) {
                    if(otherInput.val() !== ''){
                        confirmButton.removeClass('disable')
                            .hammer().unbind('tap').bind("tap", fold);
                        wrapperLi.addClass('js-answered');
                    }else{
                        if(wrapperLi.find('img:visible').length < 2){
                            confirmButton.addClass('disable')
                                .hammer().unbind('tap');
                            wrapperLi.removeClass('js-answered');
                        }                        
                    }
                });
            }
            if(wrapperLi.attr('data-tap-count') === undefined ){
                wrapperLi.attr('data-tap-count', 0);
            }
            if(img.css("display") === 'none'){
                img.fadeIn('fast',function () {
                    // otherInput.focus();
                });
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 0 + 1);
            }else{
                img.fadeOut('fast');
                wrapperLi.attr('data-tap-count', wrapperLi.attr('data-tap-count') - 1);
            }
            if(userConfirm.length > 0){
                if(wrapperLi.attr('data-tap-count') == 0 && otherInput.val() === ''){
                    userConfirm.hammer().unbind("tap");
                    userConfirm.addClass('disable');
                }
                if(wrapperLi.attr('data-tap-count') > 0 && otherInput.val() !== ''){
                    userConfirm.hammer().unbind('tap').bind("tap", fold);
                    userConfirm.removeClass('disable');
                }
            }
        }

        // hurt
        if($(this).hasClass('js-hurt')){
            $(this).find('.hurt-mask').hide();
            $(this).find('.hurt-ul').css('visibility', 'visible');
            $(this).hammer().unbind('tap');
        }

        //  reset all following selected questions
        if(wrapperLi.hasClass('question3') || wrapperLi.hasClass('question15') || wrapperLi.hasClass('question21')){
            var selectText = $(this).text().trim();
            if(selectText !== (poll['question21 Q15 Q15A'] && poll['question21 Q15 Q15A'][1])
                && selectText !== (poll['question3'] && poll['question3'][1])
                && selectText !== (poll['question15'] && poll['question15'][1])){
                    var selectedLi = wrapperLi.nextAll('.wrapper-li');
                    selectedLi.removeClass('js-answered')
                        .attr('data-tap-count', 0)
                        .find('img').hide()
                        .end().find('input').val('')
                        .end().find('.option-list-title').removeClass('active')
                            .css('background', '')
                        .find('.text-vcenter').removeClass('underline');
                    selectedLi.each(function(index, el) {
                        var elClass = $(el).attr('class').replace(/js-answered/,'')
                                    .replace(/omit/,'')
                                    .replace(/wrapper-li/,'')
                                    .replace(/full/,'')
                                    .trim();
                        poll[elClass] = undefined;
                    });
            }
        }
    };

    function unfold() {
        if(!$(this).hasClass('active')){
            return false;
        }
        var wrapperLi = $(this).parents('.wrapper-li');
        var temp = $(this);
        var backTip = wrapperLi.find('.back-tip');
        scroll = $('body').scrollTop();

        wrapperLi.find('.option-ul').children('.option-item').each(function(index, el) {
            $(el).css('background', '#' + color[wrapperLi.attr('data-id')][index + 1] );
        });
        $('.survey-question').addClass('full');
        wrapperLi.addClass('full').height('atuo')
            .find('.option-ul').addClass('flex')
            .end().find('.option-item').hammer().unbind('tap').bind("tap", optionTap);

        backTip.show();
        if(!backTip.hasClass('disable')){
            backTip.hammer().unbind('tap').bind("tap", fold);
        }

         wrapperLi.nextAll().hide()
            .end().prevAll().hide();

        temp.hammer().unbind("tap")
            .transition({ height: '24%' }, 666)
            .nextAll('.option-item').each(function(index, el) {
                setTimeout(function () {
                    $(el).show().transition({ y: 0 }, 888, 'ease');
                }, index * 50);
            });
    };
    function fold() {
        var self = this;
        var temp = [];
        var count = 0;
        var wrapperLi = $(this).parents('.wrapper-li');        
        var tickStaytime = 444;
        var index = $('.wrapper-li:not(.omit)').index(wrapperLi);

        if ($(this).hasClass('user-confirm')) {
            tickStaytime = 10;
        }
        while(temp.length == 0 && count < 6){
            switch(count){
                case 0:temp = $(this).closest('.option-list-title');break;
                case 1:temp = $(this).siblings('.option-list-title');break;
                case 2:temp = $(this).closest('.option-item').siblings('.option-list-title');break;
                case 3:temp = $(this).closest('.option-hurt').siblings('.option-list-title');break;
            }
            count++;
        };

        wrapperLi.addClass('js-answered');
        $('.survey-question').removeClass('full');
        wrapperLi.find('.option-item').hammer().unbind('tap');

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
            while((nextActive && nextActive.hasClass('omit')) || nextActive.hasClass('js-answered')){
                nextActive = nextActive.next();
            };
            wrapperLi.find('.text-vcenter').removeClass('underline');
            nextActive.find('.option-list-title').addClass('active')
                .css('background', '#' + color[nextActive.attr('data-id')][0])
                .find('.text-vcenter').addClass('underline')
                .end().hammer().unbind("tap").bind("tap", unfold);

            // complete button
            if(nextActive.hasClass('complete')){
                nextActive.addClass('active')
                    .find('.text-vcenter').addClass('underline');
            }

            wrapperLi.find('.option-list-title').hammer().unbind("tap").bind("tap", unfold);

            // if(index > 2 && scroll < 150){
            //     $('body').stop().animate({scrollTop: 3 * 260 + scroll}, '500', 'swing');
            // }
            
            if(index > 2 && index%3 === 0){
                $('body').stop().animate({scrollTop: (index - 1) * 260 }, '500', 'swing');
            }

            var key = [];
            var wrapperLiClass = wrapperLi.attr('class').replace(/js-answered/,'')
                                        .replace(/omit/,'')
                                        .replace(/wrapper-li/,'')
                                        .trim();
            key.push(wrapperLi.find('.option-list-title span:not(.back-tip)').text());
            wrapperLi.find('.option-item').filter(function(index, el) {
                    return $(el).find('img').css("display") !== 'none';
                }).each(function(index, el) {
                    key.push($(el).find('.text-vcenter').text());
                    if($(el).find('input').val() !== '' && $(el).find('input').val() !== undefined){
                        key.push($(el).find('input').val());
                    }               
            });

            poll[wrapperLiClass] = key;
            localStorage.setItem('nike', JSON.stringify(poll));           

        }, 1200);
    }

    $('.complete').hammer().bind('tap', function(event) {
        if(!$(this).hasClass('active')){
            return false;
        }
        console.log(poll);
        $('.selection').fadeOut('slow');
        $('.end').fadeIn('fast');
        $('.end-text-all').show();
        $.ajax({
            url: '/write', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify(poll)}
        ).success(function () {
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
    question22:['b4cd1f','cedf6e','cbdc62','c3d74c','bcd236 '],
    com:['333333']
}
 




