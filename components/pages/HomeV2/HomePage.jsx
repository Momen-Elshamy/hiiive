import { buildPageMetadata } from "@/lib/seo";
import { homeCopy } from "./copy";
import HomeCases from "./HomeCases";
import HomeStory from "./HomeStory";
import HomeWhy from "./HomeWhy";

/** The home page in a language: the story, why Hiiive, and the cases. */
export default function HomePage({ locale }) {
  const copy = homeCopy(locale);
  return (
    <>
      <HomeStory copy={copy.story} preloader={copy.preloader} />
      <HomeWhy copy={copy.why} />
      <HomeCases copy={copy.cases} />
    </>
  );
}

/** Title, description, canonical and hreflang links for the home in a language. */
export function homeMetadata(locale) {
  const { meta } = homeCopy(locale);
  return buildPageMetadata({ root: { metaTitle: meta.title, metaDescription: meta.description }, path: "", locale });
}
