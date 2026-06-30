// Server module: defines the Puck block config. The render returns the
// interactive client <Header>. Keeping this file free of "use client" lets
// Puck's RSC <Render> call render() on the server and drop the non-serializable
// `puck` prop (renderDropZone, dragRef, …) before reaching the client Header.
import Header, { defaultNavItems } from "./Header";

export default Header;

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
