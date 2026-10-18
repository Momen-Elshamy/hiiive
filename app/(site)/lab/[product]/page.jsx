import { notFound } from "next/navigation";
import ProductPage from "@/components/pages/Lab/ProductPage";
import { productBySlug } from "@/components/pages/Lab/products";

export async function generateMetadata({ params }) {
  const product = productBySlug((await params).product);
  if (!product) return {};
  return { title: `${product.name} | AI Lab | HIIIVE`, description: product.intro };
}

export default async function LabProductPage({ params }) {
  const product = productBySlug((await params).product);
  if (!product) notFound();
  return <ProductPage product={product} base="/lab" />;
}
