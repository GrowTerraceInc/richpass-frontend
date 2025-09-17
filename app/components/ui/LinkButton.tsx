"use client";
import Link from "next/link";
import Button, { ButtonProps } from "./Button";

type LinkButtonProps = Omit<ButtonProps, "onClick"> & { href: string; target?: string; rel?: string };

export default function LinkButton({ href, target, rel, ...btn }: LinkButtonProps) {
  // 見た目は Button に委譲、遷移だけ Link
  return (
    <Link href={href} target={target} rel={rel} style={{ textDecoration: "none" }}>
      <Button {...btn} />
    </Link>
  );
}
