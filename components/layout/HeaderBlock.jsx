// Server module: defines the Puck block config. The render returns the
// interactive client <Header>. Keeping this file free of "use client" lets
// Puck's RSC <Render> call render() on the server and drop the non-serializable
// `puck` prop (renderDropZone, dragRef, …) before reaching the client Header.
import Header, { defaultNavItems } from "./Header";
import { navIconOptions } from "./navIcons";

export default Header;

export const HeaderBlock = {
   label: "Header",
   fields: {
      logoText: { type: "text" },
      contactEmail: { type: "text" },
      ctaLabel: { type: "text" },
      ctaHref: { type: "text" },
      navItems: {
         type: "array",
         arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
            // Optional mega-dropdown. Add rows here to turn a nav item into a
            // dropdown menu (icon + title + optional badge + description + link).
            dropdown: {
               type: "array",
               arrayFields: {
                  icon: { type: "select", options: navIconOptions },
                  title: { type: "text" },
                  badge: { type: "text" },
                  description: { type: "textarea" },
                  href: { type: "text" },
               },
               defaultItemProps: {
                  icon: "sparkles",
                  title: "Menu item",
                  badge: "",
                  description: "Short description of this item.",
                  href: "/",
               },
               getItemSummary: (item) => item.title || "Menu item",
            },
            dropdownFooterLabel: { type: "text" },
            dropdownFooterHref: { type: "text" },
         },
         defaultItemProps: { label: "Link", href: "/", dropdown: [], dropdownFooterLabel: "", dropdownFooterHref: "" },
         getItemSummary: (item) => item.label || "Link",
      },
   },
   defaultProps: {
      logoText: "HIIIVE",
      contactEmail: "hello@hiiive.ai",
      ctaLabel: "Book a call",
      ctaHref: "https://calendly.com/hiiive/dvision-potenzial",
      navItems: defaultNavItems,
   },
   render: ({ logoText, navItems, contactEmail, ctaLabel, ctaHref }) => (
      <Header
         logoText={logoText}
         navItems={navItems}
         contactEmail={contactEmail}
         ctaLabel={ctaLabel}
         ctaHref={ctaHref}
      />
   ),
};
