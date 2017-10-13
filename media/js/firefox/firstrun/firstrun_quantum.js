/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (Mozilla) {
    'use strict';

    var beginAnimation = function () {
        var scene = document.getElementById('scene');
        var skipbutton = document.getElementById('skip-button');
        scene.dataset.animate = 'true'; 

        var hideOrShowSkipButton = function (data) {
            switch(data.data.url) {
            case 'signin':
            case 'signup':
            case 'reset_password':
                skipbutton.disabled = false;
                skipbutton.classList.remove('skipbutton-hidden');
                break;
            default:
                skipbutton.classList.add('skipbutton-hidden');
                break;
            }
        };

        var disableSkipButton = function () {
            skipbutton.disabled = true;
        };

        var onVerificationComplete = function () {
            scene.dataset.signIn = 'true';
            document.getElementById('background').addEventListener('transitionend', function(event) {
                if (event.propertyName === 'opacity') {
                    window.location.href = 'about:home';
                }
            }, false);
        };

        skipbutton.onclick = onVerificationComplete;

        Mozilla.Client.getFirefoxDetails(function(data) {
            Mozilla.FxaIframe.init({
                distribution: data.distribution,
                gaEventName: 'firstrun-fxa',
                onVerificationComplete: onVerificationComplete,
                onLogin: onVerificationComplete,
                onFormEnabled: disableSkipButton,
                onNavigated: hideOrShowSkipButton
            });
        });
    };

    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            window.setTimeout(function () {
                beginAnimation();
            }, 800);
        }
    };

})(window.Mozilla);
