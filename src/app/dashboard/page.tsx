import { auth } from "@/auth";
import { getBrainNav } from "@/api/brain-nav";
import { redirect } from "next/navigation";

/**
 * Dashboard index: requires auth. If the user has brains, redirect to the first default
 * brain; otherwise fall back to the aggregated "All Items" view.
 */
export default async function DashboardIndex() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  let brains = await getBrainNav();

  // let brains = [
  //     {
  //         id: "item-1",
  //         name: "First Item",
  //         tweet: true,
  //         link: false,
  //         youtube: false,
  //         other: false,
  //         note: true,
  //         is_default: true
  //     },{
  //         id: "item-2",
  //         is_default:false,
  //         name: "Second Item",
  //         tweet: false,
  //         link: true,
  //         youtube: false,
  //         other: false,
  //         note: false
  //     }
  //   ]

  if (brains.length === 0) {
    return <p className="opacity-60 p-4">Create a brain to get started.</p>;
  }
  if (brains.length > 0) {
    const defaultBrain = brains.filter((val) => val.is_default == false);

    redirect(`/dashboard/${defaultBrain[0].id}`);
  }
  redirect(`/dashboard/all-items`); // go to “All Items”
}
