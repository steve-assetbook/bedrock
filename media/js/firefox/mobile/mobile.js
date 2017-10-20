(function(Mozilla, $) {
    'use strict';

    var $body = $('body');
    var $mobileDownloadButtons = $('.mobile-download-buttons').remove();
    var $modalOuterWrapper = $('#modal-outer-wrapper');
    var $modalContents = $('#modal-wrapper');

    // anchor 'See more' links should smooth scroll
    $('.see-more').on('click', function(e) {
        e.preventDefault();

        var offset = $(e.target.getAttribute('href')).offset().top;

        Mozilla.smoothScroll({
            top: offset
        });
    });

    // move app store badges inside modal
    $('#modal-mobile-download-buttons-wrapper').append($mobileDownloadButtons);

    // links become buttons
    $('.get-product-link').attr('role', 'button')

    // clicking any download-looking button opens the modal
    $('.get-firefox, .get-focus').on('click', openModal);

    // add class to widget button here to avoid messing with macro markup
    $('#send-to-device button[type="submit"]').addClass('quantum-hollow');

    function openModal(e) {
        e.preventDefault();

        var product = $(this).data('product');

        var selectorToHide = (product === 'firefox') ? '.focus' : '.firefox';
        var selectorToShow = (product === 'firefox') ? '.firefox' : '.focus';

        // contorl styling of modal: blue for firefox, purple for focus
        $body.attr('data-modal-product', product);

        $modalContents.find(selectorToHide).addClass('hidden');
        $modalContents.find(selectorToShow).removeClass('hidden');

        Mozilla.Modal.createModal(this, $modalContents, {
            title: ''
        });
    }

    // initialize send to device widget
    var form = new Mozilla.SendToDevice();

    form.init();
})(window.Mozilla, window.jQuery);
