import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import { HeroContent } from "@/models/HeroContent";
import { ShowContent } from "@/models/ShowContent";
import { SisterChannel } from "@/models/SisterChannel";
import { GalleryItem } from "@/models/GalleryItem";

export const metadata: Metadata = {
  title: "Cineplus Studio - Premier Digital Storytelling Powerhouse",
  description:
    "Welcome to Cineplus Studio. We deliver gripping original web series, youth-centric dramas, and family comedy shows that break stereotypes and captivate audiences globally.",
  keywords:
    "Cineplus, Cineplus Studio, shows, brand, series, originals, drama, comedy, panchayat, gullak, kota factory, web series, partner",
};

export default async function Page() {
  await dbConnect();

  // Fetch active hero banner
  const rawHero = await HeroContent.findOne({ currentActiveOnLiveSite: true }).lean();
  const heroContent = rawHero ? {
    tag: rawHero.tag,
    title: rawHero.title,
    shortDescription: rawHero.shortDescription,
    link: rawHero.link,
  } : null;

  // Fetch homepage shows (newest first)
  const rawShows = await ShowContent.find({ homepageStatus: true }).sort({ createdAt: -1 }).lean();
  const homepageShows = rawShows.map((show: any) => ({
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

  // Fetch sister channels
  const rawChannels = await SisterChannel.find().lean();
  const sisterChannels = rawChannels.map((channel: any) => ({
    _id: channel._id.toString(),
    logo: channel.logo,
    title: channel.title,
    subscriber: channel.subscriber,
    link: channel.link,
  }));

  // Fetch timeline gallery posters
  const rawGallery = await GalleryItem.find().lean();
  const galleryPosters = rawGallery.map((item: any) => item.url);

  return (
    <HomeClient
      initialHero={heroContent}
      initialShows={homepageShows}
      initialChannels={sisterChannels}
      initialGallery={galleryPosters}
    />
  );
}
