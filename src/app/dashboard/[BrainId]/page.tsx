import { getBrainItems } from "@/api/brain-items";
import ItemList from "@/app/components/brain/item-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Params = Promise<{ BrainId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BrainSpecificAllPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { BrainId } = await props.params;
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const items = await getBrainItems(BrainId, undefined, search);

  return (
    <div className="space-y-4">
      <ItemList items={items} />
    </div>
  );
}
