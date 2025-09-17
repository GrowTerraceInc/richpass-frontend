"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/app/components/ui/AvatarUpload";
import FormField from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import styles from "./ProfilePage.module.css";

type Props = {
  initial: {
    displayName: string;
    email?: string;
    photoUrl?: string;
  };
};

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [email, setEmail] = useState(initial.email ?? "");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, photo: photoDataUrl }),
      });
      router.push("/settings/profile/success");
    } catch {
      alert("保存に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={`${styles.formWrap} ${styles.form}`} onSubmit={onSubmit}>
      <div className={styles.avatarBlock}>
        <AvatarUpload value={initial.photoUrl} onChange={(url) => setPhotoDataUrl(url)} />
      </div>

      <div className={styles.field}>
        <FormField
          label="ニックネーム"
          inputProps={{
            placeholder: "Daichi",
            value: displayName,
            onChange: (e) => setDisplayName(e.target.value),
            maxLength: 50,
          }}
        />
      </div>

      <div className={styles.field}>
        <FormField
          label="メールアドレス"
          inputProps={{
            type: "email",
            placeholder: "daichi@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          }}
        />
      </div>

      <div className={styles.toPassword}>
        <a href="/settings/password">{"> パスワードを変更する"}</a>
      </div>

      <div className={styles.actions}>
        <Button size="large" disabled={saving} aria-busy={saving}>
          {saving ? "保存中…" : "保存する"}
        </Button>
      </div>
    </form>
  );
}
