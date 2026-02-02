import { getBrainItems } from "@/api/brain-items";
import ItemList from "@/app/components/brain/item-list";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

type Params = Promise<{ BrainId: string; section: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SECTION_TO_TYPE: Record<string, string> = {
  tweets: "tweet",
  videos: "video",
  docs: "note",
  links: "link",
};

export default async function BrainSectionPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { BrainId, section } = await props.params;
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // Validate section
  if (!SECTION_TO_TYPE[section]) {
     notFound();
  }

  const type = SECTION_TO_TYPE[section];

  let items = await getBrainItems(BrainId, type, search);

  // If section is videos, also fetch youtube items and merge
  if (section === 'videos') {
      const youtubeItems = await getBrainItems(BrainId, 'youtube', search);
      // Avoid duplicates just in case, though IDs should be unique
      const existingIds = new Set(items.map(i => i.id));
      const newItems = youtubeItems.filter(i => !existingIds.has(i.id));
      items = [...items, ...newItems];

      // Sort by created at descending
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold capitalize hidden md:block">
        {section}
      </h2>
      <ItemList items={items} />
    </div>
  );
}
