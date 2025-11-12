import NewsPreview from "@/components/previews/NewsPreview";
import AISection from "@/components/categories/AISection";
import KHCNSection from "@/components/categories/KHCNSection";
import TelecomSection from "@/components/categories/TelecomSection";
import RoboticsSection from "@/components/categories/RoboticsSection";
import SoftwareSection from "@/components/categories/SoftwareSection";
import SecuritySection from "@/components/categories/SecuritySection";
import ResearchSection from "@/components/categories/ResearchSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Hero /> */}
      <div className="container mx-auto px-4 py-8">
        {/* Latest News Section */}
        <div className="mt-12">
          <NewsPreview />
        </div>

        {/* Category Sections */}
        <ResearchSection />
        <KHCNSection />
        <AISection />
        <TelecomSection />
        <RoboticsSection />
        <SoftwareSection />
        <SecuritySection />

        {/* My Saved Articles Section */}
        {/* <div className="mt-12">
          <SavedPreview />
        </div> */}
        
      </div>
    </main>
  );
}
