import HeroSection from "./components/landing-page/HeroSection";
import ConceptSection from "./components/landing-page/ConceptSection";
import CourseShowcaseSection from "./components/landing-page/CourseShowcaseSection";
import FeaturesSection from "./components/landing-page/FeaturesSection";
import LearningSystemSection from "./components/landing-page/LearningSystemSection";
import PricingSection from "./components/landing-page/PricingSection";
import TestimonialsSection from "./components/landing-page/TestimonialsSection";
import FinalCTASection from "./components/landing-page/FinalCTASection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <ConceptSection />
      <CourseShowcaseSection />
      <FeaturesSection />
      <LearningSystemSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}
