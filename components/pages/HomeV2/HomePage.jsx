import { caseStudyImageAlts } from "@/lib/case-studies";
import { buildPageMetadata } from "@/lib/seo";
import { homeCopy } from "./copy";
import HomeCases from "./HomeCases";
import HomeStory from "./HomeStory";
import HomeWhy from "./HomeWhy";

/**
 * The cases' copy with each photo's alt from its Case Study item in the CMS
 * (the item its card links to), so editors change it in admin.
 */
async function withImageAlts(cases, locale) {
  const slugOf = (item) => item.href.split("/").pop();
  const alts = await caseStudyImageAlts(Object.values(cases.items).map(slugOf), locale);
  const items = Object.fromEntries(
    Object.entries(cases.items).map(([key, item]) => [key, { ...item, imageAlt: alts[slugOf(item)] }]),
  );
  return { ...cases, items };
}

/** The home page in a language: the story, why Hiiive, and the cases. */
export default async function HomePage({ locale }) {
  const copy = homeCopy(locale);
  return (
    <>
      <HomeStory copy={copy.story} preloader={copy.preloader} />
      <HomeWhy copy={copy.why} />
      <HomeCases copy={await withImageAlts(copy.cases, locale)} />
    </>
  );
}

/** Title, description, canonical and hreflang links for the home in a language. */
export function homeMetadata(locale) {
  const { meta } = homeCopy(locale);
  return buildPageMetadata({ root: { metaTitle: meta.title, metaDescription: meta.description }, path: "", locale });
}
