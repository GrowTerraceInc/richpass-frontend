// app/diagnosis/result-hub/page.tsx
import ResultHub from "../components/ResultHub";
import { type DiagnosisTypeId } from "../data/diagnosisTypes";

const MOCK_TYPE_ID: DiagnosisTypeId = "inspiration_trader"; // 任意で切替OK

export default function Page() {
  return <ResultHub typeId={MOCK_TYPE_ID} />;
}
