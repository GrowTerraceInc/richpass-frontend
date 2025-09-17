"use client";
import styles from "./Toggle.module.css";
import clsx from "clsx";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
};

export default function Toggle({ checked, onChange, label, description, disabled, id }: Props) {
  return (
    <div className={styles.root} aria-disabled={disabled}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        className={clsx(styles.switch, checked && styles.on, disabled && styles.disabled)}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className={styles.knob} aria-hidden="true" />
        <input className={styles.input} tabIndex={-1} readOnly value={checked ? "on" : "off"} />
      </button>
      <div>
        {label && <div className={styles.label}>{label}</div>}
        {description && <div className={styles.desc}>{description}</div>}
      </div>
    </div>
  );
}
