function getScrollableChild(element, maxDepth=2, currentDepth=0) {
    if (element.scrollHeight > element.clientHeight) {
        return element;
    }
    for (var i = 0; element.children && i < element.children.length && maxDepth > currentDepth; i++) {
        var child = element.children[i];
        var childMatch = getScrollableChild(child, maxDepth, currentDepth += currentDepth);
        if (childMatch) {
            return childMatch;
        }
    }
    return null;
}

function getRelativeClientRect(child, parent) {
    var cRect = child.getBoundingClientRect();
    var pRect = parent.getBoundingClientRect();
    var rRect = {
        top: cRect.top - pRect.top,
        bottom: cRect.bottom - pRect.top,
        left: cRect.left - pRect.left,
        right: cRect.right - pRect.left
    };
    if (parent.offsetHeight < parent.scrollHeight) {
        rRect.top = rRect.top + parent.scrollTop;
        rRect.bottom = rRect.bottom + parent.scrollTop;
        rRect.left = rRect.left + parent.scrollLeft;
        rRect.right = rRect.right + parent.scrollLeft;
    }
    return rRect;
}

function updateDescendentIds(element, string, position='suffix', maxDepth) {
    if (element.id && position === 'suffix') {
        element.id = element.id + string;
    } else if (element.id && position === 'prefix') {
        element.id = string + element.id;
    }
    for (var i = 0; element.children && i < element.children.length && maxDepth !== 0; i++) {
        updateDescendentIds(element.children[i], string, position, maxDepth - 1);
    }
}

function onScrollEnd(callback, buffer=100) {
    var removeListener = () => window.removeEventListener('scroll', scrolling);
    var doneScrolling;

    function scrolling() {
        window.clearTimeout(doneScrolling);
        doneScrolling = window.setTimeout(function () {
            removeListener();
            callback();
        }, buffer);
    }

    window.addEventListener('scroll', scrolling, { passive: true });
    return function () {
        removeListener();
        window.clearTimeout(doneScrolling);
    };
}

export {
    getScrollableChild,
    getRelativeClientRect, 
    updateDescendentIds,
    onScrollEnd,
};
