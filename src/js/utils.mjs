/**
 * Checks whether an element can be scrolled.
 *
 * @param {Element} element
 * @return {boolean}
 */
function isScrollable(element) {
    return element.scrollHeight > element.clientHeight;
}

/**
 * Returns the first parent of an element that can be scrolled.
 *
 * @param {Element} element - element to start from
 * @param {number} [maxDepth] - maximum number of parents to check
 * @return {Element|null}
 */
function getScrollableParent(element, maxDepth) {
    var ancestor = element;
    while (ancestor !== document.documentElement && maxDepth !== 0) {
        ancestor = ancestor.parentElement;
        if (isScrollable(ancestor)) {
            return ancestor;
        }
        maxDepth -= 1;
    }
    return null;
}

/**
 * Returns the first child of an element that can be scrolled.
 *
 * @param {Element} element - element to start from
 * @param {number} [maxDepth=2] - maximum number of children to check
 * @return {Element|null}
 */
function getScrollableChild(element, maxDepth=2, currentDepth=0) {
    if (isScrollable(element)) {
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

/**
 * Get bounding client rect relative to an element's container.
 *
 * @param {Element} child
 * @param {Element} parent
 * @return {DOMRect}
 */
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

/**
 * Prefix or suffix all ids in an element and its children.
 *
 * @param {Element} element - the parent element to update from
 * @param {string} string - the string to prefix or suffix
 * @param {('prefix'|'suffix')} [position='suffix'] - whether to prefix or suffix
 * @param {number} [maxDepth] - a maximum number of child elements to check before terminating
 */
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

/**
 * Execute a function on a particular scroll direction.
 *
 * @param {('up'|'down')} direction - the direction of the scroll to listen for
 * @param {function} callback - the function to execute on scroll
 * @param {EventTarget} [target=window] - the element / target to watch for scroll events
 * @return {function} - function to remove scroll listener
 */
function onScroll(direction, callback, target=window) {
    let oldPos;
    const scrolling = () => {
        const newPos = target.pageYOffset || target.scrollTop || 0;
        if (oldPos && (newPos < oldPos && direction === 'up') || (newPos > oldPos && direction === 'down')) {
            callback();
        }
        oldPos = newPos;
    };

    target.addEventListener('scroll', scrolling, { passive: true });
    return () => target.removeEventListener('scroll', scrolling);
}

const onScrollUp = onScroll.bind(null, 'up');
const onScrollDown = onScroll.bind(null, 'down');

/**
 * Executes a function when scrolling is complete.
 *
 * @param {function} callback - function to be called when done scrolling
 * @param {Object} [options]
 * @param {number} [options.buffer=100] - time in milliseconds to wait for scroll event before executing callback
 * @param {EventTarget} [options.target=window] - the target to attach the scroll listener to
 * @return {function} - function to remove scroll listener
 */
function onScrollEnd(callback, options={}) {
    const { buffer = 100, target = window } = options;
    const removeListener = () => target.removeEventListener('scroll', scrolling);
    let doneScrolling;

    function scrolling() {
        window.clearTimeout(doneScrolling);
        doneScrolling = window.setTimeout(() => {
            removeListener();
            callback();
        }, buffer);
    }

    target.addEventListener('scroll', scrolling, { passive: true });
    return () => {
        removeListener();
        window.clearTimeout(doneScrolling);
    };
}

export {
    getScrollableParent,
    getScrollableChild,
    getRelativeClientRect, 
    updateDescendentIds,
    onScrollUp,
    onScrollDown,
    onScrollEnd,
};
