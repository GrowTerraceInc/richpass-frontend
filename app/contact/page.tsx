import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./ContactPage.module.css";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "問い合わせ", href: "/contact" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>お問い合わせ</h1>
      </div>

      <div className={styles.wrap}>
        <ContactForm />
      </div>
    </main>
  );
}
