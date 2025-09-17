// app/diagnosis/report/page.tsx
import ResultSummary from "../components/ResultSummary";
import { type DiagnosisTypeId } from "../data/diagnosisTypes";

import ConceptSection from "../../components/landing-page/ConceptSection";
import CourseShowcaseSection from "../../components/landing-page/CourseShowcaseSection";
import FeaturesSection from "../../components/landing-page/FeaturesSection";
import LearningSystemSection from "../../components/landing-page/LearningSystemSection";
import PricingSection from "../../components/landing-page/PricingSection";
import TestimonialsSection from "../../components/landing-page/TestimonialsSection";
import FinalCTASection2 from "../../../app/diagnosis/components/FinalCTASection2";

const MOCK_TYPE_ID: DiagnosisTypeId = "attacker_info_expert";

export default function Page() {
  return (
    <>
      <ResultSummary typeId={MOCK_TYPE_ID} />
      <ConceptSection />
      <CourseShowcaseSection />
      <FeaturesSection />
      <LearningSystemSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <TestimonialsSection />
      <FinalCTASection2 />
    </>
  );
}
