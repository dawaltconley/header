const header = content =>`
<header id="header" class="header" data-menu data-fixed-header>
  <nav id="site-nav" class="header__nav">
    ${content}
  </nav>
</header>`;

const headerMobile = content => `
<div class="header__mobile">
  ${content}
  <div class="header__mobile-buttons">
    <a href="#site-nav" class="header__mobile-buttons-open header__mobile-buttons-open--target" data-menu-button="open">
      Menu&nbsp;<i class="fa fa-bars fa-fw fa-lg"></i>
    </a>
    <a href="#" class="header__mobile-buttons-close header__mobile-buttons-close--target" data-class-add="hidden" data-menu-button="close">
      Close&nbsp;<i class="fa fa-times fa-fw fa-lg"></i>
    </a>
  </div>
</div>`;

const headerLogo = (src, alt='', pathPrefix=undefined) => `
<a class="header__logo" href="${pathPrefix || ''}/">
  <img class="header__logo-img" itemprop="logo" src="${src}" alt="${alt}">
</a>`;

const headerLinks = content => `
<div class="header__links header__links--target t-long" data-menu-links data-class-rm="t-long">
  ${content}
</div>`;

const headerDropdownContainer = content => `
<div class="header__link-container">
  ${content}
</div>`;

const headerDropdown = content => `
<div class="header__dropdown" data-menu-dropdown>
  ${content}
</div>`;

const headerLink = (link, classList=[]) => `
<a class="${classList.join(' ')}" href="${link.href || ''}" data-menu-link>
  ${link.text}
</a>`;

const combineLinks = (links, classList) => links.reduce((t, link) => t + headerLink(link, classList), '');

module.exports = (links, logo={}, opts={}) => {
    let html = links.reduce((t, link) => {
        let classList = [ 'header__link' ];
        if (link.dropdown) {
            let dropDownLink = headerLink(link, [ ...classList, 'header__link--dropdown-hover' ]);
            let sublinks = combineLinks(link.dropdown, [ ...classList, 'header__link--sub-link' ]);
            dropDownLink += headerDropdown(sublinks);
            return t + headerDropdownContainer(dropDownLink);
        } else {
            return t + headerLink(link, [ ...classList, 'header__link--hover' ]);
        }
    }, '');

    let logoHtml = logo.src ? headerLogo(logo.src, logo.alt, opts.pathPrefix) : '';
    let mobile = headerMobile(logoHtml);

    html = mobile + headerLinks(html);
    return header(html);
};
