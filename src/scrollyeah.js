(function($){
  /*!
   * Bez v1.0.10-g5ae0136
   * http://github.com/rdallasgray/bez
   *
   * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
   *
   * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
   * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
   *
   * Copyright 2011 Robert Dallas Gray. All rights reserved.
   * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
   */
  $.extend({bez:function(a){var b="bez_"+$.makeArray(arguments).join("_").replace(".","p");if(typeof $.easing[b]!="function"){var c=function(a,b){var c=[null,null],d=[null,null],e=[null,null],f=function(f,g){return e[g]=3*a[g],d[g]=3*(b[g]-a[g])-e[g],c[g]=1-e[g]-d[g],f*(e[g]+f*(d[g]+f*c[g]))},g=function(a){return e[0]+a*(2*d[0]+3*c[0]*a)},h=function(a){var b=a,c=0,d;while(++c<14){d=f(b,0)-a;if(Math.abs(d)<.001)break;b-=d/g(b)}return b};return function(a){return f(h(a),1)}};$.easing[b]=function(b,d,e,f,g){return f*c([a[0],a[1]],[a[2],a[3]])(d/g)+e}}return b}});

  /* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
   * Licensed under the MIT License (LICENSE.txt).
   *
   * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
   * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
   * Thanks to: Seamus Leahy for adding deltaX and deltaY
   *
   * Version: 3.0.4
   *
   * Requires: 1.2.2+
   */
  var mousewheel=["DOMMouseScroll","mousewheel"];
  $.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=mousewheel.length;d;){this.addEventListener(mousewheel[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=mousewheel.length;d;){this.removeEventListener(mousewheel[--d],b,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(i){var g=i||window.event,f=[].slice.call(arguments,1),j=0,h=true,e=0,d=0;i=$.event.fix(g);i.type="mousewheel";if(i.wheelDelta){j=i.wheelDelta/120}if(i.detail){j=-i.detail/3}d=j;if(g.axis!==undefined&&g.axis===g.HORIZONTAL_AXIS){d=0;e=-1*j}if(g.wheelDeltaY!==undefined){d=g.wheelDeltaY/120}if(g.wheelDeltaX!==undefined){e=-1*g.wheelDeltaX/120}f.unshift(i,j,e,d);return $.event.dispatch.apply(this,f)};


  var touchFLAG = ('ontouchstart' in document);
  var o__dragTimeout = 300;
  var o__bez = $.bez([.1,0,.25,1]);
  var o__transitionDuration = 333;

  var $window = $(window);
  var $document = $(document);

  var _options = [
    ['maxWidth', 'number', 999999],
    ['shadows', 'boolean', true],
    ['disableIfFit', 'boolean', true],
    ['centerIfFit', 'boolean', false],
    ['triggerScrollyeah', 'boolean', false]
  ];

  function collectOptions(block) {
    var options = {};
    for (var _i = 0; _i < _options.length; _i++) {
      var name = _options[_i][0];
      var type = _options[_i][1];
      if (block) {
        var attr = block.attr('data-'+name);
        if (attr) {
          if (type == 'number') {
            attr = Number(attr);
            if (!isNaN(attr)) {
              options[name] = attr;
            }
          } else if (type == 'boolean') {
            if (attr == 'true') {
              options[name] = true;
            } else if (attr = 'false') {
              options[name] = false;
            }
          } else if (type == 'string') {
            options[name] = attr;
          }
        }
      } else {
        options[name] = _options[_i][2];
      }
    }
    return options;
  }

  $.fn.scrollyeah = function(options) {
    if (typeof(scrollyeahDefaults) == 'undefined') {
      scrollyeahDefaults = {};
    }

    var o = $.extend(collectOptions(), $.extend({}, scrollyeahDefaults, options));

    this.each(function(){
      var scrollyeah = $(this);
      if (!scrollyeah.data('ini')) {
        doScrollyeah(scrollyeah, o);
      }
    });

    //Chainability
    return this;
  }

  $(function(){
    // Авто-инициализация по классу.
    $('.scrollyeah').each(function(){
      var $this = $(this);
      $this.scrollyeah(collectOptions($this));
    });
  });

  var _prefix = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

  function getCSS(prop, val) {
    var obj = {};
    for (var _i = 0; _i < _prefix.length; _i++) {
      obj[_prefix[_i]+prop] = val;
    }
    return obj;
  }

  function getTranslate(pos) {
    return {left: pos};
  }

  function getDuration(time) {
    return getCSS('transition-duration', time+'ms');
  }

  function doScrollyeah(scrollyeah, o) {
    scrollyeah
        .data({ini: true})
      //.css({padding: o.verticalPadding + 'px 0'})
        .wrapInner('<div class="scrollyeah__wrap"><div class="scrollyeah__shaft"></div></div>');

    var wrap = $('.scrollyeah__wrap', scrollyeah).css({width: o.maxWidth});
    var shaft = $('.scrollyeah__shaft', scrollyeah);

    if (o.shadows) {
      var shadow = $('<i class="scrollyeah__shadow scrollyeah__shadow_prev"></i><i class="scrollyeah__shadow scrollyeah__shadow_next"></i>').appendTo(scrollyeah);
    }
    var shaftWidth, scrollyeahWidth, scrollyeahHeight, shaftMaxPos, shaftMinPos, shaftPos = 0, shaftPosShift, shaftOverPosShift;

    var scrollFLAG = true;

    var parallax = $('.scrollyeah__parallax', shaft);
    var disable = $('.scrollyeah__disable', shaft);
    //shaft.data({extra: extra});

    parallax.each(function(){
      var $this = $(this);
      var parallax = Number($this.attr('data-parallaxRate'));
      $this.data({parallax: parallax});
    });

    function getParallaxPos(pos, block) {
      var center = shaftMaxPos - (shaftMaxPos - shaftMinPos)/2;
      return ((pos - center) * block.data('parallax'));
    }

    function preventClick(e) {
      return false;
    }

    function clearBackAnimate(block) {
      clearTimeout(block.data('backAnimate'));
    }

    var animateInterval, clearAnimateInterval;

    function animate(block, pos, time, overPos, extra) {
      var POS = isNaN(pos) ? 0 : pos;
      clearBackAnimate(block);
      if (overPos) {
        POS = overPos;
        block.data({
          backAnimate: setTimeout(function(){
            animate(block, pos, Math.max(o__transitionDuration, time/2), false, extra);
          }, time)
        });
      }

      block.stop().animate(getTranslate(POS), time, o__bez);

      if (!extra && o.triggerScrollyeah) {
        clearInterval(animateInterval);
        animateInterval = setInterval(function(){
          scrollyeah.trigger('scrollyeah', shaft.position()[_pos]);
        }, 25);
        clearTimeout(clearAnimateInterval);
        clearAnimateInterval = setTimeout(function(){
          clearInterval(animateInterval);
        }, time + 100);
      }


    }

    function setPos(pos, block, extra) {
      clearBackAnimate(block);

      block.stop();
      if (pos === false) {
        pos = block.position()[_pos];
      }
      block.css(getTranslate(pos));
      if (!extra) {
        shaftPos = pos;
        if (o.triggerScrollyeah) {
          scrollyeah.trigger('scrollyeah', shaftPos);
        }
        return shaftPos;
      }
    }

    function setTouchAndShadow(pos) {
      if (shaftWidth > scrollyeahWidth) {
        scrollFLAG = true;
        //if (!o.disableIfFit) {
        scrollyeah.addClass('scrollyeah_active');
        //}
        if (o.shadows) {
          scrollyeah.addClass('scrollyeah_shadow');

          if (pos <= shaftMinPos) {
            scrollyeah.removeClass('scrollyeah_shadow_no-left').addClass('scrollyeah_shadow_no-right');
          } else if (pos >= shaftMaxPos) {
            scrollyeah.removeClass('scrollyeah_shadow_no-right').addClass('scrollyeah_shadow_no-left');
          } else {
            scrollyeah.removeClass('scrollyeah_shadow_no-left scrollyeah_shadow_no-right');
          }
        }
      } else {
        if (o.disableIfFit) {
          scrollFLAG = false;
          scrollyeah.removeClass('scrollyeah_active');
        } else {
          scrollFLAG = true;
          scrollyeah.addClass('scrollyeah_active');
        }
        if (o.shadows) {
          scrollyeah.removeClass('scrollyeah_shadow');
        }
      }
    }

    function onResize() {
      shaftWidth = shaft.width();
      scrollyeahWidth = scrollyeah.width();
      scrollyeahHeight = scrollyeah.height();
      if (!o.centerIfFit) {
        shaftMaxPos = 0;
      } else {
        shaftMaxPos = Math.max((scrollyeahWidth - shaftWidth)/2, 0);
      }
      //console.log('shaftMaxPos', shaftMaxPos);
      shaftMinPos = Math.min(-(shaftWidth - scrollyeahWidth), shaftMaxPos);

      //console.log('shaftMinPos', shaftMinPos);
      shaft.data({maxPos: shaftMaxPos, minPos: shaftMinPos});

//      if (o.shadows) {
//        shadow.css({height: scrollyeahHeight + o.verticalPadding*2 - o.shadowSize*2});
//      }


      if (shaftPos < shaftMinPos) {
        setPos(shaftMinPos, shaft);
      }
      if (shaftPos > shaftMaxPos) {
        setPos(shaftMaxPos, shaft);
      }

      parallax.each(function(){
        var $this = $(this);
        setPos(getParallaxPos(shaftPos, $this), $this, true);
      });
      setTouchAndShadow(shaftPos);
    }

    onResize();

    $window.bind('resize load', onResize);
    if (touchFLAG) {
      window.addEventListener('orientationchange', onResize, false);
    }

    var shaftGrabbingFLAG, setShaftGrabbingFLAGTimeout;

    var _pos = 'left',
        _coo = 'pageX',
        _coo2 = 'pageY';

    function touch(mouseDown, mouseMove, mouseUp) {
      var coo,
          coo2,
          downPos,
          downPos2,
          downElPos,
          downTime,
          moveCoo = [],
          moveTime,
          directionLast,
          upTime,
          upTimeLast = 0;

      var movableFLAG = false;
      var checkedDirectionFLAG = false;
      var limitFLAG = false;
      function onMouseDown(e) {
        if ((touchFLAG || e.which < 2) && scrollFLAG) {
          function act() {

            downTime = new Date().getTime();
            downPos = coo;
            downPos2 = coo2;
            moveCoo = [[downTime, coo]];

            downElPos = setPos(false, shaft);
            parallax.each(function(){
              var $this = $(this);
              setPos(getParallaxPos(shaftPos, $this), $this, true);
            });

            mouseDown();
          }
          if (!touchFLAG) {
            coo = e[_coo];
            e.preventDefault();
            act();
            $document.bind('mousemove.scrollyeah', onMouseMove);
            $document.bind('mouseup.scrollyeah', onMouseUp);
          } else if (touchFLAG && e.targetTouches.length == 1) {
            coo = e.targetTouches[0][_coo];
            coo2 = e.targetTouches[0][_coo2];
            act();
            shaft[0].addEventListener('touchmove', onMouseMove, false);
            shaft[0].addEventListener('touchend', onMouseUp, false);
          } else if (touchFLAG && e.targetTouches.length > 1) {
            return false;
          }
        }
      }

      var setMouseWheelFLAGTimeout, mouseWheelFLAG;

      function onMouseWheel(event, delta, deltaX, deltaY) {
        //console.log(deltaX, deltaY);
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          event.preventDefault();
          clearTimeout(setMouseWheelFLAGTimeout);
          if (!mouseWheelFLAG) {
            setPos(false, shaft);
            parallax.each(function(){
              var $this = $(this);
              setPos(getParallaxPos(shaftPos, $this), $this, true);
            });

            mouseWheelFLAG = true;
          }

          setMouseWheelFLAGTimeout = setTimeout(function(){
            mouseWheelFLAG = false;
          }, 100);

          shaftPos = shaftPos - Math.round(deltaX*25);

          if (shaftPos < shaftMinPos) shaftPos = shaftMinPos;
          if (shaftPos > shaftMaxPos) shaftPos = shaftMaxPos;

          shaft.css(getTranslate(shaftPos));
          if (o.triggerScrollyeah) {
            scrollyeah.trigger('scrollyeah', shaftPos);
          }

          parallax.each(function(){
            var $this = $(this);
            $this.css(getTranslate(getParallaxPos(shaftPos, $this)));
          });

          setTouchAndShadow(shaftPos);

          return false;
        }
      }

      function onMouseMove(e) {
        function act() {
          e.preventDefault();

          moveTime = new Date().getTime();
          moveCoo.push([moveTime, coo]);

          var pos = downPos - coo;
          shaftPos = downElPos-pos;

          if (shaftPos > shaftMaxPos) {
            shaftPos = Math.round(shaftPos + ((shaftMaxPos - shaftPos)/ 1.5));
            limitFLAG = 'left';

          } else if (shaftPos < shaftMinPos) {
            shaftPos = Math.round(shaftPos + ((shaftMinPos - shaftPos) / 1.5));
            limitFLAG = 'right';
          } else {
            limitFLAG = false;
          }

          shaft.css(getTranslate(shaftPos));
          if (o.triggerScrollyeah) {
            scrollyeah.trigger('scrollyeah', shaftPos);
          }

          parallax.each(function(){
            var $this = $(this);
            $this.css(getTranslate(getParallaxPos(shaftPos, $this)));
          });

          mouseMove(shaftPos, pos, limitFLAG);
        }
        if (!touchFLAG) {
          coo = e[_coo];
          act();
        } else if (touchFLAG && e.targetTouches.length == 1) {
          coo = e.targetTouches[0][_coo];
          coo2 = e.targetTouches[0][_coo2];

          if (!checkedDirectionFLAG) {
            if (Math.abs(coo-downPos) - Math.abs(coo2-downPos2) >= -5) {
              movableFLAG = true;
              e.preventDefault();
            }
            checkedDirectionFLAG = true;
          } else if (movableFLAG) {
            act();
          }
        }
      }

      function onMouseUp(e) {
        if (!touchFLAG || !e.targetTouches.length) {
          movableFLAG = false;
          checkedDirectionFLAG = false;

          if (!touchFLAG) {
            $document.unbind('mouseup.scrollyeah', onMouseUp);
            $document.unbind('mousemove.scrollyeah', onMouseMove);
          } else {
            shaft[0].removeEventListener('touchmove', onMouseMove, false);
            shaft[0].removeEventListener('touchend', onMouseUp, false);
          }

          upTime = new Date().getTime();
          var dirtyLeft = -shaftPos;

          var _backTimeIdeal = upTime - o__dragTimeout;
          var _diff, _diffMin, backTime, backCoo;
          for (i=0;i<moveCoo.length;i++) {
            _diff = Math.abs(_backTimeIdeal - moveCoo[i][0]);

            if (i == 0) {
              _diffMin = _diff;
              backTime = upTime - moveCoo[i][0];
              backCoo = moveCoo[i][1];
            }
            if (_diff <= _diffMin) {
              _diffMin = _diff;
              backTime = moveCoo[i][0];
              backCoo = moveCoo[i][1];
            }
          }

          var posDiff = backCoo - coo;
          var direction = posDiff >= 0;
          var timeDiff = upTime - backTime;
          var isSwipe = timeDiff <= o__dragTimeout;
          var timeFromLast = upTime - upTimeLast;
          var sameDirection = direction === directionLast;

          mouseUp(dirtyLeft, timeDiff, isSwipe, timeFromLast, sameDirection, posDiff, e);

          upTimeLast = upTime;
          directionLast = direction;
        }
      }

      if (!touchFLAG) {
        shaft
            .mousedown(onMouseDown)
            .mousewheel(onMouseWheel)
      } else {
        shaft[0].addEventListener('touchstart', onMouseDown, false);
      }
    }


    var clickPreventedFLAG = false;

    function shaftOnMouseDown() {}
    function shaftOnMouseMove(pos, posDiff) {
      clearTimeout(setShaftGrabbingFLAGTimeout);
      if (!shaftGrabbingFLAG) {
        shaftGrabbingFLAG = true;
        shaft.addClass('scrollyeah__shaft_grabbing');
      }

      if (Math.abs(posDiff) >= 5 && !clickPreventedFLAG) {
        // Отменяем клик по ссылкам!
        clickPreventedFLAG = true;
        $('a', scrollyeah).bind('click', preventClick);
      }

      setTouchAndShadow(pos);
    }
    function shaftOnMouseUp(dirtyLeft, timeDiff, isSwipe, timeFromLast, sameDirection, posDiff, e) {
      setShaftGrabbingFLAGTimeout = setTimeout(function() {
        // Разрешаем клик по ссылкам!
        clickPreventedFLAG = false;
        $('a', scrollyeah).unbind('click', preventClick);
      }, o__dragTimeout);

      shaftGrabbingFLAG = false;
      shaft.removeClass('scrollyeah__shaft_grabbing');

      dirtyLeft = -dirtyLeft;

      var newPos = dirtyLeft;
      var overPos;
      var time = o__transitionDuration*2;

      if (dirtyLeft > shaftMaxPos) {
        newPos = shaftMaxPos;
        time = time/2;
      } else if (dirtyLeft < shaftMinPos) {
        newPos = shaftMinPos;
        time = time/2;
      } else {
        if (isSwipe) {
          posDiff = -posDiff;
          var speed = posDiff/timeDiff;
          newPos = Math.round(dirtyLeft + speed*250);
          var outFactor = .04;
          if (newPos > shaftMaxPos) {
            overPos = Math.abs(newPos - shaftMaxPos);
            time = Math.abs(time/((speed*250)/(Math.abs(speed*250) - overPos*(1-outFactor))));
            newPos = shaftMaxPos;
            overPos = newPos + overPos*outFactor;
          } else if (newPos < shaftMinPos) {
            overPos = Math.abs(newPos - shaftMinPos);
            time = Math.abs(time/((speed*250)/(Math.abs(speed*250) - overPos*(1-outFactor))));
            newPos = shaftMinPos;
            overPos = newPos - overPos*outFactor;
          }
        }
      }

      shaftPos = newPos;

      if (newPos != dirtyLeft) {
        animate(shaft, newPos, time, overPos, false);
        parallax.each(function(){
          var $this = $(this);
          animate($this, getParallaxPos(newPos, $this), time, getParallaxPos(overPos, $this), true);
        });
        setTouchAndShadow(newPos);
      }
    }

    touch(shaftOnMouseDown, shaftOnMouseMove, shaftOnMouseUp);

    disable.bind('click mousedown mouseup mousemove', function(e){
      e.stopPropagation();
    }).css({
          '-webkit-user-select': 'auto',
          '-moz-user-select': 'auto',
          '-o-user-select': 'auto',
          '-ms-user-select': 'auto',
          'user-select': 'auto',
          cursor: 'auto'
        });

  }
})(jQuery);

