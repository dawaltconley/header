import { getScrollableParent, getRelativeClientRect, updateDescendentIds, onScrollEnd } from './utils.mjs';

/** Class representing a fixed/sticky header UI */
class FixedHeader {
    /**
     * Create a fixed header.
     * @param {Element} header - header parent element
     * @param {Object} [options]
     * @param {Element} [options.scrollable] - element to monitor for scrolling
     */
    constructor(header, options={}) {
        const { scrollable } = options;
        const e = header.cloneNode(true);
        this.element = e;
        this.scrollable = scrollable || getScrollableParent(header) || document.documentElement;
        this.headerRef = header;
        this.pos = this.scrollPos;
        this.refPos = this.pagePosition();

        this.scrollListener = this.scroll.bind(this);
        this.slideUp = this.slide.bind(this, 'up');
        this.slideDown = this.slide.bind(this, 'down');

        this.matchRef();
        Object.assign(this.element.style, {
            position: 'fixed',
            top: -this.height.toString() + 'px',
            zIndex: '999',
            display: 'none',
        });
        updateDescendentIds(e, '-fixed');
        document.body.insertBefore(this.element, document.body.firstChild);

        this.addListeners();
    }

    /**
     * Current scroll position of the scrolling element.
     * @type {number}
     */
    get scrollPos() {
        return this.scrollable.scrollTop || window.pageYOffset || 0;
    }

    /**
     * Gets the position of the original header within the page.
     * @param {Element} [element=this.headerRef] - original header element
     * @param {Element} [page=this.scrollable] - scrolling (usually document) element
     * @return {DOMRect}
     */
    pagePosition(element=this.headerRef, page=this.scrollable) {
        return getRelativeClientRect(element, page);
    }

    /** Hides the original header from screen readers when fixed header is displayed. */
    hideHeaderRef() {
        this.headerRef.setAttribute('aria-hidden', 'true');
        this.headerRef.setAttribute('role', 'presentation');
    }

    /** Reveals the original header to screen readers when fixed header is shown. */
    showHeaderRef() {
        this.headerRef.removeAttribute('aria-hidden');
        this.headerRef.removeAttribute('role');
    }

    /** Handles scroll behavior, revealing or hiding fixed header, and triggering slide if partially visible. */
    scroll() {
        const e = this.element;
        const scrollPos = this.scrollPos;
        const scrollDiff = scrollPos - this.pos;
        window.clearTimeout(this.doneScrolling);
        this.doneScrolling = window.setTimeout(() => {
            this.interruptSlide = false;
        }, 50);
        if (e.style.display !== 'none' && scrollPos > this.refPos.top || e.style.display === 'none' && scrollPos > this.refPos.bottom) {
            e.style.display = '';
            this.hideHeaderRef();
            this.interruptSlide = true;
            let top = parseInt(e.style.top);
            if (scrollDiff < 0 && top < 0 || scrollDiff > 0 && top > -this.height) {
                top = Math.min(Math.max(top - scrollDiff, -this.height), 0);
                e.style.top = top.toString() + 'px';
                this.setShadow(top + this.height);
                this.doneScrolling = window.setTimeout(() => {
                    requestAnimationFrame(this.slideDown.bind(this));
                }, 500);
            }
        } else if (e.style.display !== 'none') {
            this.showHeaderRef();
            Object.assign(e.style, {
                display: 'none',
                top: -this.height.toString() + 'px'
            });
            this.setShadow();
        }
        this.pos = scrollPos;
    }

    /** Remove scroll listeners */
    disableScroll() {
        window.removeEventListener('scroll', this.scrollListener); // TODO check if need to target different element on paralax pages
    }

    /** Enable scroll listeners */
    enableScroll() {
        this.pos = this.scrollPos;
        window.addEventListener('scroll', this.scrollListener, { passive: true }); // TODO check if need to target different element on paralax pages
    }

    /** Hide the fixed header (usually when returning to the top of the document and using the reference header). */
    hide() {
        const target = this.scrollable !== document.scrollingElement ? this.scrollable : window;
        this.disableScroll();
        onScrollEnd(() => this.enableScroll(), { target });
        this.slideUp();
        if (this.menu && this.menu.state === 'open') {
            this.menu.close();
        }
    }

    /** Matches the fixed header dimensions to the original (reference) header. */
    matchRef() {
        this.refPos = this.pagePosition();
        this.height = this.headerRef.clientHeight;
        Object.assign(this.element.style, {
            width: this.headerRef.clientWidth.toString() + 'px',
            height: this.height.toString() + 'px'
        });
    }

    /** Handle window resizing events, since this can change scroll position in page. */
    resize() {
        this.disableScroll();
        this.matchRef();
        window.clearTimeout(this.doneResizing);
        this.doneResizing = window.setTimeout(this.enableScroll(), 100);
    }

    /**
     * Animate sliding the fixed header up or down (into or out of view). Usually based on scroll.
     * @param {('up'|'down')} direction
     * @param {function} [callback] - function to call when done sliding
     */
    slide(direction, callback = () => null) {
        const t = parseInt(this.element.style.top);
        const b = t + this.height;
        if (this.interruptSlide) { return null; } // run callback?
        if (direction === 'down' && t < 0 || direction === 'up' && b > 0) {
            const dist = direction === 'down' ? Math.min(t/5, -1) : Math.max(b/5, 1);
            this.element.style.top = (t - dist).toString() + 'px';
            window.clearTimeout(callback);
            requestAnimationFrame(this.slide.bind(this, direction, callback));
        }
        this.setShadow(b);
        window.setTimeout(callback, 50);
    }

    /**
     * Add a box shadow to the fixed header.
     * @param {number} [size] - number to use to set the shadow height (defaults to visible header size)
     */
    setShadow(size = parseInt(this.element.style.top) + this.height) {
        this.element.style.boxShadow = `0 ${size/32}px ${size/16}px 0 rgba(0, 0, 0, 0.2)`;
    }

    /** Adds all event listeners. Called during construction. */
    addListeners() {
        this.enableScroll();
        window.addEventListener('resize', this.resize.bind(this), { passive: true });
    }
}

export default FixedHeader;
