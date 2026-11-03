export const metadata = {
  // Opt the admin out of the site's "| HIIIVE" title template.
  title: { absolute: "Admin | PMST", template: "%s" },
  description: "PMST content management",
};

export default function AdminRootLayout({ children }) {
  return children;
}
