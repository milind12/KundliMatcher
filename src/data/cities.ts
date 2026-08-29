export interface CityOption {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const CITY_OPTIONS: CityOption[] = [
  { label: "Ahmedabad, India", latitude: 23.0225, longitude: 72.5714, timezone: "+05:30" },
  { label: "Bengaluru, India", latitude: 12.9716, longitude: 77.5946, timezone: "+05:30" },
  { label: "Chennai, India", latitude: 13.0827, longitude: 80.2707, timezone: "+05:30" },
  { label: "Delhi, India", latitude: 28.6139, longitude: 77.209, timezone: "+05:30" },
  { label: "Hyderabad, India", latitude: 17.385, longitude: 78.4867, timezone: "+05:30" },
  { label: "Jaipur, India", latitude: 26.9124, longitude: 75.7873, timezone: "+05:30" },
  { label: "Kolkata, India", latitude: 22.5726, longitude: 88.3639, timezone: "+05:30" },
  { label: "Mumbai, India", latitude: 19.076, longitude: 72.8777, timezone: "+05:30" },
  { label: "New York, United States", latitude: 40.7128, longitude: -74.006, timezone: "-05:00" },
  { label: "London, United Kingdom", latitude: 51.5072, longitude: -0.1276, timezone: "+00:00" },
  { label: "Dubai, United Arab Emirates", latitude: 25.2048, longitude: 55.2708, timezone: "+04:00" },
  { label: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: "+08:00" }
];
