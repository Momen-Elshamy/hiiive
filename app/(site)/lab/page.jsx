import LabIndex from "@/components/pages/Lab/LabIndex";

export const metadata = {
  title: "AI Lab | HIIIVE",
  description: "Products that started as work for one company and are made for many: Dvision, Spoky and Komplyo.",
};

export default function LabPage() {
  return <LabIndex base="/lab" />;
}
