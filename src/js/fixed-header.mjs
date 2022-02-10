import { getScrollableParent, getRelativeClientRect, updateDescendentIds, onScrollEnd } from './utils.mjs';

class FixedHeader {
    constructor(header, options={}) {
        let { scrollable } = options;
        var e = header.cloneNode(true);
        this.element = e;
        this.scrollable = scrollable || getScrollableParent(header);
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

        console.log('constructing fixed header');
        this.addListeners();
    }

    get scrollPos() {
        return this.scrollable.scrollTop || window.pageYOffset || 0;
    }

    pagePosition(element=this.headerRef, page=this.scrollable) {
        return getRelativeClientRect(element, page);
    }

    hideHeaderRef() {
        this.headerRef.setAttribute('aria-hidden', 'true');
        this.headerRef.setAttribute('role', 'presentation');
    }

    showHeaderRef() {
        this.headerRef.removeAttribute('aria-hidden');
        this.headerRef.removeAttribute('role');
    }

    scroll() {
        console.log('scrolling');
        var f = this;
        var e = this.element;
        var scrollPos = this.scrollPos;
        var scrollDiff = scrollPos - f.pos;
        window.clearTimeout(f.doneScrolling);
        f.doneScrolling = window.setTimeout(function () {
            f.interruptSlide = false;
        }, 50);
        if (e.style.display !== 'none' && scrollPos > f.refPos.top || e.style.display === 'none' && scrollPos > f.refPos.bottom) {
            e.style.display = '';
            f.hideHeaderRef();
            f.interruptSlide = true;
            var top = parseInt(e.style.top);
            if (scrollDiff < 0 && top < 0 || scrollDiff > 0 && top > -f.height) {
                top = Math.min(Math.max(top - scrollDiff, -f.height), 0);
                e.style.top = top.toString() + 'px';
                f.setShadow(top + f.height);
                f.doneScrolling = window.setTimeout(function () {
                    requestAnimationFrame(f.slideDown.bind(f));
                }, 500);
            }
        } else if (e.style.display !== 'none') {
            f.showHeaderRef();
            Object.assign(e.style, {
                display: 'none',
                top: -f.height.toString() + 'px'
            });
            f.setShadow();
        }
        f.pos = scrollPos;
    }

    disableScroll() {
        window.removeEventListener('scroll', this.scrollListener); // TODO check if need to target different element on paralax pages
    }

    enableScroll() {
        this.pos = this.scrollPos;
        window.addEventListener('scroll', this.scrollListener, { passive: true }); // TODO check if need to target different element on paralax pages
    }

    hide() {
        console.log('hide');
        this.disableScroll();
        onScrollEnd(() => this.enableScroll());
        this.slideUp();
        // TODO ensure menu is assigned
        if (this.menu && this.menu.state === 'open') {
            this.menu.close();
        }
    }

    matchRef() {
        this.refPos = this.pagePosition();
        this.height = this.headerRef.clientHeight;
        Object.assign(this.element.style, {
            width: this.headerRef.clientWidth.toString() + 'px',
            height: this.height.toString() + 'px'
        });
    }

    resize() {
        this.disableScroll();
        this.matchRef();
        window.clearTimeout(this.doneResizing);
        this.doneResizing = window.setTimeout(this.enableScroll(), 100);
    }

    slide(direction, callback = () => null) {
        console.log('sliding');
        var t = parseInt(this.element.style.top);
        var b = t + this.height;
        if (this.interruptSlide) { return null; } // run callback?
        if (direction === 'down' && t < 0 || direction === 'up' && b > 0) {
            var dist = direction === 'down' ? Math.min(t/5, -1) : Math.max(b/5, 1);
            this.element.style.top = (t - dist).toString() + 'px';
            window.clearTimeout(callback);
            requestAnimationFrame(this.slide.bind(this, direction, callback));
        }
        this.setShadow(b);
        window.setTimeout(callback, 50);
    }

    setShadow(b = parseInt(this.element.style.top) + this.height) {
        this.element.style.boxShadow = '0 ' + (b/32).toString() + 'px ' + (b/16).toString() + 'px 0 rgba(0, 0, 0, 0.2)';
    }

    addListeners() {
        console.log('adding listeners');
        this.enableScroll();
        window.addEventListener('resize', this.resize.bind(this), { passive: true });
    }
}

console.log('test');

export default FixedHeader;
