"use client";

import Link from "next/link";
import styles from "./NotificationListItem.module.css";
import clsx from "clsx";
import { formatRelativeTime } from "@/app/lib/formatRelativeTime";
import { Trophy, Handshake, Info, AlertCircle } from "lucide-react";

export type NotificationListItemProps = {
  title: string;
  createdAt: string;               // ISO
  icon?: "trophy" | "handshake" | "info";
  type?: "info" | "important" | "system";
  pinned?: boolean;
  href?: string;
};

function Icon({
  icon,
  type,
}: {
  icon?: NotificationListItemProps["icon"];
  type?: NotificationListItemProps["type"];
}) {
  if (type === "important") {
    return <AlertCircle className={styles.svg} aria-hidden="true" />;
  }
  switch (icon) {
    case "trophy":
      return <Trophy className={clsx(styles.svg, styles.trophy)} aria-hidden="true" />;
    case "handshake":
      return <Handshake className={styles.svg} aria-hidden="true" />;
    default:
      return <Info className={styles.svg} aria-hidden="true" />;
  }
}

export default function NotificationListItem({
  title,
  createdAt,
  icon = "info",
  type,
  pinned,
  href,
}: NotificationListItemProps) {
  const body = (
    <div className={clsx(styles.item, pinned && styles.pinned)}>
      <div className={styles.icon} data-kind={type === "important" ? "alert" : icon}>
        <Icon icon={icon} type={type} />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{formatRelativeTime(createdAt)}</div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className={styles.linkWrap}>
      {body}
    </Link>
  ) : (
    body
  );
}
