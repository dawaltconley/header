# Basic Header

A simple, modular website header. Html, CSS, and Javascript all loaded and included separately, and support various means of inclusion in a project.

## Contents

The `index.mjs` entrypoint exposes browser and server javascript for EMS imports. The `index.cjs` entrypoint only exposes server javascript (for building the header html) to CommonJS. Browser-only code can be imported directly from dist files (probably `dist/js/constructor.mjs`).

```
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
```

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
