import OriginalsClient from "@/components/OriginalsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import { ShowContent } from "@/models/ShowContent";

export const metadata: Metadata = {
  title: "Originals | Cineplus Studio",
  description:
    "Explore the premium original web series and dramas of Cineplus Studio. High-fidelity storytelling, award-winning cast, and premium production.",
  keywords: "Cineplus, originals, drama, comedy, series, TVF originals",
};

export default async function Page() {
  await dbConnect();

  // Fetch all shows on the server
  const rawShows = await ShowContent.find().lean();
  const serializableShows = rawShows.map((show: any) => ({
    _id: show._id.toString(),
    title: show.title,
    dramaType: show.dramaType,
    showDramaType: show.showDramaType,
    shortDescription: show.shortDescription,
    awardWinnerCategory: show.awardWinnerCategory,
    awardGivenInstitution: show.awardGivenInstitution,
    showAwards: show.showAwards,
    imdbScore: show.imdbScore,
    showImdbScore: show.showImdbScore,
    link: show.link,
    image: show.image,
    homepageStatus: show.homepageStatus,
    cast: show.cast ? show.cast.map((c: any) => ({ name: c.name, role: c.role || "", image: c.image })) : [],
  }));

  return <OriginalsClient initialShows={serializableShows} />;
}
