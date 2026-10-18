import { notFound } from "next/navigation";
import LabIndex from "@/components/pages/Lab/LabIndex";
import { isLocale } from "@/lib/locales";
import { metadata as labMetadata } from "../../lab/page";

// The AI Lab under a language prefix (/de/lab), where the geo redirect sends
// German visitors. Same English copy until the German copy is written.
export const metadata = labMetadata;

export default async function LocalizedLabPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LabIndex base={`/${locale}/lab`} />;
}
