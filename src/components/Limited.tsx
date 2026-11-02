import { useState, type ReactNode } from "react";
import { useI18n } from "../i18n";

/** Shows the first three cards and a "show all" button when there are more. */
export function Limited({ items }: { items: ReactNode[] }) {
  const { t } = useI18n();
  const [all, setAll] = useState(false);
  return (
    <>
      {all ? items : items.slice(0, 3)}
      {items.length > 3 && (
        <div className="more">
          <button className="btn sm" type="button" onClick={() => setAll(!all)}>
            {all ? t("הצג פחות") : t("הצג הכל ({0})", items.length)}
          </button>
        </div>
      )}
    </>
  );
}
