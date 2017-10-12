/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (Mozilla, Waypoint) {
    'use strict';

    var client = Mozilla.Client;
    var featureWaypoints = [];
    var nav;
    var videos;

    // Basic feature detect for JS support.
    function cutsTheMustard() {
        return 'querySelector' in document &&
                'querySelectorAll' in document &&
                'addEventListener' in window &&
                'classList' in document.createElement('div') &&
                typeof window.matchMedia !== 'undefined' &&
                typeof HTMLMediaElement !== 'undefined';
    }

    // Returns an elements position offset from the top of the page.
    function findPosition(obj) {
        var top = 0;
        do {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        } while (obj);

        return top;
    }

    function scrollToFeature(e) {
        e.preventDefault();
        var targetName = e.target.getAttribute('href').replace(/#/, '');
        var targetElem = document.getElementById(targetName);

        if (targetElem) {
            Mozilla.smoothScroll({
                top: findPosition(targetElem)
            });
        }
    }

    function setActiveFeature(id) {
        var currentElem = document.querySelector('.features-scroller-nav a.current');
        var el = document.querySelector('.features-scroller-nav a[href="#' + id + '"]');

        if (currentElem) {
            currentElem.classList.remove('current');
        }

        if (el) {
            el.classList.add('current');

            //data-current attribute provides a styling hook for the CSS faux scroll bar.
            nav.setAttribute('data-current', id);
        }
    }

    function playVideo(el) {
        var video = el.querySelector('video');

        // Only try and auto play video on desktop.
        if (!client.isDesktop) {
            return;
        }

        try {
            if (video && video.readyState && video.readyState > 0) {
                video.currentTime = 0;
                video.play();
            }
        } catch(e) {
            // fail silently.
        }
    }

    function pauseVideo(el) {
        var video = el.querySelector('video');

        // Only try and auto play video on desktop.
        if (!client.isDesktop) {
            return;
        }

        try {
            video.pause();
        } catch(e) {
            // fail silently.
        }
    }

    function scrollToPrevFeature() {
        var currentElem = document.querySelector('.features-scroller-nav a.current');

        if (currentElem) {
            var prevElem = currentElem.parentNode.previousElementSibling;

            if (prevElem) {
                prevElem.firstChild.click();
            }
        }
    }

    function scrollToNextFeature() {
        var currentElem = document.querySelector('.features-scroller-nav a.current');

        if (currentElem) {
            var nextElem = currentElem.parentNode.nextElementSibling;

            if (nextElem) {
                nextElem.firstChild.click();
            }
        }
    }

    function initNavigation() {
        var navLinks = document.querySelectorAll('.features-scroller-nav a');
        var prevButton = document.querySelector('.features-scroller-nav .previous');
        var nextButton = document.querySelector('.features-scroller-nav .next');

        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', scrollToFeature, false);
        }

        prevButton.addEventListener('click', scrollToPrevFeature, false);
        nextButton.addEventListener('click', scrollToNextFeature, false);
    }

    function initWaypoints() {
        var features = document.querySelectorAll('.features-scroller-content > .feature-content');

        for (var i = 0; i < features.length; i++) {
            featureWaypoints.push(new Waypoint({
                element: features[i],
                handler: function(direction) {
                    if (direction === 'down') {
                        setActiveFeature(this.element.id);
                        playVideo(this.element);
                    } else {
                        pauseVideo(this.element);
                    }
                },
                offset: '50%'
            }));

            featureWaypoints.push(new Waypoint({
                element: features[i],
                handler: function(direction) {
                    if (direction === 'up') {
                        setActiveFeature(this.element.id);
                        playVideo(this.element);
                    } else {
                        pauseVideo(this.element);
                    }
                },
                offset: '-50%'
            }));
        }
    }

    function destroyWaypoints() {
        if (featureWaypoints.length > 0) {
            featureWaypoints.forEach(function(waypoint) {
                waypoint.destroy();
            });
            featureWaypoints = [];
        }
    }

    function setVideoAttributes() {
        // Only remove video controls on desktop.
        if (!client.isDesktop) {
            return;
        }

        // remove standard controls and set each video to loop.
        for (var i = 0; i < videos.length; i++) {
            videos[i].removeAttribute('controls');
            videos[i].setAttribute('loop', '');
        }
    }

    function unsetVideoAttributes() {
        // Only remove video controls on desktop.
        if (!client.isDesktop) {
            return;
        }

        // reinstate videos to use standard controls.
        for (var i = 0; i < videos.length; i++) {
            videos[i].setAttribute('controls', '');
            videos[i].removeAttribute('loop');
        }
    }

    function initMediaQueries() {
        var desktopWidth;

        desktopWidth = matchMedia('(min-width: 1000px)');

        if (desktopWidth.matches) {
            setVideoAttributes();
            initWaypoints();
        }

        desktopWidth.addListener(function(mq) {
            if (mq.matches) {
                setVideoAttributes();
                initWaypoints();
            } else {
                destroyWaypoints();
                unsetVideoAttributes();
            }
        });
    }

    if (cutsTheMustard()) {
        nav = document.querySelector('.features-scroller-nav');
        videos = document.querySelectorAll('.feature-content video');

        initMediaQueries();
        initNavigation();
    }

})(window.Mozilla, window.Waypoint);
