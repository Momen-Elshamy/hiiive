import { notFound } from "next/navigation";
import ProductPage from "@/components/pages/Lab/ProductPage";
import { productBySlug } from "@/components/pages/Lab/products";
import { isLocale } from "@/lib/locales";

// A product page under a language prefix (/de/lab/spoky); see ../page.jsx.
export { generateMetadata } from "../../../lab/[product]/page";

export default async function LocalizedLabProductPage({ params }) {
  const { locale, product: slug } = await params;
  const product = productBySlug(slug);
  if (!isLocale(locale) || !product) notFound();
  return <ProductPage product={product} base={`/${locale}/lab`} />;
}
