import { useState } from "react";
import { useI18n } from "../i18n";

/** A translatable replacement for the browser's native file picker text. */
export function FileInput({ id, onFile }: { id: string; onFile: (f: File | null) => void }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  return (
    <div className="fi">
      <input
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setName(f?.name ?? "");
          onFile(f);
        }}
      />
      <label className="fbtn" htmlFor={id}>{t("בחירת קובץ")}</label>
      <span className="fnm" translate={name ? "no" : undefined}>{name || t("לא נבחר קובץ")}</span>
    </div>
  );
}
