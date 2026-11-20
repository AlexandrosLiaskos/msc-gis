/* ============================================================================
   gis.js — shared components + i18n for the GIS Master's site (EN + EL)
     <gis-topbar current="home"></gis-topbar> … <gis-footer></gis-footer>
   Language = ?lang= override, else hostname (contains "-el" → Greek).
   On the live domains the EN/EL switch navigates to the other site; in local
   preview it toggles in place. Pairs with gis.css.
   Deploy to: /fileadmin/depts/geol.uoa.gr/gis/uploads/gis/gis.js
   ========================================================================== */
(function () {
  'use strict';
  var P = new URLSearchParams(location.search);
  var ON_SITE = /(^|\.)uoa\.gr$/i.test(location.hostname);
  var LANG = (P.get('lang') === 'el' || P.get('lang') === 'en')
    ? P.get('lang')
    : (location.hostname.indexOf('-el') > -1 ? 'el' : 'en');
  var EN_HOST = 'https://gis.geol.uoa.gr/', EL_HOST = 'https://gis-el.geol.uoa.gr/';

  /* Client-side SPA — routes are hash paths; TYPO3 only serves the shell.
     Every "page" is a fetched HTML fragment from `pages/`.
     Sub-menus surface the full IA (16 inner pages across 5 sections). */
  var NAV = [
    { key:'about', en:'About', el:'Σχετικά', href:'#/about', children:[
      { key:'programme',         en:'Programme',         el:'Πρόγραμμα',              href:'#/about/programme',         desc_en:'Subject of study & purpose',       desc_el:'Αντικείμενο & σκοπός' },
      { key:'staff',             en:'Staff',             el:'Προσωπικό',              href:'#/about/staff',             desc_en:'Faculty, administration, secretariat', desc_el:'ΔΕΠ, διοίκηση, γραμματεία' },
      { key:'gallery',           en:'Gallery',           el:'Εικόνες',                href:'#/about/gallery',           desc_en:'The programme in images',           desc_el:'Το Πρόγραμμα μέσα από εικόνες' },
      { key:'quality-assurance', en:'Quality Assurance', el:'Διασφάλιση Ποιότητας',  href:'#/about/quality-assurance', desc_en:'Policy & code of ethics',          desc_el:'Πολιτική & δεοντολογία' },
      { key:'contact',           en:'Contact',           el:'Επικοινωνία',            href:'#/about/contact',           desc_en:'Get in touch',                     desc_el:'Στοιχεία επικοινωνίας' }
    ]},
    { key:'admissions', en:'Admissions', el:'Εισαγωγή', href:'#/admissions', children:[
      { key:'who-can-apply',       en:'Who can apply',       el:'Ποιος μπορεί να αιτηθεί', href:'#/admissions/who-can-apply',       desc_en:'Eligible degrees & fields',           desc_el:'Επιλέξιμα πτυχία & πεδία' },
      { key:'required-documents',  en:'Required documents',  el:'Απαιτούμενα έγγραφα',     href:'#/admissions/required-documents',  desc_en:'What to submit',                      desc_el:'Τι υποβάλλεις' },
      { key:'selection-criteria',  en:'Selection criteria',  el:'Κριτήρια επιλογής',       href:'#/admissions/selection-criteria',  desc_en:'How candidates are evaluated',        desc_el:'Πώς αξιολογούνται οι υποψήφιοι' },
      { key:'fees-scholarships',   en:'Fees & scholarships', el:'Δίδακτρα & υποτροφίες',   href:'#/admissions/fees-scholarships',   desc_en:'Cost & funding',                      desc_el:'Κόστος & χρηματοδότηση' },
      { key:'apply',               en:'Apply',               el:'Αίτηση',                   href:'#/admissions/apply',               desc_en:'Start the application',               desc_el:'Ξεκίνησε την αίτηση' }
    ]},
    { key:'curriculum', en:'Curriculum', el:'Πρόγραμμα Σπουδών', href:'#/curriculum', children:[
      { key:'overview',          en:'Programme overview',   el:'Επισκόπηση προγράμματος', href:'#/curriculum/overview',          desc_en:'Duration & teaching',    desc_el:'Διάρκεια & διδασκαλία' },
      { key:'courses',           en:'Courses',              el:'Μαθήματα',                 href:'#/curriculum/courses',           desc_en:'Structure & descriptions', desc_el:'Δομή & περιγραφές' },
      { key:'assessment',        en:'Assessment & grading', el:'Αξιολόγηση & βαθμολογία',  href:'#/curriculum/assessment',        desc_en:'Grading policy',           desc_el:'Πολιτική βαθμολογίας' },
      { key:'thesis',            en:'Master thesis',        el:'Διπλωματική εργασία',      href:'#/curriculum/thesis',            desc_en:'Proposal to defence',      desc_el:'Πρόταση έως εξέταση' },
      { key:'completed-theses',  en:'Graduate theses',      el:'Διπλωματικές αποφοίτων',   href:'#/curriculum/completed-theses',  desc_en:'Past graduate work',       desc_el:'Εργασίες αποφοίτων' }
    ]},
    { key:'student-life', en:'Student Life', el:'Φοιτητική Ζωή', href:'#/student-life', children:[
      { key:'rights',    en:'Rights & obligations', el:'Δικαιώματα & υποχρεώσεις', href:'#/student-life/rights',    desc_en:'What to expect',   desc_el:'Τι περιμένεις' },
      { key:'documents', en:'Documents',            el:'Έγγραφα',                    href:'#/student-life/documents', desc_en:'Forms & guides',   desc_el:'Έντυπα & οδηγοί' }
    ]},
    { key:'news', en:'News & Events', el:'Νέα & Εκδηλώσεις', href:'#/news', children:[] }
  ];
  var APPLY = { en:'Apply Now', el:'Κάντε Αίτηση', href:'#/admissions/apply' };

  /* Where content fragments live. On the live UOA domains we fetch from
     the fileadmin uploads folder; locally we fetch from `pages/`. */
  var CONTENT_BASE = /(^|\.)uoa\.gr$/i.test(location.hostname)
    ? '/fileadmin/depts/geol.uoa.gr/gis/uploads/gis/pages/'
    : 'pages/';

  /* Admin passphrase config — a hash-only file you can edit to rotate the
     passphrase without touching gis.js. Root-relative, so it resolves both on
     the live fileadmin and in the local src/ preview (which mirrors fileadmin).
     Client-side gating is access-tidying, NOT confidentiality: the config and
     the admin fragment are public URLs. Never place sensitive data behind it. */
  var ADMIN_CONFIG = '/fileadmin/depts/geol.uoa.gr/gis/uploads/gis/admin-config.json';

  var ROUTES = {
    '':                              { file:'home',                          section:'home' },
    '/':                             { file:'home',                          section:'home' },
    '/about':                        { file:'about-programme',               section:'about' },
    '/about/programme':              { file:'about-programme',               section:'about' },
    '/about/staff':                  { file:'about-staff',                   section:'about' },
    '/about/gallery':                { file:'about-gallery',                 section:'about' },
    '/about/quality-assurance':      { file:'about-quality-assurance',       section:'about' },
    '/about/contact':                { file:'about-contact',                 section:'about' },
    '/admissions':                   { file:'admissions-who-can-apply',      section:'admissions' },
    '/admissions/who-can-apply':     { file:'admissions-who-can-apply',      section:'admissions' },
    '/admissions/required-documents':{ file:'admissions-required-documents', section:'admissions' },
    '/admissions/selection-criteria':{ file:'admissions-selection-criteria', section:'admissions' },
    '/admissions/fees-scholarships': { file:'admissions-fees-scholarships',  section:'admissions' },
    '/admissions/apply':             { file:'admissions-apply',              section:'admissions' },
    '/curriculum':                   { file:'curriculum-overview',           section:'curriculum' },
    '/curriculum/overview':          { file:'curriculum-overview',           section:'curriculum' },
    '/curriculum/courses':           { file:'curriculum-courses',            section:'curriculum' },
    '/curriculum/assessment':        { file:'curriculum-assessment',         section:'curriculum' },
    '/curriculum/thesis':            { file:'curriculum-thesis',             section:'curriculum' },
    '/curriculum/completed-theses':  { file:'curriculum-completed-theses',   section:'curriculum' },
    '/student-life':                 { file:'student-life-rights',           section:'student-life' },
    '/student-life/rights':          { file:'student-life-rights',           section:'student-life' },
    '/student-life/documents':       { file:'student-life-documents',        section:'student-life' },
    '/news':                         { file:'news-events',                   section:'news' },
    /* Thematic "field" pages — reached from the home pillars, kept out of NAV */
    '/fields/programming':           { file:'fields-programming',            section:'' },
    '/fields/web-gis':               { file:'fields-web-gis',                section:'' },
    '/fields/spatial-analysis':      { file:'fields-spatial-analysis',       section:'' },
    /* Unlisted internal admin surface — not in NAV, gated client-side */
    '/admin':                        { file:'admin',                         section:'' }
  };

  /* Inline SVG flags — pixel-perfect and consistent across OSes (emoji flags
     don't render on Windows and vary widely on Mac/iOS/Android). ~20×14 for a
     traditional flag ratio; rendered rounded via `rx`. */
  var FLAG_EN =
    '<svg class="lang-flag" viewBox="0 0 60 42" width="20" height="14" aria-hidden="true">' +
    '<defs><clipPath id="gis-uk"><rect width="60" height="42" rx="2.5"/></clipPath></defs>' +
    '<g clip-path="url(#gis-uk)">' +
      '<rect width="60" height="42" fill="#012169"/>' +
      '<path d="M0 0L60 42M60 0L0 42" stroke="#fff" stroke-width="7"/>' +
      '<path d="M0 0L60 42" stroke="#C8102E" stroke-width="4" stroke-dasharray="30" stroke-dashoffset="0"/>' +
      '<path d="M60 0L0 42" stroke="#C8102E" stroke-width="4" stroke-dasharray="30" stroke-dashoffset="30"/>' +
      '<rect x="25" y="0" width="10" height="42" fill="#fff"/>' +
      '<rect x="0" y="16" width="60" height="10" fill="#fff"/>' +
      '<rect x="27" y="0" width="6" height="42" fill="#C8102E"/>' +
      '<rect x="0" y="18" width="60" height="6" fill="#C8102E"/>' +
    '</g></svg>';
  var FLAG_EL =
    '<svg class="lang-flag" viewBox="0 0 27 18" width="20" height="14" aria-hidden="true">' +
    '<defs><clipPath id="gis-gr"><rect width="27" height="18" rx="1.2"/></clipPath></defs>' +
    '<g clip-path="url(#gis-gr)">' +
      '<rect width="27" height="18" fill="#0D5EAF"/>' +
      '<rect y="2" width="27" height="2" fill="#fff"/>' +
      '<rect y="6" width="27" height="2" fill="#fff"/>' +
      '<rect y="12" width="27" height="2" fill="#fff"/>' +
      '<rect y="16" width="27" height="2" fill="#fff"/>' +
      '<rect width="10" height="10" fill="#0D5EAF"/>' +
      '<rect x="4" width="2" height="10" fill="#fff"/>' +
      '<rect y="4" width="10" height="2" fill="#fff"/>' +
    '</g></svg>';

  /* Inline monochrome social glyphs (currentColor) — same inline-SVG approach as
     the flags; no icon font, no external asset. 24×24 viewBox. */
  var ICON_FB =
    '<svg class="soc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M13.4 21v-8h2.7l.4-3.13h-3.1V7.86c0-.9.25-1.52 1.55-1.52h1.66V3.54c-.29-.04-1.27-.13-2.42-.13-2.4 0-4.04 1.46-4.04 4.15v2.31H7.5V13h2.66v8h3.24z"/></svg>';
  var ICON_YT =
    '<svg class="soc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M23.5 7.5c-.28-1.06-1.1-1.9-2.14-2.18C19.44 4.83 12 4.83 12 4.83s-7.44 0-9.36.49C1.6 5.6.78 6.44.5 7.5.02 9.43.02 12 .02 12s0 2.57.48 4.5c.28 1.06 1.1 1.9 2.14 2.18 1.92.49 9.36.49 9.36.49s7.44 0 9.36-.49c1.04-.28 1.86-1.12 2.14-2.18.48-1.93.48-4.5.48-4.5s0-2.57-.48-4.5zM9.6 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>';
  var ICON_X =
    '<svg class="soc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M18.24 2.25h3.31l-7.23 8.26L22.82 21.75h-6.66l-5.22-6.82-5.96 6.82H1.66l7.73-8.84L1.18 2.25h6.83l4.71 6.23 5.52-6.23zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64z"/></svg>';
  var ICON_LI =
    '<svg class="soc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M6.94 5.5a2 2 0 11-4.001-.001A2 2 0 016.94 5.5zM3.3 8.98h3.28V21H3.3V8.98zm5.55 0h3.14v1.64h.05c.44-.83 1.5-1.7 3.1-1.7 3.31 0 3.92 2.18 3.92 5.02V21h-3.27v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85V21H8.85V8.98z"/></svg>';

  function esc(s){ return String(s).replace(/&/g, '&amp;'); }
  function homeHref(){ return '#/'; }

  function navHTML(current){
    return NAV.map(function (n){
      var hasKids = n.children && n.children.length > 0;
      var sub = hasKids ? (
        '<div class="g-submenu" aria-label="' + esc(n.en) + '">' +
          '<div class="g-submenu-inner">' +
            n.children.map(function (c){
              return '<a class="g-sub" href="' + c.href + '" data-key="' + c.key + '"' +
                ' data-en="' + esc(c.en) + '" data-el="' + esc(c.el) + '">' +
                '<span class="g-sub-title">' + esc(c.en) + '</span>' +
                '<span class="g-sub-desc" data-en="' + esc(c.desc_en) + '" data-el="' + esc(c.desc_el) + '">' + esc(c.desc_en) + '</span>' +
                '</a>';
            }).join('') +
          '</div>' +
        '</div>'
      ) : '';
      return '<div class="g-nav-item' + (hasKids ? ' has-children' : '') + '" data-key="' + n.key + '">' +
        '<a href="' + n.href + '" data-key="' + n.key + '"' +
        (n.key === current ? ' aria-current="page"' : '') +
        ' data-en="' + esc(n.en) + '" data-el="' + esc(n.el) + '">' + esc(n.en) + '</a>' +
        sub + '</div>';
    }).join('');
  }

  function mobileNavHTML(){
    return NAV.map(function (n){
      var hasKids = n.children && n.children.length > 0;
      if (!hasKids){
        return '<a class="mob-top" href="' + n.href + '" data-key="' + n.key + '" data-en="' + esc(n.en) + '" data-el="' + esc(n.el) + '">' + esc(n.en) + '</a>';
      }
      return '<details class="mob-section" name="gis-mob-nav" data-key="' + n.key + '"><summary>' +
        '<span class="mob-top" data-en="' + esc(n.en) + '" data-el="' + esc(n.el) + '">' + esc(n.en) + '</span>' +
        '<span class="mob-chev" aria-hidden="true">' +
          '<svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span></summary>' +
        '<div class="mob-sub">' +
          n.children.map(function (c){
            return '<a href="' + c.href + '" data-key="' + c.key + '" data-en="' + esc(c.en) + '" data-el="' + esc(c.el) + '">' + esc(c.en) + '</a>';
          }).join('') +
        '</div></details>';
    }).join('');
  }

  function topbarHTML(current){
    return '<header class="topbar"><div class="topbar-inner">' +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="gis-mnav" aria-label="Menu" data-en-label="Menu" data-el-label="Μενού">' +
        '<span class="menu-btn-icon" aria-hidden="true"><span></span><span></span><span></span></span>' +
      '</button>' +
      '<a class="brand" href="' + homeHref() + '" aria-label="GIS — home">' +
        '<span class="brand-mark">GIS</span><span class="brand-rule"></span>' +
        '<img class="brand-uoa brand-uoa--en" src="https://gis.geol.uoa.gr/fileadmin/depts/geol.uoa.gr/gis/uploads/gis/logos/uoa-190-en.png" alt="National and Kapodistrian University of Athens" width="160" height="32" decoding="async">' +
        '<img class="brand-uoa brand-uoa--el" src="https://gis.geol.uoa.gr/fileadmin/depts/geol.uoa.gr/gis/uploads/gis/logos/uoa-190-el.png" alt="Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών" width="160" height="32" decoding="async">' +
      '</a>' +
      '<nav class="g-nav" aria-label="Primary">' + navHTML(current) + '</nav>' +
      '<div class="actions">' +
        '<a class="g-btn g-btn--apply" href="' + APPLY.href + '" data-en="' + esc(APPLY.en) + '" data-el="' + esc(APPLY.el) + '">' + esc(APPLY.en) + '</a>' +
        '<span class="lang" aria-label="Language" data-en-label="Language" data-el-label="Γλώσσα">' +
          '<span class="lang-thumb" aria-hidden="true"></span>' +
          '<button type="button" data-lang="en" aria-label="English"' + (LANG === 'en' ? ' class="on"' : '') + '>' + FLAG_EN + '</button>' +
          '<button type="button" data-lang="el" aria-label="Ελληνικά"' + (LANG === 'el' ? ' class="on"' : '') + '>' + FLAG_EL + '</button>' +
        '</span></div>' +
      '</div></header>' +
      '<div class="mobile-nav-scrim" hidden></div>' +
      '<aside class="mobile-nav" id="gis-mnav" aria-label="Primary mobile" aria-hidden="true">' +
        '<div class="mobile-nav-head">' +
          '<span class="brand-mark">GIS</span>' +
          '<button class="mobile-nav-close" type="button" aria-label="Close menu" data-en-label="Close menu" data-el-label="Κλείσιμο μενού">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<nav class="mobile-nav-body" aria-label="Primary mobile navigation">' +
          mobileNavHTML() +
          '<a class="mobile-nav-apply" href="' + APPLY.href + '" data-en="' + esc(APPLY.en) + ' →" data-el="' + esc(APPLY.el) + ' →">' + esc(APPLY.en) + ' →</a>' +
        '</nav>' +
        '<div class="mobile-nav-foot">' +
          '<span class="lang lang--mobile" aria-label="Language" data-en-label="Language" data-el-label="Γλώσσα">' +
            '<span class="lang-thumb" aria-hidden="true"></span>' +
            '<button type="button" data-lang="en"' + (LANG === 'en' ? ' class="on"' : '') + '>English</button>' +
            '<button type="button" data-lang="el"' + (LANG === 'el' ? ' class="on"' : '') + '>Ελληνικά</button>' +
          '</span>' +
        '</div>' +
      '</aside>';
  }

  function footerHTML(){
    return '<footer><div class="foot">' +
      '<div><div class="g-wordmark">GIS</div>' +
        '<p class="tag" data-en="Master&#39;s Programme in Geographic Information Systems." data-el="Πρόγραμμα Μεταπτυχιακών Σπουδών στα Γεωγραφικά Συστήματα Πληροφοριών.">Master&#39;s Programme in Geographic Information Systems.</p>' +
        '<ul class="foot-social" aria-label="Social media" data-en-label="Social media" data-el-label="Μέσα κοινωνικής δικτύωσης">' +
          '<li><a href="https://www.facebook.com/people/Postgraduate-Program-Geographic-Information-Systems-NKUA/100078913935912" target="_blank" rel="noopener" aria-label="Facebook">' + ICON_FB + '</a></li>' +
          '<li><a href="https://www.youtube.com/@GISMSc" target="_blank" rel="noopener" aria-label="YouTube">' + ICON_YT + '</a></li>' +
          '<li><a href="https://twitter.com/MscGISNKUA" target="_blank" rel="noopener" aria-label="X (formerly Twitter)">' + ICON_X + '</a></li>' +
          '<li><a href="https://www.linkedin.com/company/postgraduate-program-geographic-information-systems-nkua/" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICON_LI + '</a></li>' +
        '</ul></div>' +
      '<div><h4 data-en="Explore" data-el="Πλοήγηση">Explore</h4><ul>' +
        '<li><a href="' + NAV[0].href + '" data-en="About" data-el="Σχετικά">About</a></li>' +
        '<li><a href="' + NAV[1].href + '" data-en="Admissions" data-el="Εισαγωγή">Admissions</a></li>' +
        '<li><a href="' + NAV[2].href + '" data-en="Curriculum" data-el="Πρόγραμμα Σπουδών">Curriculum</a></li>' +
        '<li><a href="' + NAV[3].href + '" data-en="Student Life" data-el="Φοιτητική Ζωή">Student Life</a></li>' +
        '<li><a href="#/about/quality-assurance" data-en="Quality Assurance" data-el="Διασφάλιση Ποιότητας">Quality Assurance</a></li>' +
      '</ul></div>' +
      '<div class="contact"><h4 data-en="Contact" data-el="Επικοινωνία">Contact</h4>' +
        '<div><span data-en="Faculty of Geology and Geoenvironment" data-el="Τμήμα Γεωλογίας και Γεωπεριβάλλοντος">Faculty of Geology and Geoenvironment</span>' +
        '<span data-en="National and Kapodistrian University of Athens" data-el="Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών">National and Kapodistrian University of Athens</span></div>' +
        '<div><span data-en="University Campus, 157 84 Zografou, Athens" data-el="Πανεπιστημιούπολη, 157 84 Ζωγράφου, Αθήνα">University Campus, 157 84 Zografou, Athens</span></div>' +
        '<div><span class="mono">+30 210 727 4378</span><span class="mono">gis@geol.uoa.gr</span></div>' +
      '</div></div>' +
      '<div class="foot-bar">' +
        '<span data-en="© 2026 GIS Master&#39;s Programme · NKUA" data-el="© 2026 ΠΜΣ GIS · ΕΚΠΑ">© 2026 GIS Master&#39;s Programme · NKUA</span>' +
        '<span><a href="#/about/quality-assurance" data-en="Quality Assurance" data-el="Διασφάλιση Ποιότητας">Quality Assurance</a> · <a href="#/about/contact" data-en="Contact" data-el="Επικοινωνία">Contact</a></span>' +
        /* Shown by setupVisitCounter() once the count arrives; stays hidden otherwise. */
        '<span class="foot-visits" role="status" hidden><span data-en="Recorded page visits" data-el="Καταγεγραμμένες επισκέψεις">Recorded page visits</span> <span data-visit-count></span></span>' +
      '</div></footer>';
  }

  function applyLang(root){
    var scope = root || document;
    scope.querySelectorAll('[data-en]').forEach(function (el){
      var v = el.getAttribute('data-' + LANG);
      if (v != null) el.textContent = v;
    });
    /* localize aria-label for icon-only controls (menu/close/language) — this
       mechanism existed in the markup but was never wired, so the EL site
       exposed English control names to screen readers */
    scope.querySelectorAll('[data-en-label]').forEach(function (el){
      var v = el.getAttribute('data-' + LANG + '-label');
      if (v != null) el.setAttribute('aria-label', v);
    });
    scope.querySelectorAll('.brand-uoa--en').forEach(function (el){ el.style.display = (LANG === 'en') ? 'block' : 'none'; });
    scope.querySelectorAll('.brand-uoa--el').forEach(function (el){ el.style.display = (LANG === 'el') ? 'block' : 'none'; });
    document.documentElement.lang = LANG;
  }
  function setLang(l){
    if (l !== 'en' && l !== 'el') return;
    LANG = l; applyLang(document);
    if (typeof routeTitle === 'function') document.title = routeTitle();
    document.querySelectorAll('.lang button').forEach(function (b){
      b.classList.toggle('on', b.getAttribute('data-lang') === LANG);
    });
  }
  function wireLangButtons(){
    document.querySelectorAll('.lang button').forEach(function (b){
      b.addEventListener('click', function (){
        var t = b.getAttribute('data-lang');
        if (t === LANG) return;
        /* Routes are identical strings on both hosts — carry the hash across so
           the reader keeps their place instead of landing on the other home. */
        if (ON_SITE) location.href = ((t === 'el') ? EL_HOST : EN_HOST) + location.hash;
        else setLang(t);
      });
    });
  }
  function wireMobileMenu(){
    var mb = document.querySelector('.menu-btn');
    var mn = document.getElementById('gis-mnav');
    var scrim = document.querySelector('.mobile-nav-scrim');
    var closeBtn = mn && mn.querySelector('.mobile-nav-close');
    if (!mb || !mn) return;
    /* Drawer starts closed: keep it out of the tab order and the a11y tree.
       `inert` blocks focus/pointer/AT on the whole subtree, so the ~20 links
       inside can't be tabbed to while the transform hides them. */
    if (!mn.classList.contains('open')) mn.inert = true;
    function focusables(){
      return mn.querySelectorAll('a[href], button:not([disabled])');
    }
    function open(){
      mn.classList.add('open');
      if (scrim) scrim.hidden = false;
      mb.setAttribute('aria-expanded', 'true');
      mn.setAttribute('aria-hidden', 'false');
      mn.inert = false;
      document.documentElement.classList.add('gis-nav-open');
      /* Move focus into the drawer: the close button if present, else the
         first focusable. The toggle (mb) is where focus returns on close. */
      if (closeBtn) closeBtn.focus();
      else { var list = focusables(); if (list.length) list[0].focus(); }
    }
    function close(){
      mn.classList.remove('open');
      if (scrim) scrim.hidden = true;
      mb.setAttribute('aria-expanded', 'false');
      mn.setAttribute('aria-hidden', 'true');
      mn.inert = true;
      document.documentElement.classList.remove('gis-nav-open');
      mb.focus();
    }
    mb.addEventListener('click', function (){
      if (mn.classList.contains('open')) close(); else open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);
    mn.querySelectorAll('a').forEach(function (a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e){
      if (!mn.classList.contains('open')) return;
      if (e.key === 'Escape'){ close(); return; }
      /* Focus trap: cycle Tab / Shift+Tab within the drawer while open. */
      if (e.key === 'Tab'){
        var list = focusables();
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first){
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* Mega-menu: dismiss the panel once a submenu link is chosen. The topbar
     survives SPA navigation, so the CSS :hover/:focus-within state would
     otherwise hold the panel open over the new page. `.is-dismissed` force-
     hides it; re-arm when the pointer leaves or focus re-enters the item. */
  function wireMegaMenuDismiss(){
    document.addEventListener('click', function (e){
      var link = e.target && e.target.closest ? e.target.closest('.g-submenu a') : null;
      if (!link) return;
      var item = link.closest('.g-nav-item');
      if (!item) return;
      link.blur();
      item.classList.add('is-dismissed');
      var clear = function (){ item.classList.remove('is-dismissed'); };
      item.addEventListener('mouseleave', clear, { once:true });
      item.addEventListener('focusin', clear, { once:true });
    });
  }

  function wireReveal(){
    if (!('IntersectionObserver' in window)) return;
    var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) return;
    var root = document.getElementById('gis-app') || null;
    /* Everything except the hero — hero stays instantly visible so the fold isn't blank */
    var targets = document.querySelectorAll('#gis-app main > section:not(.hero), #gis-app main > .strip');
    if (!targets.length) return;
    targets.forEach(function (el){ el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries){
      entries.forEach(function (entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { root: root, threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el){ io.observe(el); });
  }

  function define(name, html){
    if (customElements.get(name)) return;
    customElements.define(name, class extends HTMLElement {
      connectedCallback(){ if (!this._done){ this._done = true; this.innerHTML = html(this); } }
    });
  }
  define('gis-topbar', function (el){ return topbarHTML(el.getAttribute('current') || ''); });
  define('gis-footer', function (){ return footerHTML(); });

  /* ── Visit counter ─────────────────────────────────────────────────────
     One visit per browser session, kept by the counter service of the NKUA
     sites. No cookies; the service stores only the total. Runs on the live
     domains only, so local previews are not counted. The EN and EL domains
     share one total. */
  var VISITS_ENDPOINT = 'https://evelpidou.nkua.cloud/api/visits/msc-gis';
  var VISITS_KEY = 'msc-gis-visit-counted-v1';
  function setupVisitCounter(){
    if (!ON_SITE || !window.fetch) return;
    var counted = false;
    try { counted = window.sessionStorage.getItem(VISITS_KEY) === 'yes'; } catch (e) { counted = false; }
    window.fetch(VISITS_ENDPOINT, {
      method: counted ? 'GET' : 'POST',
      cache: 'no-store',
      credentials: 'omit',
      headers: { Accept: 'application/json' }
    }).then(function (r){
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d){
      var n = Number(d.count);
      if (!isFinite(n) || n < 0) throw new Error('Invalid visit count');
      if (!counted) { try { window.sessionStorage.setItem(VISITS_KEY, 'yes'); } catch (e) { /* counting works without storage */ } }
      var box = document.querySelector('#gis-app .foot-visits');
      var out = box && box.querySelector('[data-visit-count]');
      if (!out) return;
      out.textContent = n.toLocaleString(LANG === 'el' ? 'el' : 'en');
      box.hidden = false;
    }).catch(function (){ /* the footer stays as it is when the counter is unreachable */ });
  }
  setupVisitCounter();

  /* ── SPA router — fetches page fragments from CONTENT_BASE ─────────── */
  function currentRoute(){
    var h = location.hash.slice(1) || '/';
    if (ROUTES[h]) return ROUTES[h];
    /* Dynamic per-professor profile pages: /about/staff/<slug> -> about-staff-<slug>.html */
    var m = h.match(/^\/about\/staff\/([a-z0-9-]+)$/);
    if (m) return { file:'about-staff-' + m[1], section:'about' };
    /* Dynamic per-item news pages: /news/<slug> -> news-<slug>.html */
    var n = h.match(/^\/news\/([a-z0-9-]+)$/);
    if (n) return { file:'news-' + n[1], section:'news' };
    return { file:'__404', section:'' };
  }
  function currentSubKey(){
    var parts = (location.hash.slice(1) || '/').split('/').filter(Boolean);
    return parts.length >= 2 ? parts[1] : '';
  }
  function updateNavCurrent(section, subKey){
    /* Highlight the section on the top-level nav item and the specific
       subpage inside the submenu (desktop and mobile). */
    document.querySelectorAll('.g-nav-item > a[data-key], .mob-section > summary [data-key], .mob-top[data-key]').forEach(function (el){
      if (el.getAttribute('data-key') === section) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    document.querySelectorAll('.g-submenu a[data-key], .mob-sub a[data-key]').forEach(function (el){
      if (el.getAttribute('data-key') === subKey) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    /* Auto-expand the drawer accordion for the active section */
    document.querySelectorAll('.mob-section').forEach(function (el){
      el.open = el.getAttribute('data-key') === section;
    });
  }
  /* Error views. Both are generated here rather than fetched as fragments —
     they must render even when fetching is exactly what failed. Layout and
     classes mirror the regular pages (hero frontispiece + article), so they
     read as designed pages, not browser accidents. */
  function errDestinationsHTML(){
    return '<section class="gis-article">' +
      '<div class="gis-article__aside">' +
        '<span class="gis-article__index" aria-hidden="true">01</span>' +
        '<h2 class="gis-article__title" data-en="Useful destinations" data-el="Χρήσιμοι προορισμοί">Useful destinations</h2>' +
      '</div>' +
      '<div class="gis-article__body">' +
        '<ul class="gis-list">' +
          '<li class="gis-list__item"><span class="gis-list__code" aria-hidden="true">01</span>' +
            '<p class="gis-list__title" data-en="Home" data-el="Αρχική σελίδα">Home</p>' +
            '<a class="gis-list__meta" href="#/" data-en="Open →" data-el="Μετάβαση →">Open →</a></li>' +
          '<li class="gis-list__item"><span class="gis-list__code" aria-hidden="true">02</span>' +
            '<p class="gis-list__title" data-en="The programme" data-el="Το Πρόγραμμα">The programme</p>' +
            '<a class="gis-list__meta" href="#/about/programme" data-en="Open →" data-el="Μετάβαση →">Open →</a></li>' +
          '<li class="gis-list__item"><span class="gis-list__code" aria-hidden="true">03</span>' +
            '<p class="gis-list__title" data-en="How to apply" data-el="Υποβολή αίτησης">How to apply</p>' +
            '<a class="gis-list__meta" href="#/admissions/apply" data-en="Open →" data-el="Μετάβαση →">Open →</a></li>' +
          '<li class="gis-list__item"><span class="gis-list__code" aria-hidden="true">04</span>' +
            '<p class="gis-list__title" data-en="News &amp; events" data-el="Νέα &amp; εκδηλώσεις">News &amp; events</p>' +
            '<a class="gis-list__meta" href="#/news" data-en="Open →" data-el="Μετάβαση →">Open →</a></li>' +
          '<li class="gis-list__item"><span class="gis-list__code" aria-hidden="true">05</span>' +
            '<p class="gis-list__title" data-en="Contact the Secretariat" data-el="Επικοινωνία με τη Γραμματεία">Contact the Secretariat</p>' +
            '<a class="gis-list__meta" href="#/about/contact" data-en="Open →" data-el="Μετάβαση →">Open →</a></li>' +
        '</ul>' +
      '</div>' +
    '</section>';
  }
  function notFoundHTML(){
    return '<div class="gis-scope"><div class="gis-wrap">' +
      '<header class="gis-hero">' +
        '<div class="gis-hero__inner">' +
          '<p class="gis-hero__eyebrow" data-en="Error 404" data-el="Σφάλμα 404">Error 404</p>' +
          '<h1 class="gis-hero__title" data-en="Page not found" data-el="Η σελίδα δεν βρέθηκε">Page not found</h1>' +
          '<div class="gis-hero__rule" aria-hidden="true"></div>' +
          '<p class="gis-hero__standfirst" data-en="The address you followed does not exist or may have moved. The destinations below cover most of what visitors look for." data-el="Η διεύθυνση που ακολουθήσατε δεν υπάρχει ή έχει μετακινηθεί. Οι παρακάτω προορισμοί καλύπτουν όσα αναζητούν συνήθως οι επισκέπτες.">The address you followed does not exist or may have moved. The destinations below cover most of what visitors look for.</p>' +
        '</div>' +
      '</header>' +
      errDestinationsHTML() +
    '</div></div>';
  }
  function loadErrorHTML(){
    return '<div class="gis-scope"><div class="gis-wrap">' +
      '<header class="gis-hero">' +
        '<div class="gis-hero__inner">' +
          '<p class="gis-hero__eyebrow" data-en="Loading error" data-el="Σφάλμα φόρτωσης">Loading error</p>' +
          '<h1 class="gis-hero__title" data-en="The page could not load" data-el="Η σελίδα δεν ήταν δυνατό να φορτωθεί">The page could not load</h1>' +
          '<div class="gis-hero__rule" aria-hidden="true"></div>' +
          '<p class="gis-hero__standfirst" data-en="A network or server problem interrupted the load. Check your connection and try again." data-el="Ένα πρόβλημα δικτύου ή διακομιστή διέκοψε τη φόρτωση. Ελέγξτε τη σύνδεσή σας και προσπαθήστε ξανά.">A network or server problem interrupted the load. Check your connection and try again.</p>' +
        '</div>' +
      '</header>' +
      '<aside class="gis-cta">' +
        '<div>' +
          '<p class="gis-cta__title" data-en="Ready when you are" data-el="Μόλις είστε έτοιμοι">Ready when you are</p>' +
          '<p class="gis-cta__desc" data-en="Reload just this page — no need to restart from the beginning." data-el="Επαναφορτώστε μόνο αυτή τη σελίδα — δεν χρειάζεται να ξεκινήσετε από την αρχή.">Reload just this page — no need to restart from the beginning.</p>' +
        '</div>' +
        '<button class="gis-btn gis-err-retry" type="button" data-en="Try again →" data-el="Προσπαθήστε ξανά →">Try again →</button>' +
      '</aside>' +
    '</div></div>';
  }
  /* Roster filter tabs — show/hide sections by [data-group]. Filtering runs
     inside a View Transition where supported (cards glide to their new grid
     positions); a sliding ink underline tracks the active tab; portrait
     grids cascade in on scroll. Progressive enhancement throughout: no JS →
     all sections visible; no startViewTransition → instant toggle.
     rosterIO/rosterOff are torn down on every loadPage. */
  var rosterIO = null, rosterOff = null;
  function wirePortraitTabs(root){
    if (rosterIO){ rosterIO.disconnect(); rosterIO = null; }
    if (rosterOff){ rosterOff(); rosterOff = null; }
    var tabs = root.querySelector('.gis-portrait-tabs');
    if (!tabs) return;
    var buttons = [].slice.call(tabs.querySelectorAll('button[data-filter]'));
    var groups  = [].slice.call(root.querySelectorAll('.gis-section[data-group]'));
    var reduce  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* sliding ink underline (tabs container is position:relative) */
    var ink = document.createElement('span');
    ink.className = 'gis-roster-ink';
    ink.setAttribute('aria-hidden', 'true');
    tabs.appendChild(ink);
    function moveInk(){
      var b = tabs.querySelector('button[aria-pressed="true"]') || buttons[0];
      if (!b) return;
      ink.style.width = b.offsetWidth + 'px';
      ink.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    }

    /* unique view-transition-names so the browser can animate each card's
       old→new position when the filter changes */
    var supportsVT = typeof document.startViewTransition === 'function';
    if (supportsVT){
      groups.forEach(function (g, i){ g.style.viewTransitionName = 'gis-rs-' + (i + 1); });
      [].slice.call(root.querySelectorAll('.gis-portrait')).forEach(function (p, i){
        p.style.viewTransitionName = 'gis-rp-' + (i + 1);
      });
    }

    function apply(f){
      groups.forEach(function (g){ g.hidden = !(f === 'all' || g.getAttribute('data-group') === f); });
      buttons.forEach(function (b){ b.setAttribute('aria-pressed', b.getAttribute('data-filter') === f ? 'true' : 'false'); });
      moveInk();
    }
    buttons.forEach(function (b){
      b.addEventListener('click', function (){
        var f = b.getAttribute('data-filter');
        if (supportsVT && !reduce) document.startViewTransition(function (){ apply(f); });
        else apply(f);
      });
    });
    apply('all');

    /* keep the ink aligned through resizes and EN↔EL label changes */
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(moveInk) : null;
    if (ro){ ro.observe(tabs); buttons.forEach(function (b){ ro.observe(b); }); }
    window.addEventListener('resize', moveInk, { passive: true });
    rosterOff = function (){
      if (ro) ro.disconnect();
      window.removeEventListener('resize', moveInk);
    };

    /* cascade reveal — one observer entry per grid, per-card stagger via --pd */
    var roster = root.querySelector('.gis-roster');
    if (roster && !reduce && 'IntersectionObserver' in window){
      roster.classList.add('js-roster');
      var grids = [].slice.call(root.querySelectorAll('.gis-portrait-grid'));
      grids.forEach(function (g){
        [].slice.call(g.querySelectorAll('.gis-portrait')).forEach(function (p, i){
          p.style.setProperty('--pd', Math.min(i, 10) * 55 + 'ms');
        });
      });
      rosterIO = new IntersectionObserver(function (entries){
        entries.forEach(function (e){
          if (e.isIntersecting){ e.target.classList.add('in-view'); rosterIO.unobserve(e.target); }
        });
      }, { root: document.getElementById('gis-app'), threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      grids.forEach(function (g){ rosterIO.observe(g); });
    }
  }

  /* Gallery (about-gallery) — "The Descent" film engine: scroll reveals,
     altitude HUD (piecewise-log between [data-alt] waypoints), parallax on
     [data-plx] layers, Ken Burns gating, image load fade, and the <dialog>
     lens. galIO + the rAF scroll engine are torn down on every loadPage so
     detached DOM is never pinned. No-op on pages without a .gis-gal root. */
  var galIO = null, galFilmOff = null;
  function wireGalleryFilm(gal, reduce){
    /* rAF-throttled scroll engine on #gis-app (the real scroll container).
       Writes transforms only — no layout mutations — so it holds 60fps. */
    var app  = document.getElementById('gis-app');
    var film = gal.querySelector('.gis-gal-film');
    if (!app || !film || reduce) return;
    /* add on the next painted frame so the HUD's opacity transition runs */
    requestAnimationFrame(function (){ gal.classList.add('js-live'); });
    var hudVal  = gal.querySelector('.gis-gal-hud__value');
    var hudFill = gal.querySelector('.gis-gal-hud__fill');
    var plx = [].slice.call(gal.querySelectorAll('[data-plx]')).map(function (el){
      return { el: el, ref: el.parentNode, d: (parseFloat(el.getAttribute('data-plx')) || 6) / 100 };
    });
    var marks = [].slice.call(gal.querySelectorAll('[data-alt]')).map(function (el){
      return { el: el, ln: Math.log(Math.max(1, parseFloat(el.getAttribute('data-alt')) || 1)) };
    });
    function fmtAlt(m){
      if (m >= 9950) return Math.round(m / 1000) + ' KM';
      if (m >= 1000) return (m / 1000).toFixed(1) + ' KM';
      return Math.max(1, Math.round(m)) + ' M';
    }
    var ticking = false;
    function frame(){
      ticking = false;
      var vh = app.clientHeight || window.innerHeight;
      var i, r;
      var fr = film.getBoundingClientRect();
      /* retire the HUD once the film has scrolled past (footer territory) */
      gal.classList.toggle('is-postfilm', fr.bottom < vh * 0.7);
      /* descent progress bar */
      if (hudFill){
        var span = fr.height - vh;
        var p = span > 0 ? Math.min(1, Math.max(0, -fr.top / span)) : 0;
        hudFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      /* altitude readout — log-interpolate between waypoints as their
         centres cross the 60%-viewport reference line */
      if (hudVal && marks.length){
        var yRef = vh * 0.6, lnAlt = marks[0].ln, prev = null;
        for (i = 0; i < marks.length; i++){
          r = marks[i].el.getBoundingClientRect();
          var d = (r.top + r.height / 2) - yRef;
          if (d > 0){
            if (prev !== null){
              var t = (-prev.d) / (d - prev.d);
              lnAlt = prev.ln + (marks[i].ln - prev.ln) * Math.min(1, Math.max(0, t));
            }
            break;
          }
          prev = { ln: marks[i].ln, d: d };
          lnAlt = marks[i].ln;
        }
        hudVal.textContent = fmtAlt(Math.exp(lnAlt));
      }
      /* parallax layers — amplitude is d% of the (untransformed) parent box */
      for (i = 0; i < plx.length; i++){
        var e = plx[i];
        r = e.ref.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) continue;
        var q = (vh - r.top) / (vh + r.height);
        q = Math.min(1, Math.max(0, q));
        e.el.style.transform = 'translate3d(0,' + ((q - 0.5) * 2 * e.d * r.height).toFixed(1) + 'px,0)';
      }
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }
    app.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    galFilmOff = function (){
      app.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    frame();
  }
  function wireGallery(root){
    if (galIO){ galIO.disconnect(); galIO = null; }
    if (galFilmOff){ galFilmOff(); galFilmOff = null; }
    var gal = root.querySelector('.gis-gal');
    if (!gal) return;
    var plates  = [].slice.call(gal.querySelectorAll('.gis-gal-plate'));
    var reveals = [].slice.call(gal.querySelectorAll('[data-reveal]'));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* fade each image in as it finishes decoding */
    gal.querySelectorAll('.gis-gal-frame img, .gis-gal-title__back img').forEach(function (img){
      if (img.complete && img.naturalWidth > 0) img.classList.add('is-loaded');
      else img.addEventListener('load', function (){ img.classList.add('is-loaded'); });
    });

    /* reveals — root is #gis-app (the real scroll container) */
    if (!reduce && 'IntersectionObserver' in window){
      gal.classList.add('js-reveal');
      galIO = new IntersectionObserver(function (entries){
        entries.forEach(function (e){
          if (e.isIntersecting){ e.target.classList.add('in-view'); galIO.unobserve(e.target); }
        });
      }, { root: document.getElementById('gis-app'), threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      plates.forEach(function (p){ galIO.observe(p); });
      reveals.forEach(function (h){ galIO.observe(h); });
    } else {
      plates.forEach(function (p){ p.classList.add('in-view'); });
      reveals.forEach(function (h){ h.classList.add('in-view'); });
    }

    /* the film engine (HUD + parallax) */
    wireGalleryFilm(gal, reduce);

    /* the lens */
    var lens = gal.querySelector('.gis-gal-lens');
    if (!lens || !window.HTMLDialogElement) return;
    var lensImg   = lens.querySelector('.gis-gal-lens__img');
    var lensCap   = lens.querySelector('.gis-gal-lens__cap');
    var lensCount = lens.querySelector('.gis-gal-lens__count');
    var idx = 0;
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function show(i){
      idx = (i + plates.length) % plates.length;
      var p   = plates[idx];
      var img = p.querySelector('img');
      var txt = p.querySelector('.gis-gal-cap__txt');
      lensImg.src = img.currentSrc || img.src;
      lensImg.alt = txt ? (txt.getAttribute('data-' + LANG) || txt.textContent || '') : '';
      if (txt){
        lensCap.setAttribute('data-en', txt.getAttribute('data-en') || txt.textContent);
        lensCap.setAttribute('data-el', txt.getAttribute('data-el') || txt.textContent);
      }
      lensCount.textContent = pad(idx + 1) + ' / ' + pad(plates.length);
      applyLang(lens);
    }
    plates.forEach(function (p, i){
      var btn = p.querySelector('.gis-gal-open');
      if (btn) btn.addEventListener('click', function (){
        show(i);
        lens.showModal();
        var nx = lens.querySelector('[data-lens="next"]:not(.gis-gal-lens__img-btn)');
        if (nx) nx.focus();
      });
    });
    function closeLens(){
      if (!lens.open) return;
      lens.classList.add('is-closing');
      var done = false;
      var finish = function (){
        if (done) return; done = true;
        lens.classList.remove('is-closing');
        if (lens.open) lens.close();
      };
      lens.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 350); /* reduced-motion kills animationend — never wait forever */
    }
    lens.addEventListener('click', function (e){
      var b = e.target && e.target.closest ? e.target.closest('[data-lens]') : null;
      if (b){
        var k = b.getAttribute('data-lens');
        if (k === 'prev') show(idx - 1);
        else if (k === 'next') show(idx + 1);
        else closeLens();
        return;
      }
      if (e.target === lens) closeLens(); /* backdrop click */
    });
    lens.addEventListener('cancel', function (e){ e.preventDefault(); closeLens(); });
    lens.addEventListener('keydown', function (e){
      if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
    /* touch swipe */
    var sx = null, sy = null;
    lens.addEventListener('pointerdown', function (e){ sx = e.clientX; sy = e.clientY; }, { passive: true });
    lens.addEventListener('pointerup', function (e){
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > 2 * Math.abs(dy)) show(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });
  }

  /* ── Internal admin gate ──────────────────────────────────────────────
     Reveals the admin vault only after a PBKDF2-SHA-256 passphrase check
     against a hash-only config file. This keeps the (already-public) archive
     off casual view and out of every menu; it is not a confidentiality
     boundary. sessionStorage remembers a successful unlock for the tab. */
  function hexToBytes(hex){
    hex = String(hex || '');
    var a = new Uint8Array(hex.length / 2);
    for (var i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16);
    return a;
  }
  function bytesToHex(buf){
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += ('0' + b[i].toString(16)).slice(-2);
    return s;
  }
  function verifyAdminPass(pass){
    if (!pass) return Promise.resolve(false);
    if (!(window.crypto && crypto.subtle)) return Promise.resolve(false);
    return fetch(ADMIN_CONFIG, { cache: 'no-store' })
      .then(function (r){ if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (cfg){
        var salt = hexToBytes(cfg.salt);
        var iter = cfg.iterations || 100000;
        var bits = cfg.bits || 256;
        var enc = new TextEncoder();
        return crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveBits'])
          .then(function (key){
            return crypto.subtle.deriveBits(
              { name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, key, bits);
          })
          .then(function (out){ return bytesToHex(out) === String(cfg.hash).toLowerCase(); });
      });
  }
  function wireAdmin(root){
    var el = (root || document).querySelector('#gis-admin');
    if (!el) return;
    var gate  = el.querySelector('#gis-admin-gate');
    var vault = el.querySelector('#gis-admin-vault');
    var form  = el.querySelector('#gis-admin-form');
    var input = el.querySelector('#gis-admin-pass');
    var errEl = el.querySelector('#gis-admin-error');
    var lockBtn = el.querySelector('#gis-admin-lock');
    var homeView = el.querySelector('#gis-admin-home');
    var cyclesView = el.querySelector('#gis-admin-cycles');
    if (!gate || !vault) return;
    function showView(name){
      if (homeView) homeView.hidden = (name !== 'home');
      if (cyclesView) cyclesView.hidden = (name !== 'cycles');
    }
    function unlock(){
      gate.hidden = true; vault.hidden = false;
      if (lockBtn) lockBtn.hidden = false;
      showView('home');
      try { sessionStorage.setItem('gis-admin-ok', '1'); } catch (e){}
    }
    function lock(){
      vault.hidden = true; gate.hidden = false;
      if (lockBtn) lockBtn.hidden = true;
      showView('home');
      try { sessionStorage.removeItem('gis-admin-ok'); } catch (e){}
      if (input){ input.value = ''; input.focus(); }
    }
    var authed = false;
    try { authed = sessionStorage.getItem('gis-admin-ok') === '1'; } catch (e){}
    if (authed) unlock(); else { gate.hidden = false; vault.hidden = true; if (lockBtn) lockBtn.hidden = true; }
    if (lockBtn) lockBtn.addEventListener('click', lock);
    el.querySelectorAll('[data-admin-open]').forEach(function (b){
      b.addEventListener('click', function (){ showView(b.getAttribute('data-admin-open')); });
    });
    el.querySelectorAll('[data-admin-back]').forEach(function (b){
      b.addEventListener('click', function (){ showView('home'); });
    });
    if (form) form.addEventListener('submit', function (e){
      e.preventDefault();
      if (errEl) errEl.hidden = true;
      verifyAdminPass(input ? input.value : '').then(function (ok){
        if (ok) unlock();
        else if (errEl){ errEl.hidden = false; if (input){ input.value = ''; input.focus(); } }
      }).catch(function (){ if (errEl) errEl.hidden = false; });
    });
  }

  /* Per-route document.title (hash routing never changed it before → every
     route shared the shell's tab/bookmark/history title). Derived from NAV so
     the label matches the nav, in the active language. */
  var SITE_TITLE = { en: "GIS Master's Programme · NKUA", el: 'ΠΜΣ GIS · ΕΚΠΑ' };
  function routeTitle(){
    var h = location.hash.slice(1) || '/';
    if (h === '/' || h === '') return SITE_TITLE[LANG];
    var parts = h.split('/').filter(Boolean);
    var sectionKey = parts[0], subKey = parts[1], label = '';
    NAV.forEach(function (n){
      if (n.key !== sectionKey) return;
      label = n[LANG] || n.en;
      if (subKey && n.children) n.children.forEach(function (c){
        if (c.key === subKey) label = c[LANG] || c.en;
      });
    });
    return (label ? label + ' · ' : '') + SITE_TITLE[LANG];
  }
  function notFoundTitle(){
    return (LANG === 'el' ? 'Η σελίδα δεν βρέθηκε' : 'Page not found') + ' · ' + SITE_TITLE[LANG];
  }
  function loadErrorTitle(){
    return (LANG === 'el' ? 'Σφάλμα φόρτωσης' : 'Loading error') + ' · ' + SITE_TITLE[LANG];
  }

  /* Soft entrance for each incoming page: restart the .gis-page-in animation
     (the reflow read is what lets the same class re-trigger per navigation).
     CSS ignores it under prefers-reduced-motion. */
  function pageIn(main){
    main.classList.remove('gis-page-in');
    void main.offsetWidth;
    main.classList.add('gis-page-in');
  }

  /* Monotonic navigation token: a slow no-store fetch that resolves after a
     newer navigation must NOT clobber the newer page (documented race). */
  var loadSeq = 0;
  function loadPage(route, focusMain){
    var main = document.getElementById('main');
    if (!main) return;
    var seq = ++loadSeq;
    document.title = (route.file === '__404') ? notFoundTitle() : routeTitle();
    main.setAttribute('aria-busy','true');
    main.style.transition = 'opacity 150ms cubic-bezier(0.65, 0, 0.35, 1)';
    main.style.opacity = '0.35';
    if (route.file === '__404'){
      main.innerHTML = notFoundHTML();
      applyLang(main);
      main.removeAttribute('aria-busy');
      main.style.opacity = '';
      pageIn(main);
      return;
    }
    fetch(CONTENT_BASE + route.file + '.html', { cache:'no-store' })
      .then(function (r){ if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then(function (html){
        if (seq !== loadSeq) return; /* superseded by a newer navigation */
        main.innerHTML = html;
        applyLang(main);
        wirePortraitTabs(main);
        wireGallery(main);
        wireAdmin(main);
        updateNavCurrent(route.section, currentSubKey());
        main.removeAttribute('aria-busy');
        main.style.opacity = '';
        pageIn(main);
        var g = document.getElementById('gis-app');
        if (g) g.scrollTo(0, 0);
        window.scrollTo(0, 0);
        /* move focus to the new page's heading on real navigations (not the
           first load) so keyboard users land in the content and screen readers
           announce the new page — the swap no longer needs aria-live on <main> */
        if (focusMain){
          var target = main.querySelector('h1') || main;
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      })
      .catch(function (err){
        if (seq !== loadSeq) return; /* superseded by a newer navigation */
        /* a 404 from the server = the page genuinely doesn't exist; anything
           else (network down, 5xx) = a load problem the visitor can retry */
        var missing = err && err.message === '404';
        document.title = missing ? notFoundTitle() : loadErrorTitle();
        main.innerHTML = missing ? notFoundHTML() : loadErrorHTML();
        applyLang(main);
        wireRetry(main);
        main.removeAttribute('aria-busy');
        main.style.opacity = '';
        pageIn(main);
      });
  }
  /* "Try again" on the load-error page re-runs the current route. */
  function wireRetry(root){
    var btn = root.querySelector('.gis-err-retry');
    if (!btn) return;
    btn.addEventListener('click', function (){ loadPage(currentRoute(), true); });
  }
  function wireRouter(){
    window.addEventListener('hashchange', function (){
      /* Only '/'-prefixed hashes are routes. In-page anchors like the skip
         link's #main must be ignored, or currentRoute() 404s the whole page. */
      var h = location.hash.slice(1);
      if (h && h.charAt(0) !== '/') return;
      loadPage(currentRoute(), true); /* real navigation → move focus to heading */
    });
    loadPage(currentRoute()); /* initial load → leave focus at the top (skip link first) */
  }

  /* Skip link: move focus into the content region instead of letting #main
     reach the hash router (which would replace the page with the 404 view). */
  function wireSkipLink(){
    var skip = document.querySelector('.skip');
    var main = document.getElementById('main');
    if (!skip || !main) return;
    skip.addEventListener('click', function (e){
      e.preventDefault();
      main.setAttribute('tabindex', '-1');
      main.focus();
      var g = document.getElementById('gis-app');
      if (g) g.scrollTo(0, 0);
    });
  }

  /* In-page links inside a page fragment (href="#gis01", never "#/route"):
     scroll to the target instead of letting the hash reach the router, so the
     route hash stays in the address bar and reload/sharing keep working. A
     <details> target is opened first; the target gets .is-target for a brief
     highlight (styled per page). */
  function wireInPageLinks(){
    var main = document.getElementById('main');
    if (!main) return;
    main.addEventListener('click', function (e){
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var id = a.getAttribute('href').slice(1);
      if (!id || id.charAt(0) === '/') return;
      var t = document.getElementById(id);
      if (!t || !main.contains(t)) return;
      e.preventDefault();
      if (t.tagName === 'DETAILS') t.open = true;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      var f = (t.tagName === 'DETAILS' && t.querySelector('summary')) || t;
      if (f === t) t.setAttribute('tabindex', '-1');
      f.focus({ preventScroll: true });
      t.classList.remove('is-target');
      void t.offsetWidth; /* restart the highlight when the same target is chosen again */
      t.classList.add('is-target');
    });
  }

  function init(){
    /* drop the whole-page live region — announcing an entire swapped editorial
       page is an anti-pattern; focus-to-heading (in loadPage) is the cue now */
    var m = document.getElementById('main');
    if (m) m.removeAttribute('aria-live');
    applyLang(document); wireLangButtons(); wireMobileMenu(); wireMegaMenuDismiss(); wireSkipLink(); wireInPageLinks(); wireRouter();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.GIS = { setLang: setLang, get lang(){ return LANG; }, NAV: NAV };
})();
