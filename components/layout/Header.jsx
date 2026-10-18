"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import buttons from "@/components/ui/buttons.module.css";
import { PRODUCTS } from "@/components/pages/Lab/products";
import styles from "./HeaderBlock.module.css";
import LangSwitcher from "./LangSwitcher";
import { NavIcon } from "./navIcons";

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
      dropdown: PRODUCTS.map((product) => ({
         icon: product.icon,
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

function Dropdown({ item }) {
   return (
      <div className={styles.dropdownWrap}>
         <div className={styles.dropdown} role="menu">
            {item.dropdown.map((d, j) => (
               <a key={j} href={d.href || "/"} className={styles.ddItem} role="menuitem">
                  <span className={styles.ddIconBox}>
                     <NavIcon name={d.icon} className={styles.ddIcon} />
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

   // The home page opens on the dark hero, so the nav sits transparently on top
   // of it and only fades to the light paper bar once the user scrolls past it.
   const pathname = usePathname();
   const isHome = pathname === "/" || /^\/(en|de)\/?$/.test(pathname || "");
   // The new pages (the home story, prototype at /home-v2, and the AI Lab) stay
   // dark from top to bottom, so their nav stays dark too: transparent at the
   // top, dark glass once scrolled.
   const isNight = /^\/(?:(?:en|de)\/)?(?:home-v2|lab)(?:\/.*)?$/.test(pathname || "");
   const overlay = isHome || isNight;
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      if (!overlay) return undefined;
      const onScroll = () => setScrolled(window.scrollY > 24);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, [overlay]);

   const onDark = isHome && !scrolled && !menuOpen;
   const rootClass = [
      styles.headerRoot,
      onDark ? styles.onDark : "",
      isNight ? styles.night : "",
      isNight && (scrolled || menuOpen) ? styles.nightGlass : "",
   ].join(" ");

   const hasDropdown = (item) => Array.isArray(item.dropdown) && item.dropdown.length > 0;

   return (
      <div className={overlay ? `${styles.headerOverlay} ${isNight ? styles.nightWrap : ""}` : undefined}>
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
