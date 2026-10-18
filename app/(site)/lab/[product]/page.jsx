import { notFound } from "next/navigation";
import ProductPage, { productMetadata } from "@/components/pages/Lab/ProductPage";
import { productBySlug } from "@/components/pages/Lab/products";
import { DEFAULT_LOCALE, resolveLocale } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const locale = await resolveLocale();
  const product = productBySlug((await params).product, locale);
  return product ? productMetadata(product, locale) : {};
}

export default async function LabProductPage({ params }) {
  const locale = await resolveLocale();
  const product = productBySlug((await params).product, locale);
  if (!product) notFound();
  return <ProductPage product={product} base={locale === DEFAULT_LOCALE ? "/lab" : `/${locale}/lab`} locale={locale} />;
}
