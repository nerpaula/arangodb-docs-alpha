var theme = true;
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if( isIE ){
    // we don't support sidebar flyout in IE
    document.querySelector( 'body' ).classList.remove( 'mobile-support' );
}
else{
    document.querySelector( 'body' ).classList.add( 'mobile-support' );
}
var isPrint = document.querySelector( 'body' ).classList.contains( 'print' );

var touchsupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)

var formelements = 'button, datalist, fieldset, input, label, legend, meter, optgroup, option, output, progress, select, textarea';

// rapidoc: #280 disable broad document syntax highlightning
window.Prism = window.Prism || {};
Prism.manual = true;

// PerfectScrollbar
var psc;
var psm;
var pst;

function scrollbarWidth(){
    // https://davidwalsh.name/detect-scrollbar-width
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);
    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    // Delete the DIV
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}



function switchTab(tabGroup, tabId) {
    var tabs = jQuery(".tab-panel").has("[data-tab-group='"+tabGroup+"'][data-tab-item='"+tabId+"']");
    var allTabItems = tabs.find("[data-tab-group='"+tabGroup+"']");
    var targetTabItems = tabs.find("[data-tab-group='"+tabGroup+"'][data-tab-item='"+tabId+"']");

    // if event is undefined then switchTab was called from restoreTabSelection
    // so it's not a button event and we don't need to safe the selction or
    // prevent page jump
    var isButtonEvent = event != undefined;

    if(isButtonEvent){
      // save button position relative to viewport
      var yposButton = event.target.getBoundingClientRect().top;
    }

    allTabItems.removeClass("active");
    targetTabItems.addClass("active");

    if(isButtonEvent){
      // reset screen to the same position relative to clicked button to prevent page jump
      var yposButtonDiff = event.target.getBoundingClientRect().top - yposButton;
      window.scrollTo(window.scrollX, window.scrollY+yposButtonDiff);

      // Store the selection to make it persistent
      if(window.localStorage){
          var selectionsJSON = window.localStorage.getItem(baseUriFull+"tab-selections");
          if(selectionsJSON){
            var tabSelections = JSON.parse(selectionsJSON);
          }else{
            var tabSelections = {};
          }
          tabSelections[tabGroup] = tabId;
          window.localStorage.setItem(baseUriFull+"tab-selections", JSON.stringify(tabSelections));
      }
    }
}

function restoreTabSelections() {
    if(window.localStorage){
        var selectionsJSON = window.localStorage.getItem(baseUriFull+"tab-selections");
        if(selectionsJSON){
          var tabSelections = JSON.parse(selectionsJSON);
        }else{
          var tabSelections = {};
        }
        Object.keys(tabSelections).forEach(function(tabGroup) {
          var tabItem = tabSelections[tabGroup];
          switchTab(tabGroup, tabItem);
        });
    }
}

function initMermaid( update ) {
    // we are either in update or initialization mode;
    // during initialization, we want to edit the DOM;
    // during update we only want to execute if something changed
    var decodeHTML = function( html ){
        var txt = document.createElement( 'textarea' );
        txt.innerHTML = html;
        return txt.value;
    };

    var parseGraph = function( graph ){
        var d = /^\s*(%%\s*\{\s*\w+\s*:([^%]*?)%%\s*\n?)/g;
        var m = d.exec( graph );
        var dir = {};
        var content = graph;
        if( m && m.length == 3 ){
            dir = JSON.parse( '{ "dummy": ' + m[2] ).dummy;
            content = graph.substring( d.lastIndex );
        }
        return { dir: dir, content: content };
    };

    var serializeGraph = function( graph ){
        return '%%{init: ' + JSON.stringify( graph.dir ) + '}%%\n' + graph.content;
    };

    var init_func = function(){
        state.is_initialized = true;
        var is_initialized = false;
        var theme = variants.getColorValue( 'MERMAID-theme' );
        document.querySelectorAll('.mermaid').forEach( function( element ){
            var parse = parseGraph( decodeHTML( element.innerHTML ) );

            if( parse.dir.theme ){
                parse.dir.relearn_user_theme = true;
            }
            if( !parse.dir.relearn_user_theme ){
                parse.dir.theme = theme;
            }
            is_initialized = true;

            var graph = serializeGraph( parse );
            element.innerHTML = graph;
            var new_element = document.createElement( 'div' );
            new_element.classList.add( 'mermaid-container' );
            new_element.innerHTML = '<div class="mermaid-code">' + graph + '</div>' + element.outerHTML;
            element.parentNode.replaceChild( new_element, element );
        });
        return is_initialized;
    }

    var update_func = function(){
        var is_initialized = false;
        var theme = variants.getColorValue( 'MERMAID-theme' );
        document.querySelectorAll( '.mermaid-container' ).forEach( function( e ){
            var element = e.querySelector( '.mermaid' );
            var code = e.querySelector( '.mermaid-code' );
            var parse = parseGraph( decodeHTML( code.innerHTML ) );

            if( parse.dir.relearn_user_theme ){
                return;
            }
            if( parse.dir.theme == theme ){
                return;
            }
            is_initialized = true;

            parse.dir.theme = theme;
            var graph = serializeGraph( parse );
            element.removeAttribute('data-processed');
            element.innerHTML = graph;
            code.innerHTML = graph;
        });
        return is_initialized;
    };

    var state = this;
    if( update && !state.is_initialized ){
        return;
    }
    if( typeof variants == 'undefined' ){
        return;
    }
    if( typeof mermaid == 'undefined' || typeof mermaid.mermaidAPI == 'undefined' ){
        return;
    }

    var is_initialized = ( update ? update_func() : init_func() );
    if( is_initialized ){
        mermaid.init();
        $(".mermaid svg").svgPanZoom({});
    }
}

function initSwagger( update ){
    if( typeof variants == 'undefined' ){
        return;
    }
    var attrs = [
        [ 'bg-color', variants.getColorValue( 'MAIN-BG-color' ) ],
        [ 'mono-font', variants.getColorValue( 'CODE-font' ) ],
        [ 'primary-color', variants.getColorValue( 'TAG-BG-color' ) ],
        [ 'regular-font', variants.getColorValue( 'MAIN-font' ) ],
        [ 'text-color', variants.getColorValue( 'MAIN-TEXT-color' ) ],
        [ 'theme', variants.getColorValue( 'SWAGGER-theme' ) ],
    ];
    document.querySelectorAll( 'rapi-doc' ).forEach( function( e ){
        attrs.forEach( function( attr ){
            e.setAttribute( attr[0], attr[1] );
        });
    });
}

function initAnchorClipboard(){

    $(".anchor").on('mouseleave', function(e) {
        $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
    });

    var clip = new ClipboardJS('.anchor');
    clip.on('success', function(e) {
        e.clearSelection();
        $(e.trigger).attr('aria-label', window.T_Link_copied_to_clipboard).addClass('tooltipped tooltipped-s');
    });
}

function initCodeClipboard(){
    function fallbackMessage(action) {
        var actionMsg = '';
        var actionKey = (action === 'cut' ? 'X' : 'C');

        if (/iPhone|iPad/i.test(navigator.userAgent)) {
            actionMsg = 'No support :(';
        }
        else if (/Mac/i.test(navigator.userAgent)) {
            actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
        }
        else {
            actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
        }

        return actionMsg;
    }

    $('code').each(function() {
        var code = $(this);
        var text = code.text();
        var parent = code.parent();
        var inPre = parent.prop('tagName') == 'PRE';

        if (inPre) {
            var clip = new ClipboardJS('.copy-to-clipboard-button', {
                text: function(trigger) {
                    var text = $(trigger).prev('code').text();
                    // remove a trailing line break, this may most likely
                    // come from the browser / Hugo transformation
                    text = text.replace(/\n$/, '');
                    // removes leading $ signs from text in an assumption
                    // that this has to be the unix prompt marker - weird
                    return text.replace(/^\$\s/gm, '');
                }
            });

            clip.on('success', function(e) {
                e.clearSelection();
                var inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                $(e.trigger).attr('aria-label', window.T_Copied_to_clipboard).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
            });

            clip.on('error', function(e) {
                var inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                $(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                $(document).one('copy', function(){
                    $(e.trigger).attr('aria-label', window.T_Copied_to_clipboard).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                });
            });

            code.addClass('copy-to-clipboard-code');
            if( inPre ){
                parent.addClass( 'copy-to-clipboard' );
            }
            else{
                code.replaceWith($('<span/>', {'class': 'copy-to-clipboard'}).append(code.clone() ));
                code = parent.children('.copy-to-clipboard').last().children('.copy-to-clipboard-code');
            }
            code.after( $('<span>').addClass("copy-to-clipboard-button").attr("title", window.T_Copy_to_clipboard).append("<i class='fas fa-copy'></i>") );
            code.next('.copy-to-clipboard-button').on('mouseleave', function() {
                $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
            });
        }
    });
}

function initArrowNav(){
    if( isPrint ){
        return;
    }

    // button navigation
    jQuery(function() {
        jQuery('a.nav-prev').click(function(){
            location.href = jQuery(this).attr('href');
        });
        jQuery('a.nav-next').click(function() {
            location.href = jQuery(this).attr('href');
        });
    });

    // keyboard navigation
    jQuery(document).keydown(function(e) {
      if(e.which == '37') {
        jQuery('a.nav-prev').click();
      }
      if(e.which == '39') {
        jQuery('a.nav-next').click();
      }
    });

    // avoid keyboard navigation for input fields
    jQuery(formelements).keydown(function (e) {
        if (e.which == '37' || e.which == '39') {
            e.stopPropagation();
        }
    });
}

function initMenuScrollbar(){
    if( isPrint ){
        return;
    }

    var elc = document.querySelector('#page-main');
    var elm = document.querySelector('#sidebar');
    var elt = document.querySelector('#TableOfContents');

    var autofocus = false;
    document.addEventListener('keydown', function(event){
        // for initial keyboard scrolling support, no element
        // may be hovered, but we still want to react on
        // cursor/page up/down. because we can't hack
        // the scrollbars implementation, we try to trick
        // it and give focus to the scrollbar - only
        // to just remove the focus right after scrolling
        // happend
        var c = elc && elc.matches(':hover');
        var m = elm && elm.matches(':hover');
        var t = elt && elt.matches(':hover');
        var f = event.target.matches( formelements );
        if( !c && !m && !t && !f ){
            // only do this hack if none of our scrollbars
            // is hovered
            autofocus = true;
            // if we are showing the sidebar as a flyout we
            // want to scroll the content-wrapper, otherwise we want
            // to scroll the body
            var nt = document.querySelector('body').matches('.toc-flyout');
            var nm = document.querySelector('body').matches('.sidebar-flyout');
            if( nt ){
                pst && pst.scrollbarY.focus();
            }
            else if( nm ){
                psm && psm.scrollbarY.focus();
            }
            else{
                document.querySelector('.container-main').focus();
                psc && psc.scrollbarY.focus();
            }
        }
    });
    // scrollbars will install their own keyboard handlers
    // that need to be executed inbetween our own handlers
    // PSC removed for #242 #243 #244
    // psc = elc && new PerfectScrollbar('.container-main');
    psm = elm && new PerfectScrollbar('#sidebar');
    pst = elt && new PerfectScrollbar('#TableOfContents');
    document.addEventListener('keydown', function(){
        // if we facked initial scrolling, we want to
        // remove the focus to not leave visual markers on
        // the scrollbar
        if( autofocus ){
            psc && psc.scrollbarY.blur();
            psm && psm.scrollbarY.blur();
            pst && pst.scrollbarY.blur();
            autofocus = false;
        }
    });
    // on resize, we have to redraw the scrollbars to let new height
    // affect their size
    window.addEventListener('resize', function(){
        pst && pst.update();
        psm && psm.update();
        psc && psc.update();
    });
    // now that we may have collapsible menus, we need to call a resize
    // for the menu scrollbar if sections are expanded/collapsed
    document.querySelectorAll('#sidebar .collapsible-menu input.toggle').forEach( function(e){
        e.addEventListener('change', function(){
            psm && psm.update();
        });
    });

    // finally, we want to adjust the contents right padding if there is a scrollbar visible
    var scrollbarSize = scrollbarWidth();
    function adjustContentWidth(){
        var left = parseFloat( getComputedStyle( elc ).getPropertyValue( 'padding-left' ) );
        var right = left;
        if( elc.scrollHeight > elc.clientHeight ){
            // if we have a scrollbar reduce the right margin by the scrollbar width
            right = Math.max( 0, left - scrollbarSize );
        }
        elc.style[ 'padding-right' ] = '' + right + 'px';
    }
    window.addEventListener('resize', adjustContentWidth );
    adjustContentWidth();
}

function initLightbox(){
    // wrap image inside a lightbox (to get a full size view in a popup)
    var images = $(".container-main img").not(".inline");
    images.wrap(function(){
        var image =$(this);
        var o = getUrlParameter(image[0].src);
        var f = o['featherlight'];
        // IF featherlight is false, do not use feather light
        if (f != 'false') {
            if (!image.parent("a").length) {
                var html = $( "<a>" ).attr("href", image[0].src).attr("data-featherlight", "image").get(0).outerHTML;
                return html;
            }
        }
    });

    $('a[rel="lightbox"]').featherlight({
        root: 'div#body'
    });
}

function initImageStyles(){
    // change image styles, depending on parameters set to the image
    var images = $("main.container-main img").not(".inline");
    images.each(function(index){
        var image = $(this)
        var o = getUrlParameter(image[0].src);
        if (typeof o !== "undefined") {
            var h = o["height"];
            var w = o["width"];
            var c = o["classes"];
            image.css("width", function() {
                if (typeof w !== "undefined") {
                    return w;
                } else {
                    return "auto";
                }
            });
            image.css("height", function() {
                if (typeof h !== "undefined") {
                    return h;
                } else {
                    return "auto";
                }
            });
            if (typeof c !== "undefined") {
                var classes = c.split(',');
                for (i = 0; i < classes.length; i++) {
                    image.addClass(classes[i]);
                }
            }
        }
    });
}

function sidebarEscapeHandler( event ){
    if( event.key == "Escape" ){
        var b = document.querySelector( 'body' );
        b.classList.remove( 'sidebar-flyout' );
        document.removeEventListener( 'keydown', sidebarEscapeHandler );
        document.querySelector( '.container-main' ).focus();
        psc && psc.scrollbarY.focus();
    }
}

function tocEscapeHandler( event ){
    if( event.key == "Escape" ){
        var b = document.querySelector( 'body' );
        b.classList.remove( 'toc-flyout' );
        document.removeEventListener( 'keydown', tocEscapeHandler );
        document.querySelector( '.container-main' ).focus();
        psc && psc.scrollbarY.focus();
    }
}

function sidebarShortcutHandler( event ){
    if( event.altKey && event.ctrlKey && event.which == 77 /* m */ ){
        showNav();
    }
}

function editShortcutHandler( event ){
    if( event.altKey && event.ctrlKey && event.which == 69 /* e */ ){
        showEdit();
    }
}

function printShortcutHandler( event ){
    if( event.altKey && event.ctrlKey && event.which == 80 /* p */ ){
        showPrint();
    }
}

function showNav(){
    var sidebar = document.querySelector('#sidebar');
    sidebar.style.width = "0px";
    var b = document.querySelector( 'body' );
    b.classList.toggle( 'sidebar-flyout' );
    if( b.classList.contains( 'sidebar-flyout' ) ){
        b.classList.remove( 'toc-flyout' );
        document.removeEventListener( 'keydown', tocEscapeHandler );
        document.addEventListener( 'keydown', sidebarEscapeHandler );
    }
    else{
        document.removeEventListener( 'keydown', sidebarEscapeHandler );
        document.querySelector( '.container-main' ).focus();
        psc && psc.scrollbarY.focus();
    }
}

function showEdit(){
    var l = document.querySelector( '#top-github-link a' );
    if( l ){
        l.click();
    }
}

function showPrint(){
    var l = document.querySelector( '#top-print-link a' );
    if( l ){
        l.click();
    }
}

function initSwipeHandler(){
    if( !touchsupport ){
        return;
    }

    var startx = null;
    var starty = null;
    var handleStartX = function(evt) {
        startx = evt.touches[0].clientX;
        starty = evt.touches[0].clientY;
        return false;
    };
    var handleMoveX = function(evt) {
        if( startx !== null ){
            var diffx = startx - evt.touches[0].clientX;
            var diffy = starty - evt.touches[0].clientY || .1 ;
            if( diffx / Math.abs( diffy ) < 2 ){
                // detect mostly vertical swipes and reset our starting pos
                // to not detect a horizontal move if vertical swipe is unprecise
                startx = evt.touches[0].clientX;
            }
            else if( diffx > 30 ){
                startx = null;
                starty = null;
                var b = document.querySelector( 'body' );
                b.classList.remove( 'sidebar-flyout' );
                document.removeEventListener( 'keydown', sidebarEscapeHandler );
                document.querySelector( '.container-main' ).focus();
                psc && psc.scrollbarY.focus();
            }
        }
        return false;
    };
    var handleEndX = function(evt) {
        startx = null;
        starty = null;
        return false;
    };

    document.querySelector( '#sidebar-toggle' ).addEventListener("touchstart", handleStartX, false);
    document.querySelector( '#sidebar' ).addEventListener("touchstart", handleStartX, false);
    document.querySelectorAll( '#sidebar *' ).forEach( function(e){ e.addEventListener("touchstart", handleStartX); }, false);
    document.querySelector( '#sidebar-toggle' ).addEventListener("touchmove", handleMoveX, false);
    document.querySelector( '#sidebar' ).addEventListener("touchmove", handleMoveX, false);
    document.querySelectorAll( '#sidebar *' ).forEach( function(e){ e.addEventListener("touchmove", handleMoveX); }, false);
    document.querySelector( '#sidebar-toggle' ).addEventListener("touchend", handleEndX, false);
    document.querySelector( '#sidebar' ).addEventListener("touchend", handleEndX, false);
    document.querySelectorAll( '#sidebar *' ).forEach( function(e){ e.addEventListener("touchend", handleEndX); }, false);
}

function clearHistory() {
    var visitedItem = baseUriFull + 'visited-url/'
    for( var item in sessionStorage ){
        if( item.substring( 0, visitedItem.length ) === visitedItem ){
            sessionStorage.removeItem( item );
            var url = item.substring( visitedItem.length );
            // in case we have `relativeURLs=true` we have to strip the
            // relative path to root
            url = url.replace( /\.\.\//g, '/' ).replace( /^\/+\//, '/' );
            jQuery('[data-nav-id="' + url + '"]').removeClass('visited');
        }
    }
}

function initHistory() {
    var visitedItem = baseUriFull + 'visited-url/'
    sessionStorage.setItem(visitedItem+jQuery('body').data('url'), 1);

    // loop through the sessionStorage and see if something should be marked as visited
    for( var item in sessionStorage ){
        if( item.substring( 0, visitedItem.length ) === visitedItem && sessionStorage.getItem( item ) == 1 ){
            var url = item.substring( visitedItem.length );
            // in case we have `relativeURLs=true` we have to strip the
            // relative path to root
            url = url.replace( /\.\.\//g, '/' ).replace( /^\/+\//, '/' );
            jQuery('[data-nav-id="' + url + '"]').addClass('visited');
        }
    }
}

function scrollToActiveMenu() {
    window.setTimeout(function(){
        var e = document.querySelector( 'ul.topics li.active a' );
        if( e && e.scrollIntoView ){
            e.scrollIntoView({
                block: 'center',
            });
        }
    }, 10);
}

function scrollToFragment() {
    if( !window.location.hash || window.location.hash.length <= 1 ){
        return;
    }
    window.setTimeout(function(){
        var e = document.querySelector( window.location.hash );
        if( e && e.scrollIntoView ){
            e.scrollIntoView({
                block: 'start',
            });
        }
    }, 10);
}


function initSearch() {
    jQuery('[data-search-input]').on('input', function() {
        var input = jQuery(this);
        var value = input.val();
        if (value.length) {
            sessionStorage.setItem(baseUriFull+'search-value', value);
        }
    });
    jQuery('[data-search-clear]').on('click', function() {
        jQuery('[data-search-input]').val('').trigger('input');
    });

    // custom sizzle case insensitive "contains" pseudo selector
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    
}

// Get Parameters from some url
function getUrlParameter(sPageURL) {
    var url = sPageURL.split('?');
    var obj = {};
    if (url.length == 2) {
      var sURLVariables = url[1].split('&'),
          sParameterName,
          i;
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          obj[sParameterName[0]] = sParameterName[1];
      }
    }
    return obj;
};

// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
(function($, sr) {

    var debounce = function(func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');

jQuery(function() {
    renderVersion();
    initArrowNav();
    initMermaid();
    initSwagger();
    initMenuScrollbar();
    scrollToActiveMenu();
    scrollToFragment();
    initLightbox();
    initImageStyles();
    initAnchorClipboard();
    initCodeClipboard();
    restoreTabSelections();
    initSwipeHandler();
    initHistory();
    initSearch();
    generateToc();
    showPrint
    videosAutoplayer();
});

jQuery.extend({
    highlight: function(node, re, nodeName, className) {
        if (node.nodeType === 3 && node.parentElement && node.parentElement.namespaceURI == 'http://www.w3.org/1999/xhtml') { // text nodes
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function(options) {
    var settings = {
        className: 'highlight',
        element: 'span'
    };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function() {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function(words, options) {
    var settings = {
        className: 'highlight',
        element: 'span',
        caseSensitive: false,
        wordsOnly: false
    };
    jQuery.extend(settings, options);

    if (!words) { return; }

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i) {
        return word != '';
    });
    words = jQuery.map(words, function(word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; }
    ;

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function() {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

function useMermaid( config ){
    if( !Object.assign ){
        // We don't support Mermaid for IE11 anyways, so bail out early
        return;
    }
    if (typeof mermaid != 'undefined' && typeof mermaid.mermaidAPI != 'undefined') {
        mermaid.initialize( Object.assign( { "securityLevel": "antiscript", "startOnLoad": false     }, config ) );
        if( config.theme && variants ){
            var write_style = variants.findLoadedStylesheet( 'variant-style' );
            write_style.setProperty( '--CONFIG-MERMAID-theme', config.theme );
        }
    }
}
if( window.themeUseMermaid ){
    useMermaid( window.themeUseMermaid );
}

function useSwagger( config ){
    if( config.theme && variants ){
        var write_style = variants.findLoadedStylesheet( 'variant-style' );
        write_style.setProperty( '--CONFIG-SWAGGER-theme', config.theme );
    }
}
if( window.themeUseSwagger ){
    useSwagger( window.themeUseSwagger );
}

// Common custom functions

function videosAutoplayer() {
    let videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        observeVideo(video);
    });
}

function observeVideo(video) {
    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting === true) 
                    video.play();
                else 
                    video.pause();
                });
        },
        { threshold: 0.2 }
    );
    observer.observe(video);
}

// Table of contents h2 highlighter

const anchors = $('body').find('h2,h3');

$(window).scroll(function(){
    var scrollTop = $(document).scrollTop();
    
    // highlight the last scrolled-to: set everything inactive first
    for (var i = 0; i < anchors.length; i++){
        let highlightedHref = $('#TableOfContents ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
        highlightedHref.removeClass('is-active');
    }
    
    // then iterate backwards, on the first match highlight it and break
    for (var i = anchors.length-1; i >= 0; i--){
        if (scrollTop > $(anchors[i]).offset().top - 140) {
            let highlightedHref = $('#TableOfContents ul li a[href="#' + $(anchors[i]).attr('id') + '"]')
            highlightedHref.addClass('is-active');
            break;
        }
    }
});

// Back To Top Button

const showOnPx = 100;

window.addEventListener("load", () => {
    document.addEventListener("scroll", e => {
    if (window.pageYOffset > showOnPx) {
        document.querySelector(".back-to-top").classList.remove("hidden");
      } else {
        document.querySelector(".back-to-top").classList.add("hidden");
      }
    });
});

const goToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };


var showSidenav = true;

window.addEventListener("load", () => {
    document.querySelector(".sidebar-toggle-navigation").addEventListener("click", e => {
    if (showSidenav) {
        $("#sidebar").removeClass("active");
        showSidenav = false;
        return
    }

    $("#sidebar").addClass("active");
    showSidenav = true;
    e.preventDefault();
    });
});


$( document ).ready(function() {
    images = document.querySelectorAll("[x-style]");

    for (let image of images) {
        styles = image.getAttribute("x-style");
        image.setAttribute("style", styles)
        image.removeAttribute("x-style")
    }
});


$( document ).ready(function() {
    labels = document.querySelectorAll(".labels");
    header = document.querySelector("h1");

    for (let label of labels) {
        header.insertAdjacentElement('afterend', label);
    }
});

$('#search-by').keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });

$("input.toggle").click(function(event) {
    var x = $(event.target).next().next().next().slideToggle();
});


function copyURI(evt) {
    navigator.clipboard.writeText(evt.target.closest("a").getAttribute('href')).then(() => {
    }, () => {
      console.log("clipboard copy failed")
    });
}

function renderVersion() {
    var menuEntries = document.getElementsByTagName('li');
    //.getElementsByTagName('li');
  
    for(let item of menuEntries) {
      const dataNavId = item.getAttribute("data-nav-id");
      var version = localStorage.getItem('docs-version');
      if (dataNavId == undefined) continue;
      
        if (!dataNavId.startsWith("/" + version)) {
            item.style.display = "none";
        }
      }
};


var maxHeadlineLevel = 2;
var generateToc = function() {
    var contentBlock = document.querySelector(".row-main");
    if (!contentBlock) {
      return;
    }
    var maxHeadlineLevel = 2;
    var headlineLevels = ["h2", "h3", "h4", "h5", "h6"]
    var nodes = contentBlock.querySelectorAll(headlineLevels.slice(0, maxHeadlineLevel).join(","));
    if (nodes.length < 3) {
        document.querySelector('.toc-container').style.display = none;
      return;
    }
  
    var currentLevel = 1;
    var currentParent = document.createElement("ul");
    var parents = [
      {
        level: 1,
        element: currentParent
      }
    ];
    var lastElement = currentParent;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes.item(i);
      var level = parseInt(node.tagName[1], 10);
      if (level < currentLevel) {
        while (level < currentLevel) {
          parents.pop();
          currentParent = parents[parents.length - 1].element;
          currentLevel = parents[parents.length - 1].level;
        }
      } else if (level > currentLevel) {
        var newParent = document.createElement("ul");
        if (lastElement) {
          lastElement.appendChild(newParent);
        }
        currentParent = newParent;
        currentLevel = level;
        parents.push({
          level: level,
          element: currentParent
        });
      }
  
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "level-"+level;
      a.href = "#" + node.id;
      a.textContent = node.textContent;
  
      li.appendChild(a);
      currentParent.appendChild(li);
  
      lastElement = li;
    }
  
    var root;
    if (parents.length > 0) {
      root = parents[0].element;
    } else {
      root = currentParent;
    }

    var nav = document.createElement("nav");
    nav.className = "ps";
    nav.appendChild(root);
    document.querySelector("#TableOfContents").appendChild(nav)
  
  };


