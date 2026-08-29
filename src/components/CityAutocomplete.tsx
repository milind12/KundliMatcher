import { Check, MapPin } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { findCity, searchCities, type CityOption } from "../data/cities";

interface CityAutocompleteProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onCitySelect: (city: CityOption) => void;
  placeholder?: string;
  required?: boolean;
}

export function CityAutocomplete({
  label,
  value,
  onValueChange,
  onCitySelect,
  placeholder,
  required
}: CityAutocompleteProps) {
  const inputId = useId();
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedCity = findCity(value);
  const searchValue = selectedCity?.label === value ? "" : value;
  const suggestions = useMemo(() => searchCities(searchValue, 12), [searchValue]);

  function selectCity(city: CityOption) {
    onCitySelect(city);
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && isOpen && suggestions[activeIndex]) {
      event.preventDefault();
      selectCity(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <label className="city-autocomplete-field" htmlFor={inputId}>
      <span>{label}</span>
      <div className="city-autocomplete">
        <input
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && suggestions[activeIndex] ? `${listId}-option-${activeIndex}` : undefined
          }
          value={value}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(event) => {
            onValueChange(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onBlur={() => {
            const exactCity = findCity(value);
            if (exactCity) onCitySelect(exactCity);
            setIsOpen(false);
          }}
          onKeyDown={handleKeyDown}
        />

        {isOpen ? (
          <ul className="city-options" id={listId} role="listbox">
            {suggestions.length ? (
              suggestions.map((city, index) => (
                <li
                  id={`${listId}-option-${index}`}
                  key={city.label}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? "is-active" : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectCity(city);
                  }}
                >
                  <MapPin aria-hidden="true" size={16} />
                  <span>{city.label}</span>
                  {selectedCity?.label === city.label ? (
                    <Check aria-hidden="true" size={16} />
                  ) : null}
                </li>
              ))
            ) : (
              <li className="city-empty">No matching city</li>
            )}
          </ul>
        ) : null}
      </div>
    </label>
  );
}
