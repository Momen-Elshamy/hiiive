import { notFound } from "next/navigation";
import ProductPage, { productMetadata } from "@/components/pages/Lab/ProductPage";
import { productBySlug } from "@/components/pages/Lab/products";
import { isLocale } from "@/lib/locales";

// A product page under a language prefix (/de/lab/spoky).
export async function generateMetadata({ params }) {
  const { locale, product: slug } = await params;
  const product = isLocale(locale) && productBySlug(slug, locale);
  return product ? productMetadata(product, locale) : {};
}

export default async function LocalizedLabProductPage({ params }) {
  const { locale, product: slug } = await params;
  const product = isLocale(locale) && productBySlug(slug, locale);
  if (!product) notFound();
  return <ProductPage product={product} base={`/${locale}/lab`} locale={locale} />;
}
