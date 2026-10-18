import { notFound } from "next/navigation";
import LabIndex, { labMetadata } from "@/components/pages/Lab/LabIndex";
import { isLocale } from "@/lib/locales";

// The AI Lab under a language prefix (/de/lab), where the geo redirect sends
// German visitors.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return isLocale(locale) ? labMetadata(locale) : {};
}

export default async function LocalizedLabPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LabIndex base={`/${locale}/lab`} locale={locale} />;
}
