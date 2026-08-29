import { Calculator, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";
import { PrivacyPanel } from "./components/PrivacyPanel";
import { BirthProfileForm } from "./features/birth-profile/BirthProfileForm";
import { calculateReport } from "./features/guna-calculator/useCalculator";
import { MatchResult } from "./features/match-result/MatchResult";
import { SavedMatches } from "./features/match-result/SavedMatches";
import {
  clearPinnedProfile,
  clearStoredData,
  loadPinnedProfile,
  loadStoredData,
  savePinnedProfile,
  saveStoredData
} from "./storage/profiles";
import type { BirthDetails, MatchReport, ProfileRole, StoredData } from "./types";

function createProfile(id: string, name = ""): BirthDetails {
  return {
    id,
    name,
    date: "",
    time: "",
    place: "Mumbai, Maharashtra, India",
    latitude: 19.076,
    longitude: 72.8777,
    timezone: "+05:30"
  };
}

export default function App() {
  const stored = useMemo(() => loadStoredData(), []);
  const initialPinned = useMemo(() => loadPinnedProfile(), []);
  const [personA, setPersonA] = useState<BirthDetails>(
    initialPinned?.role === "boy"
      ? { ...initialPinned.details, id: "boy" }
      : stored.personA ?? createProfile("boy")
  );
  const [personB, setPersonB] = useState<BirthDetails>(
    initialPinned?.role === "girl"
      ? { ...initialPinned.details, id: "girl" }
      : stored.personB ?? createProfile("girl")
  );
  const [pinnedRole, setPinnedRole] = useState<ProfileRole | null>(
    initialPinned?.role ?? null
  );
  const [remember, setRemember] = useState(stored.remember);
  const [matches, setMatches] = useState<MatchReport[]>(stored.previousMatches);
  const [report, setReport] = useState<MatchReport | null>(matches[0] ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!remember) {
      clearStoredData();
      return;
    }

    const data: StoredData = {
      version: 1,
      personA,
      personB,
      previousMatches: matches.slice(0, 8),
      remember
    };
    saveStoredData(data);
  }, [matches, personA, personB, remember]);

  useEffect(() => {
    if (!pinnedRole) {
      clearPinnedProfile();
      return;
    }

    savePinnedProfile({
      version: 1,
      role: pinnedRole,
      details: pinnedRole === "boy" ? personA : personB
    });
  }, [personA, personB, pinnedRole]);

  function handleCalculate() {
    try {
      setError("");
      const nextReport = calculateReport(personA, personB);
      setReport(nextReport);
      setMatches((current) => [nextReport, ...current].slice(0, 8));
    } catch (unknownError) {
      const message =
        unknownError instanceof ZodError
          ? unknownError.issues[0]?.message ?? "Check the birth details and try again."
          : unknownError instanceof Error
            ? unknownError.message
            : "Check the birth details and try again.";
      setError(message);
    }
  }

  function handleClear() {
    clearStoredData();
    clearPinnedProfile();
    setPinnedRole(null);
    setRemember(false);
    setMatches([]);
    setReport(null);
  }

  function handleReset() {
    if (pinnedRole !== "boy") setPersonA(createProfile("boy"));
    if (pinnedRole !== "girl") setPersonB(createProfile("girl"));
    setError("");
    setReport(null);
  }

  function handlePinToggle(role: ProfileRole) {
    setPinnedRole((current) => (current === role ? null : role));
  }

  return (
    <main>
      <header className="site-header">
        <nav aria-label="Primary">
          <a href="#calculator">Calculator</a>
          <a href="#how-it-works">Kootas</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <a className="header-link" href="https://github.com/" rel="noreferrer">
          <ExternalLink aria-hidden="true" size={18} />
          GitHub Pages ready
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Ashtakoota compatibility</p>
          <h1>Kundli Matching and 36 Guna Milan Calculator</h1>
          <p>
            Calculate Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot
            and Nadi from birth details in a browser-only app.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#calculator">
              <Calculator aria-hidden="true" size={18} />
              Start matching
            </a>
            <a className="secondary-link" href="#privacy">
              Private storage
            </a>
          </div>
        </div>
        <div className="hero-motif" aria-hidden="true">
          <div className="moon-disc">
            <Sparkles size={28} />
            <span>36</span>
          </div>
        </div>
      </section>

      <section className="calculator-layout" id="calculator">
        <div className="section-heading">
          <p className="eyebrow">Calculator</p>
          <h2>Enter birth details</h2>
        </div>

        <div className="profile-grid">
          <BirthProfileForm
            title="Boy"
            value={personA}
            onChange={setPersonA}
            isPinned={pinnedRole === "boy"}
            onPinToggle={() => handlePinToggle("boy")}
          />
          <BirthProfileForm
            title="Girl"
            value={personB}
            onChange={setPersonB}
            isPinned={pinnedRole === "girl"}
            onPinToggle={() => handlePinToggle("girl")}
          />
        </div>

        <div className="action-bar">
          <button className="primary-button" type="button" onClick={handleCalculate}>
            <Calculator aria-hidden="true" size={19} />
            Calculate Guna Milan
          </button>
          <button className="ghost-button" type="button" onClick={handleReset}>
            <RotateCcw aria-hidden="true" size={18} />
            Reset
          </button>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </div>
      </section>

      {report ? <MatchResult report={report} /> : null}

      <SavedMatches matches={matches} onSelect={setReport} />

      <PrivacyPanel
        remember={remember}
        onRememberChange={setRemember}
        onClear={handleClear}
      />

      <section className="content-band" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">Rule set</p>
          <h2>Traditional score, transparent implementation</h2>
        </div>
        <div className="copy-columns">
          <p>
            The app calculates the sidereal Moon position, derives Nakshatra and
            Rashi, and applies a base Ashtakoota scoring system for a total out
            of 36. Each row in the result explains why points were awarded.
          </p>
          <p>
            Astrology traditions can differ on mappings and exceptions. This
            version keeps the rules in separate TypeScript data files so the
            scoring system can be reviewed, tested and customized.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        City data from{" "}
        <a href="https://www.geonames.org/" rel="noreferrer" target="_blank">
          GeoNames
        </a>{" "}
        under CC BY 4.0.
      </footer>
    </main>
  );
}
