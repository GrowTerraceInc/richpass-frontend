"use client";
import { ReactNode, useId } from "react";
import { Input, InputProps } from "./Input";

type Props = {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  inputProps?: InputProps;
};

export default function FormField({ label, description, error, inputProps }: Props) {
  const uid = useId();
  const id = inputProps?.id ?? `ff-${uid}`;
  const descId = description ? `${id}-desc` : undefined;
  const errId  = error ? `${id}-err` : undefined;

  return (
    <div>
      {label && <label htmlFor={id} style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>{label}</label>}
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
        {...inputProps}
        error={error}
      />
      {description && <p id={descId} style={{ marginTop: 6, fontSize: 13, color: "var(--color-gray-600)" }}>{description}</p>}
      {/* error は Input 側の errorMessage で表示されるのでここでは重複表示しない */}
    </div>
  );
}
