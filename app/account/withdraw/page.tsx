import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./WithdrawPage.module.css";
import WithdrawForm from "./WithdrawForm";

export default function WithdrawPage() {
  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "退会手続き", href: "/account/withdraw" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>退会手続き</h1>
      </div>

      <div className={styles.wrap}>
        <WithdrawForm />
      </div>
    </main>
  );
}
