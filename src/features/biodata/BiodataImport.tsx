import { FileCheck2, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { findCity, searchCities } from "../../data/cities";
import { parseBiodataText, type ParsedBiodata } from "./biodataParser";
import { extractBiodataText } from "./extractBiodata";

interface BiodataImportProps {
  profileTitle: string;
  onApply: (details: ParsedBiodata) => void;
}

interface ReviewDialogProps {
  initial: ParsedBiodata;
  profileTitle: string;
  onApply: (details: ParsedBiodata) => void;
  onClose: () => void;
}

function ReviewDialog({ initial, profileTitle, onApply, onClose }: ReviewDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const [draft, setDraft] = useState(() => {
    const city = findCity(initial.place);
    return city ? { ...initial, place: city.label } : initial;
  });
  const cityListId = useId();
  const citySuggestions = useMemo(() => searchCities(draft.place), [draft.place]);
  const matchedCity = findCity(draft.place);

  useEffect(() => {
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function update(key: keyof ParsedBiodata, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updatePlace(place: string) {
    const city = findCity(place);
    update("place", city?.label ?? place);
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        aria-labelledby="biodata-review-title"
        aria-modal="true"
        className="review-dialog"
        role="dialog"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">{profileTitle} biodata</p>
            <h3 id="biodata-review-title">Review extracted details</h3>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X aria-hidden="true" size={20} />
            <span className="visually-hidden">Close</span>
          </button>
        </div>

        <div className="review-grid">
          <label>
            <span>Name</span>
            <input value={draft.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            <span>Date of birth</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => update("date", event.target.value)}
            />
          </label>
          <label>
            <span>Birth time</span>
            <input
              type="time"
              value={draft.time}
              onChange={(event) => update("time", event.target.value)}
            />
          </label>
          <label className="review-place">
            <span>Birthplace</span>
            <input
              list={cityListId}
              value={draft.place}
              onChange={(event) => updatePlace(event.target.value)}
            />
          </label>
        </div>

        <datalist id={cityListId}>
          {citySuggestions.map((city) => (
            <option key={city.label} value={city.label} />
          ))}
        </datalist>

        <p className={matchedCity ? "location-match" : "location-match location-unmatched"}>
          {matchedCity
            ? `Location matched: ${matchedCity.latitude}, ${matchedCity.longitude} (${matchedCity.timezone})`
            : "Location coordinates were not matched. Verify the birthplace after importing."}
        </p>

        <details className="extracted-text">
          <summary>Extracted source text</summary>
          <pre>{draft.rawText}</pre>
        </details>

        <div className="dialog-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            <FileCheck2 aria-hidden="true" size={18} />
            Use these details
          </button>
          <button className="ghost-button" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

export function BiodataImport({ profileTitle, onApply }: BiodataImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [review, setReview] = useState<ParsedBiodata | null>(null);

  async function handleFile(file: File) {
    setError("");
    setProgress("Opening biodata");

    try {
      const text = await extractBiodataText(file, setProgress);
      setReview(parseBiodataText(text));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error ? unknownError.message : "The biodata could not be read."
      );
    } finally {
      setProgress("");
    }
  }

  return (
    <div className="biodata-import">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="application/pdf,image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
      <button
        className="ghost-button profile-tool-button"
        type="button"
        disabled={Boolean(progress)}
        onClick={() => inputRef.current?.click()}
      >
        {progress ? (
          <LoaderCircle className="spin" aria-hidden="true" size={17} />
        ) : (
          <Upload aria-hidden="true" size={17} />
        )}
        {progress || "Import biodata"}
      </button>
      {error ? <p className="import-error" role="alert">{error}</p> : null}
      {review ? (
        <ReviewDialog
          initial={review}
          profileTitle={profileTitle}
          onApply={onApply}
          onClose={() => setReview(null)}
        />
      ) : null}
    </div>
  );
}
