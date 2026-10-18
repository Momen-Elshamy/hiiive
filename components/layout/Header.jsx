"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import buttons from "@/components/ui/buttons.module.css";
import { labProducts } from "@/components/pages/Lab/products";
import styles from "./HeaderBlock.module.css";
import LangSwitcher from "./LangSwitcher";
import { NavIcon, isMark } from "./navIcons";

// The fallback nav (and the CMS block's defaults). The live nav is edited in
// the CMS: Admin → Globals → Header, in each language.
export const defaultNavItems = [
   {
      label: "AI Engineering",
      href: "/ai-engineering",
      dropdown: [
         { icon: "code", title: "AI software & internal tools", badge: "", description: "Custom systems and agents that take real work off your team.", href: "/ai-engineering#ai-software" },
         { icon: "rocket", title: "MVP design & build", badge: "", description: "From idea to a product in users' hands — weeks, not quarters.", href: "/ai-engineering/mvp-build" },
         { icon: "sparkles", title: "AI transformation & consulting", badge: "", description: "Audit, roadmap and enablement — so the change actually sticks.", href: "/ai-engineering#consulting" },
      ],
      dropdownFooterLabel: "Explore AI Engineering",
      dropdownFooterHref: "/ai-engineering",
   },
   { label: "Work", href: "/work" },
   {
      label: "AI Lab",
      href: "/lab",
      dropdown: labProducts("en").map((product) => ({
         icon: product.icon, // the product's own mark
         title: product.name,
         badge: "",
         description: product.menu,
         href: `/lab/${product.slug}`,
      })),
      dropdownFooterLabel: "Explore AI Lab",
      dropdownFooterHref: "/lab",
   },
   { label: "About", href: "/about" },
];

function Caret() {
   return (
      <svg className={styles.navCaret} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
         <path d="m6 9 6 6 6-6" />
      </svg>
   );
}

// A link to an AI Lab product (/lab/<slug>, any language) always shows that
// product's own mark, whatever icon the CMS item was given.
const LAB_LINK = /\/lab\/([a-z0-9-]+)\/?(?:[?#].*)?$/;
function iconFor(d) {
   const slug = (d.href || "").match(LAB_LINK)?.[1];
   return slug && isMark(slug) ? slug : d.icon;
}

function Dropdown({ item }) {
   return (
      <div className={styles.dropdownWrap}>
         <div className={styles.dropdown} role="menu">
            {item.dropdown.map((d, j) => (
               <a key={j} href={d.href || "/"} className={styles.ddItem} role="menuitem">
                  <span className={styles.ddIconBox}>
                     <NavIcon name={iconFor(d)} className={styles.ddIcon} />
                  </span>
                  <span className={styles.ddBody}>
                     <span className={styles.ddTitleRow}>
                        <span className={styles.ddTitle}>{d.title}</span>
                        {d.badge ? <span className={styles.ddBadge}>{d.badge}</span> : null}
                     </span>
                     {d.description ? <span className={styles.ddDesc}>{d.description}</span> : null}
                  </span>
               </a>
            ))}
            {item.dropdownFooterLabel ? (
               <a href={item.dropdownFooterHref || "/"} className={styles.ddFooter}>
                  <span>{item.dropdownFooterLabel}</span>
                  <NavIcon name="arrow-right" className={styles.ddFooterArrow} />
               </a>
            ) : null}
         </div>
      </div>
   );
}

export default function Header({ logoText, navItems, contactEmail, ctaLabel, ctaHref }) {
   const items = Array.isArray(navItems) && navItems.length > 0 ? navItems : defaultNavItems;
   const email = contactEmail || "hello@hiiive.ai";
   const cta = ctaLabel || "Book a call";
   const ctaLink = ctaHref || `mailto:${email}`;
   const [menuOpen, setMenuOpen] = useState(false);
   const closeMenu = () => setMenuOpen(false);

   // The new pages (the home story and the AI Lab) stay dark from top to
   // bottom, so their nav does too: it floats transparently over the page at
   // the top and turns to dark glass once the page scrolls.
   const pathname = usePathname() || "/";
   const isHome = pathname === "/" || /^\/(?:en|de)\/?$/.test(pathname);
   const isNight = isHome || /^\/(?:(?:en|de)\/)?(?:home-v2|lab)(?:\/.*)?$/.test(pathname);
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      if (!isNight) return undefined;
      const onScroll = () => setScrolled(window.scrollY > 24);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, [isNight]);

   const rootClass = [
      styles.headerRoot,
      isNight ? styles.night : "",
      isNight && (scrolled || menuOpen) ? styles.nightGlass : "",
   ].join(" ");

   const hasDropdown = (item) => Array.isArray(item.dropdown) && item.dropdown.length > 0;

   return (
      <div className={isNight ? `${styles.headerOverlay} ${styles.nightWrap}` : undefined}>
         <header className={rootClass}>
            <div className={styles.headerInner}>
               <div className={styles.headerLeft}>
                  <a href="/" className={styles.headerLogo}>
                     {logoText || "HIIIVE"}
                  </a>
                  <nav className={styles.headerNav} aria-label="Primary">
                     {items.map((item, i) =>
                        hasDropdown(item) ? (
                           <div key={i} className={styles.navItem}>
                              <a href={item.href || "/"} className={`${styles.headerNavLink} ${styles.navTrigger}`} aria-haspopup="true">
                                 {item.label || "Link"}
                                 <Caret />
                              </a>
                              <Dropdown item={item} />
                           </div>
                        ) : (
                           <a key={i} href={item.href || "/"} className={styles.headerNavLink}>
                              {item.label || "Link"}
                           </a>
                        ),
                     )}
                  </nav>
               </div>

               <div className={styles.headerRight}>
                  <a href={`mailto:${email}`} className={styles.headerEmail}>
                     {email}
                  </a>
                  <LangSwitcher />
                  <a href={ctaLink} className={isNight ? `${buttons.button} ${buttons.primary} ${buttons.small}` : styles.headerCta}>
                     {cta}
                  </a>
               </div>

               <button
                  className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
               >
                  <span />
                  <span />
                  <span />
               </button>
            </div>
         </header>

         <nav
            id="mobile-menu"
            className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
            aria-label="Mobile navigation"
         >
            {items.map((item, i) => (
               <div key={i} className={styles.mobileGroup}>
                  <a href={item.href || "/"} onClick={closeMenu} className={styles.mobileMenuLink}>
                     {item.label || "Link"}
                  </a>
                  {hasDropdown(item)
                     ? item.dropdown.map((d, j) => (
                          <a key={j} href={d.href || "/"} onClick={closeMenu} className={styles.mobileSubLink}>
                             {d.title}
                          </a>
                       ))
                     : null}
               </div>
            ))}
            <LangSwitcher className={styles.mobileLang} />
            <a
               href={ctaLink}
               onClick={closeMenu}
               className={isNight ? `${buttons.button} ${buttons.primary} ${styles.mobileCtaNight}` : styles.mobileMenuCta}
            >
               {cta}
            </a>
         </nav>
      </div>
   );
}
