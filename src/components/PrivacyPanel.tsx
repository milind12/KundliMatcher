import { LockKeyhole, Trash2 } from "lucide-react";

interface PrivacyPanelProps {
  remember: boolean;
  onRememberChange: (remember: boolean) => void;
  onClear: () => void;
}

export function PrivacyPanel({ remember, onRememberChange, onClear }: PrivacyPanelProps) {
  return (
    <section className="privacy-panel" id="privacy" aria-labelledby="privacy-title">
      <div className="privacy-copy">
        <LockKeyhole aria-hidden="true" size={22} />
        <div>
          <p className="eyebrow">Private by design</p>
          <h2 id="privacy-title">Birth details stay on this device</h2>
          <p>
            No account, backend or database is used. Saved profiles and previous matches
            are kept in local browser storage only.
          </p>
        </div>
      </div>
      <div className="privacy-actions">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => onRememberChange(event.target.checked)}
          />
          <span>Remember profiles and matches</span>
        </label>
        <button className="ghost-button" type="button" onClick={onClear}>
          <Trash2 aria-hidden="true" size={18} />
          Clear saved data
        </button>
      </div>
    </section>
  );
}
