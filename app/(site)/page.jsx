import HomePage, { homeMetadata } from "@/components/pages/HomeV2/HomePage";
import { resolveLocale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The home page. Its language comes from the visitor's language cookie, as on
// every unprefixed page; /de and other prefixes are served by [...path].
export async function generateMetadata() {
  return homeMetadata(await resolveLocale());
}

export default async function Home() {
  return <HomePage locale={await resolveLocale()} />;
}
