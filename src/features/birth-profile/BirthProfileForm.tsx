import { MapPin } from "lucide-react";
import { CITY_OPTIONS } from "../../data/cities";
import type { BirthDetails } from "../../types";

interface BirthProfileFormProps {
  title: string;
  value: BirthDetails;
  onChange: (value: BirthDetails) => void;
}

export function BirthProfileForm({ title, value, onChange }: BirthProfileFormProps) {
  const cityListId = `${value.id}-city-options`;

  function update<K extends keyof BirthDetails>(key: K, next: BirthDetails[K]) {
    onChange({ ...value, [key]: next });
  }

  function handlePlaceChange(place: string) {
    const city = CITY_OPTIONS.find((option) => option.label === place);
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

  return (
    <section className="panel profile-panel" aria-labelledby={`${value.id}-title`}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Birth profile</p>
          <h2 id={`${value.id}-title`}>{title}</h2>
        </div>
        <MapPin aria-hidden="true" size={22} />
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
        {CITY_OPTIONS.map((city) => (
          <option key={city.label} value={city.label} />
        ))}
      </datalist>
    </section>
  );
}
