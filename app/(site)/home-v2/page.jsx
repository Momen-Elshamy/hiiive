import HomeStory from "@/components/pages/HomeV2/HomeStory";
import HomeWhy from "@/components/pages/HomeV2/HomeWhy";
import HomeCases from "@/components/pages/HomeV2/HomeCases";

// Prototype route for the new home story. Kept out of search until it replaces "/".
export const metadata = {
  title: "Home v2 (prototype) | HIIIVE",
  robots: { index: false, follow: false },
};

export default function HomeV2Page() {
  return (
    <>
      <HomeStory />
      <HomeWhy />
      <HomeCases />
    </>
  );
}
