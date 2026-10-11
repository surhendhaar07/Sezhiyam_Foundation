// src/app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import VisionMissionValues from "@/components/home/VisionMissionValues";
import TeamCarousel from "@/components/home/TeamCarousel";
import WingsSection from "@/components/home/WingsSection";
import ImpactSection from "@/components/home/ImpactSection";
import NewsSection from "@/components/home/NewsSection";
import WhereWeWork from "@/components/home/WhereWeWork";
import RecentProjects from "@/components/home/RecentProjects";
import NalamSection from "@/components/home/NalamSection";
import SocialSection from "@/components/home/SocialSection";

import {
  getSiteSettings,
  getTeamMembers,
  getWings,
  getImpactStats,
  getGovernanceInfo,
  getWorkingLocations,
  getProjects,
  getNalamEvents,
  getNews,
} from "@/lib/queries";

export const dynamic = "force-dynamic"; // always fresh — no static cache during dev

export default async function HomePage() {
  const [
    settings,
    team,
    wings,
    impactStats,
    governance,
    locations,
    recentProjects,
    nalamEvents,
    news,
  ] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getWings(),
    getImpactStats(),
    getGovernanceInfo(),
    getWorkingLocations(),
    getProjects({ limit: 3 }),
    getNalamEvents({ limit: 2 }),
    getNews({ limit: 3 }),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <AboutPreview settings={settings} />
      <VisionMissionValues settings={settings} />
      <TeamCarousel members={team} />
      <WingsSection wings={wings} />
      <ImpactSection stats={impactStats} governance={governance} />
      <NewsSection items={news} />
      <WhereWeWork locations={locations} />
      <RecentProjects projects={recentProjects} />
      <NalamSection events={nalamEvents} />
      <SocialSection settings={settings} />
    </>
  );
}