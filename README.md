# Basic Header

A simple, modular website header. Html, CSS, and Javascript all loaded and included separately, and support various means of inclusion in a project.

## Contents

The `index.mjs` entrypoint exposes browser and server javascript for EMS imports. The `index.cjs` entrypoint only exposes server javascript (for building the header html) to CommonJS. Browser-only code can be imported directly from dist files (probably `dist/js/constructor.mjs`).

    index.mjs
    index.cjs
    _header.scss
    dist
    ├── header.css
    ├── js
    │   ├── collapsible-menu.mjs
    │   ├── constructor.mjs
    │   ├── fixed-header.mjs
    │   └── utils.mjs
    ├── sass
    │   ├── _header.scss
    │   └── _utils.scss
    ├── template.js
    └── template.jst

## Usage

### HTML

```javascript
import { generateHtml } from '@dawaltconley/header-basic';

let header = generateHtml({
  name: 'header',
  links: [{
    text: 'Home',
    page: '/'
  }, {
    text: 'About',
    page: '/about/'
  }]
});
```

### Scss / CSS

<!-- TODO needs better documentation -->

The `dist/header.css` file contains minimal styles that can be used without Scss. However you can customize things easier with the `style` mixin.

```scss
@use '@dawaltconley/header-basic/header';

.header-class {
  @include header.styles($color: #333 white, $transition: .3s .25s);
}
```

### Javascript

Simply import the module and pass it the header element (generated above).

```javascript
import makeHeader from '@dawaltconley/header-basic';

let headerElement = document.getElementById('header'); // this id corresponds to the 'name' option

let { original, fixed } = makeHeader(headerElement);
```

### With Eleventy

You can import an eleventy plugin directly to add Nunjucks and Liquid tags...

```javascript
// .eleventy.js
const header = require('@dawaltconley/header-basic');

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(header.eleventy, { tagName: 'header' });
};
```

...configure it in a data file...

```yaml
# _data/header.yml
links:
  - text: Home
    page: '/'
  - text: About
    page: '/about/'
  - text: Dropdown
    dropdown:
      - text: Drop 1
        page: '/foo/'
      - text: Drop 2
        page: '/bar/'
logo:
  src: 'http://pigment.github.io/fake-logos/logos/small/color/greens-food-suppliers.png'
  alt: Greens Food Suppliers
```

And then use these tags in your templates.

```nunjucks
<!-- index.html -->
<body>
  {% header header, class="other-class another-class", 'data-thing'=null %}
  <main>
    <p>Some main content</p>
  </main>
</body>
```

## Components

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [constructor](#constructor)
    *   [Parameters](#parameters)
*   [generateHtml](#generatehtml)
    *   [Parameters](#parameters-1)
*   [eleventy](#eleventy)
    *   [Parameters](#parameters-2)
*   [KeywordArguments](#keywordarguments)
    *   [Properties](#properties)
*   [Link](#link)
    *   [Properties](#properties-1)
*   [Logo](#logo)
    *   [Properties](#properties-2)
*   [Icons](#icons)
    *   [Properties](#properties-3)
*   [FixedHeader](#fixedheader)
    *   [Parameters](#parameters-3)
    *   [scrollPos](#scrollpos)
    *   [pagePosition](#pageposition)
        *   [Parameters](#parameters-4)
    *   [hideHeaderRef](#hideheaderref)
    *   [showHeaderRef](#showheaderref)
    *   [scroll](#scroll)
    *   [disableScroll](#disablescroll)
    *   [enableScroll](#enablescroll)
    *   [hide](#hide)
    *   [matchRef](#matchref)
    *   [resize](#resize)
    *   [slide](#slide)
        *   [Parameters](#parameters-5)
    *   [setShadow](#setshadow)
        *   [Parameters](#parameters-6)
    *   [addListeners](#addlisteners)
*   [CollapsibleMenu](#collapsiblemenu)
    *   [Parameters](#parameters-7)
    *   [open](#open)
    *   [close](#close)
    *   [toggle](#toggle)
    *   [addListeners](#addlisteners-1)

### constructor

Create a fixed header and collapsible menu from the same element.

#### Parameters

*   `element` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** header parent element
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 

    *   `options.name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** base name for BEM classes (optional, default `'header'`)
    *   `options.scrollable` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** element to monitor for scrolling (optional, default `document.scrollingElement`)

### generateHtml

Generates html for the header element.

#### Parameters

*   `args` **...[KeywordArguments](#keywordarguments)** one or more kwarg objects

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** header html

### eleventy

Eleventy plugin for the generateHtml function.
Supports inserting html via Nunjucks and Liquid tags.

#### Parameters

*   `eleventyConfig`  
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?**  (optional, default `{}`)

    *   `options.tagName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `'header'`)

### KeywordArguments

The key/value pairs used in for the `generateHtml` function and templating tags.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** base name for element id and BEM classes
*   `links` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Link](#link)>?** array of links displayed in the header
*   `logo` **([Logo](#logo) | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?** header logo. can pass a Logo object or directly pass an html string
*   `icons` **[Icons](#icons)?** open and close icons
*   `iconOpen` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** html string for the open icon
*   `iconClose` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** html string for the close icon
*   `attributeName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** interpret all other key/value pairs as attribute names/values in the parent `<header>` element

### Link

An object representing a header link.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

*   `text` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the link's text, as displayed to the user
*   `page` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** the href value of the link
*   `dropdown` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Link](#link)>?** a nested array of links, visible as a dropdown

### Logo

An object representing a logo `<img>` in the header.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

*   `src` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `alt` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### Icons

An object for open and close icons in the header.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

*   `open` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** html string for the open icon
*   `close` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** html string for the close icon

### FixedHeader

Class representing a fixed/sticky header UI

#### Parameters

*   `header` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** header parent element
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?**  (optional, default `{}`)

#### scrollPos

Current scroll position of the scrolling element.

Type: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)

#### pagePosition

Gets the position of the original header within the page.

##### Parameters

*   `element` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** original header element (optional, default `this.headerRef`)
*   `page` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** scrolling (usually document) element (optional, default `this.scrollable`)

Returns **DOMRect** 

#### hideHeaderRef

Hides the original header from screen readers when fixed header is displayed.

#### showHeaderRef

Reveals the original header to screen readers when fixed header is shown.

#### scroll

Handles scroll behavior, revealing or hiding fixed header, and triggering slide if partially visible.

#### disableScroll

Remove scroll listeners

#### enableScroll

Enable scroll listeners

#### hide

Hide the fixed header (usually when returning to the top of the document and using the reference header).

#### matchRef

Matches the fixed header dimensions to the original (reference) header.

#### resize

Handle window resizing events, since this can change scroll position in page.

#### slide

Animate sliding the fixed header up or down (into or out of view). Usually based on scroll.

##### Parameters

*   `direction` **(`"up"` | `"down"`)** 
*   `callback` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** function to call when done sliding (optional, default `()=>null`)

#### setShadow

Add a box shadow to the fixed header.

##### Parameters

*   `size` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** number to use to set the shadow height (defaults to visible header size) (optional, default `parseInt(this.element.style.top)+this.height`)

#### addListeners

Adds all event listeners. Called during construction.

### CollapsibleMenu

Class representing a collapsible menu UI.

#### Parameters

*   `element` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** menu parent element
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?**  (optional, default `{}`)

#### open

Expand the menu.

#### close

Collapse the menu

#### toggle

Toggle the menu, collapsed or expanded.

#### addListeners

Attempts to add listeners for CollapsibleMenu methods. Called during construction.
