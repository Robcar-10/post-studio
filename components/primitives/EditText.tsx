"use client";
import { useRef, useEffect, type CSSProperties, type ReactNode } from "react";

interface Props {
  value: string;
  fieldKey: string;
  editable?: boolean;
  editKey?: string | null;
  setEditKey?: (k: string | null) => void;
  selectedKey?: string | null;
  setSelectedKey?: (k: string | null) => void;
  onChange?: (key: string, val: string) => void;
  multi?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export function EditText({
  value, fieldKey, editable, editKey, setEditKey,
  selectedKey, setSelectedKey, onChange, multi, style = {}, children,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isEditing = !!(editable && editKey === fieldKey);
  const isSelected = !!(editable && selectedKey === fieldKey);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const r = document.createRange();
      r.selectNodeContents(ref.current);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  }, [isEditing]);

  if (!editable) {
    return <span data-field-key={fieldKey} style={style}>{children ?? value}</span>;
  }

  const commit = () => {
    if (!ref.current) return;
    const next = ref.current.innerText;
    if (next !== value) onChange?.(fieldKey, next);
    setEditKey?.(null);
  };

  return (
    <span
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      data-field-key={fieldKey}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditing) return;
        setSelectedKey?.(fieldKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!isEditing) setEditKey?.(fieldKey);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multi) { e.preventDefault(); ref.current?.blur(); }
        if (e.key === "Escape") { e.preventDefault(); ref.current?.blur(); }
      }}
      className={`rut-edit ${isEditing ? "is-editing" : ""} ${isSelected && !isEditing ? "is-selected" : ""}`}
      style={style}
    >
      {children ?? value}
    </span>
  );
}
