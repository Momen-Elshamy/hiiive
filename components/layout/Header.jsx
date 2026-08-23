"use client";
import { useState } from "react";
import styles from "./HeaderBlock.module.css";
import LangSwitcher from "./LangSwitcher";
import { NavIcon } from "./navIcons";

export const defaultNavItems = [
   {
      label: "Studio",
      href: "/studio",
      dropdown: [
         { icon: "code", title: "AI software & internal tools", badge: "", description: "Custom systems and agents that take real work off your team.", href: "/studio#ai-software" },
         { icon: "rocket", title: "MVP design & build", badge: "", description: "From idea to a product in users' hands — weeks, not quarters.", href: "/studio#mvp" },
         { icon: "search", title: "Organic visibility (SEO)", badge: "", description: "AI-native search: built to be found by people and by models.", href: "/studio#seo" },
         { icon: "funnel", title: "Digital presence & funnels", badge: "", description: "Sites, funnels and conversion structure that turn traffic into pipeline.", href: "/studio#funnels" },
         { icon: "sparkles", title: "AI transformation & consulting", badge: "", description: "Audit, roadmap and enablement — so the change actually sticks.", href: "/studio#consulting" },
      ],
      dropdownFooterLabel: "Explore Studio",
      dropdownFooterHref: "/studio",
   },
   { label: "Lab", href: "/lab" },
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

   const hasDropdown = (item) => Array.isArray(item.dropdown) && item.dropdown.length > 0;

   return (
      <>
         <header className={styles.headerRoot}>
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
                  <a href={ctaLink} className={styles.headerCta}>
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
            <a href={ctaLink} onClick={closeMenu} className={styles.mobileMenuCta}>
               {cta}
            </a>
         </nav>
      </>
   );
}
