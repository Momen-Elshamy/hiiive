import LabIndex, { labMetadata } from "@/components/pages/Lab/LabIndex";
import { DEFAULT_LOCALE, resolveLocale } from "@/lib/i18n";

// The AI Lab in the language of the visitor's cookie, as on every unprefixed
// page; /de/lab is the prefixed route ([locale]/lab).
export async function generateMetadata() {
  return labMetadata(await resolveLocale());
}

export default async function LabPage() {
  const locale = await resolveLocale();
  return <LabIndex base={locale === DEFAULT_LOCALE ? "/lab" : `/${locale}/lab`} locale={locale} />;
}
