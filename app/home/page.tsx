// app/home/page.tsx
import HomeScreen from "./components/HomeScressn";

export const metadata = {
  title: "ホーム | リッチパス",
  description: "学習状況や次のアクション、仲間の活動をひと目で確認できるダッシュボード。",
};

export default function Page() {
  return <HomeScreen />;
}
