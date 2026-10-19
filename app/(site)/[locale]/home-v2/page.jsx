import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/locales";

// The prototype's address with a language prefix (/de/home-v2): the home page
// in that language now.
export default async function LocalizedHomeV2Page({ params }) {
  const locale = (await params).locale.toLowerCase();
  if (!isLocale(locale)) notFound();
  permanentRedirect(`/${locale}`);
}
