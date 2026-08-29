import { MapPin, Pin } from "lucide-react";
import { useMemo } from "react";
import { findCity, searchCities } from "../../data/cities";
import { BiodataImport } from "../biodata/BiodataImport";
import type { ParsedBiodata } from "../biodata/biodataParser";
import type { BirthDetails } from "../../types";

interface BirthProfileFormProps {
  title: string;
  value: BirthDetails;
  onChange: (value: BirthDetails) => void;
  isPinned: boolean;
  onPinToggle: () => void;
}

export function BirthProfileForm({
  title,
  value,
  onChange,
  isPinned,
  onPinToggle
}: BirthProfileFormProps) {
  const cityListId = `${value.id}-city-options`;
  const citySuggestions = useMemo(() => searchCities(value.place), [value.place]);

  function update<K extends keyof BirthDetails>(key: K, next: BirthDetails[K]) {
    onChange({ ...value, [key]: next });
  }

  function handlePlaceChange(place: string) {
    const city = findCity(place);
    if (city) {
      onChange({
        ...value,
        place: city.label,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone
      });
      return;
    }

    update("place", place);
  }

  function handleBiodataApply(details: ParsedBiodata) {
    const city = findCity(details.place);
    onChange({
      ...value,
      name: details.name || value.name,
      date: details.date || value.date,
      time: details.time || value.time,
      place: details.place ? city?.label ?? details.place : value.place,
      latitude: city?.latitude ?? value.latitude,
      longitude: city?.longitude ?? value.longitude,
      timezone: city?.timezone ?? value.timezone
    });
  }

  return (
    <section className="panel profile-panel" aria-labelledby={`${value.id}-title`}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Birth profile</p>
          <h2 id={`${value.id}-title`}>{title}</h2>
        </div>
        <MapPin aria-hidden="true" size={22} />
      </div>

      <div className="profile-toolbar">
        <button
          aria-pressed={isPinned}
          className={`ghost-button profile-tool-button${isPinned ? " is-active" : ""}`}
          type="button"
          onClick={onPinToggle}
        >
          <Pin aria-hidden="true" size={17} />
          {isPinned ? `${title} saved` : `Keep ${title} on device`}
        </button>
        <BiodataImport profileTitle={title} onApply={handleBiodataApply} />
      </div>

      <div className="field-grid">
        <label>
          <span>Name</span>
          <input
            value={value.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Optional"
            autoComplete="name"
          />
        </label>

        <label>
          <span>Date of birth</span>
          <input
            type="date"
            value={value.date}
            onChange={(event) => update("date", event.target.value)}
            required
          />
        </label>

        <label>
          <span>Birth time</span>
          <input
            type="time"
            value={value.time}
            onChange={(event) => update("time", event.target.value)}
            required
          />
        </label>

        <label>
          <span>Birthplace</span>
          <input
            list={cityListId}
            value={value.place}
            onChange={(event) => handlePlaceChange(event.target.value)}
            placeholder="City, country"
            required
          />
        </label>

        <label>
          <span>Latitude</span>
          <input
            type="number"
            value={value.latitude}
            step="0.0001"
            min="-90"
            max="90"
            onChange={(event) => update("latitude", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Longitude</span>
          <input
            type="number"
            value={value.longitude}
            step="0.0001"
            min="-180"
            max="180"
            onChange={(event) => update("longitude", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Timezone</span>
          <input
            value={value.timezone}
            onChange={(event) => update("timezone", event.target.value)}
            placeholder="+05:30"
          />
        </label>
      </div>

      <datalist id={cityListId}>
        {citySuggestions.map((city) => (
          <option key={city.label} value={city.label} />
        ))}
      </datalist>
    </section>
  );
}
