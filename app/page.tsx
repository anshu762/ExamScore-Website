import { LandingHero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BoardsShowcase } from "@/components/landing/boards-showcase";
import { CTASection } from "@/components/landing/cta";

export default function Home() {
  return (
    <>
      <LandingHero />
      <FeaturesSection />
      <HowItWorks />
      <BoardsShowcase />
      <CTASection />
    </>
  );
}
