"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import styles from "./AvatarUpload.module.css";

type Props = {
  value?: string; // 初期URL
  onChange?: (dataUrl: string | null, file?: File) => void;
};

export default function AvatarUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const openPicker = () => inputRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : null;
      setPreview(url ?? undefined);
      onChange?.(url, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.root}>
      <Image
        className={styles.avatar}
        src={preview || "/images/avatar-placeholder.png"}
        alt="プロフィール画像"
        width={150}
        height={150}
        unoptimized
      />
      <div className={styles.changeWrap}>
        <Button variant="secondary" size="small" onClick={openPicker} type="button">
          画像を変更する
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={onFile}
      />
    </div>
  );
}
