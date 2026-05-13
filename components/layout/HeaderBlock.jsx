
"use client";
import { useState } from "react";
import styles from "./HeaderBlock.module.css";

const defaultNavItems = [
   { label: "Mission", href: "#mission" },
   { label: "Services", href: "#model" },
   { label: "Portfolio", href: "#portfolio" },
   { label: "FAQ", href: "#faq" },
   { label: "Build With Us", href: "#contact" },
];

export default function Header({ logoText, navItems }) {
   const items = Array.isArray(navItems) && navItems.length > 0 ? navItems : defaultNavItems;
   const [menuOpen, setMenuOpen] = useState(false);

   const closeMenu = () => setMenuOpen(false);

   return (
      <>
         <header className={styles.headerRoot}>
            <div className={styles.headerInner}>
               <a href="/" className={styles.headerLogo}>
                  {logoText || "HIIIVE"}
               </a>

               {/* Desktop nav */}
               <nav className={styles.headerNav} aria-label="Primary">
                  {items.map((item, i) => (
                     <a
                        key={i}
                        href={item.href || "/"}
                        className={`${styles.headerNavLink} ${i === items.length - 1 ? styles.headerNavCta : ""}`}
                     >
                        {item.label || "Link"}
                     </a>
                  ))}
               </nav>

               {/* Hamburger button (mobile only) */}
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

         {/* Mobile dropdown */}
         <nav
            id="mobile-menu"
            className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
            aria-label="Mobile navigation"
         >
            {items.map((item, i) => (
               <a
                  key={i}
                  href={item.href || "/"}
                  onClick={closeMenu}
                  className={`${styles.mobileMenuLink} ${i === items.length - 1 ? styles.mobileMenuCta : ""}`}
               >
                  {item.label || "Link"}
               </a>
            ))}
         </nav>
      </>
   );
}

export const HeaderBlock = {
   label: "Header",
   fields: {
      logoText: { type: "text" },
      navItems: {
         type: "array",
         arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
         },
         defaultItemProps: { label: "Link", href: "/" },
         getItemSummary: (item) => item.label || "Link",
      },
   },
   defaultProps: {
      logoText: "HIIIVE",
      navItems: defaultNavItems,
   },
   render: ({ logoText, navItems }) => (
      <Header logoText={logoText} navItems={navItems} />
   ),
};