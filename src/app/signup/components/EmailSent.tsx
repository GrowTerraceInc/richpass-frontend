'use client';

import Link from 'next/link';
import styles from './EmailSent.module.css';
import Button from '@/components/ui/Button';

type Props = {
  onResend?: () => void;
  resendHref?: string;
};

export default function EmailSent({ onResend, resendHref = '/signup/resend' }: Props) {
  return (
    <section className={styles.container} aria-labelledby="email-sent-title">
      <div className={styles.inner}>
        <div className={styles.icon} role="img" aria-label="メール送信アイコン">📧</div>
        <h1 id="email-sent-title" className={styles.title}>メールをご確認ください</h1>
        <p className={styles.desc}>
          <span className={styles.line1}>ご登録いただいたメールアドレスに、アカウントを有効化するためのメールを送信しました。</span>
          <span className={styles.line2}>メール内のリンクをクリックして、登録を完了してください。</span>
        </p>
        <div className={styles.subActions}>
          <p className={styles.note}>メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
          <div className={styles.resendWrap}>
            {onResend ? (
              <Button variant="secondary" size="medium" onClick={onResend}>確認メールを再送信する</Button>
            ) : (
              <Link href={resendHref} className={styles.linkReset}>
                <Button variant="secondary" size="medium">確認メールを再送信する</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
