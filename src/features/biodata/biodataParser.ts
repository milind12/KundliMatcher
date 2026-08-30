export interface ParsedBiodata {
  name: string;
  date: string;
  time: string;
  place: string;
  rawText: string;
}

const MONTHS: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12
};

const DATE_LABELS = ["date\\s+of\\s+birth", "birth\\s+date", "d\\.?\\s*o\\.?\\s*b\\.?"];
const TIME_LABELS = ["time\\s+of\\s+birth", "birth\\s+time", "time"];
const PLACE_LABELS = [
  "place\\s+of\\s+birth",
  "birth\\s*place",
  "birthplace",
  "city\\s+of\\s+birth",
  "birth\\s+city",
  "location"
];
const NAME_LABELS = [
  "full\\s+name",
  "candidate(?:'s)?\\s+name",
  "boy(?:'s)?\\s+name",
  "girl(?:'s)?\\s+name",
  "name"
];
const DEFAULT_BIRTH_TIME = "12:00";
const STRUCTURAL_LABELS = [
  ...NAME_LABELS,
  ...DATE_LABELS,
  ...TIME_LABELS,
  ...PLACE_LABELS,
  "age",
  "height",
  "weight",
  "religion",
  "caste",
  "sub[ -]?caste",
  "gotra",
  "manglik",
  "marital\\s+status",
  "education",
  "qualification",
  "occupation",
  "profession",
  "income",
  "company",
  "hobbies",
  "father(?:'s)?\\s+name",
  "mother(?:'s)?\\s+name",
  "family",
  "address",
  "contact",
  "phone",
  "mobile"
];

const STRUCTURAL_LABEL_PATTERN = new RegExp(
  `^(?:${STRUCTURAL_LABELS.join("|")})\\s*(?::|[-–—])?\\s*$`,
  "i"
);

function isStructuralLabel(value: string): boolean {
  return STRUCTURAL_LABEL_PATTERN.test(value.trim());
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function labeledValue(text: string, labels: string[]): string {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const labelPattern = labels.join("|");
  const pattern = new RegExp(`^(?:${labelPattern})\\s*(?::|[-–—])?\\s*(.*)$`, "i");

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(pattern);
    if (!match) continue;

    const sameLine = match[1]?.trim();
    if (sameLine && !isStructuralLabel(sameLine)) return sameLine;

    const nextLine = lines[index + 1]?.trim() ?? "";
    if (nextLine && !isStructuralLabel(nextLine)) return nextLine;

    let labelBlockStart = index;
    while (labelBlockStart > 0 && isStructuralLabel(lines[labelBlockStart - 1])) {
      labelBlockStart -= 1;
    }

    let labelBlockEnd = index;
    while (labelBlockEnd + 1 < lines.length && isStructuralLabel(lines[labelBlockEnd + 1])) {
      labelBlockEnd += 1;
    }

    const valueIndex = labelBlockEnd + 1 + (index - labelBlockStart);
    const alignedValue = lines[valueIndex]?.trim() ?? "";
    if (alignedValue && !isStructuralLabel(alignedValue)) return alignedValue;
  }

  const inlinePattern = new RegExp(
    `(?:${labelPattern})\\s*(?::|[-–—])?\\s*([^|\\n]{2,100})`,
    "i"
  );
  return text.match(inlinePattern)?.[1]?.trim() ?? "";
}

function fullYear(year: number): number {
  if (year >= 100) return year;
  const currentYear = new Date().getFullYear() % 100;
  return year <= currentYear ? 2000 + year : 1900 + year;
}

function toIsoDate(day: number, month: number, year: number): string {
  const normalizedYear = fullYear(year);
  const date = new Date(Date.UTC(normalizedYear, month - 1, day));
  if (
    date.getUTCFullYear() !== normalizedYear ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return `${String(normalizedYear).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(value: string): string {
  const numeric = value.match(/\b(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{2,4})\b/);
  if (numeric) return toIsoDate(Number(numeric[1]), Number(numeric[2]), Number(numeric[3]));

  const dayFirst = value.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s*[-./]?\s*([a-z]{3,9})[,]?\s*[-./]?\s*(\d{2,4})\b/i
  );
  if (dayFirst) {
    return toIsoDate(
      Number(dayFirst[1]),
      MONTHS[dayFirst[2].toLowerCase()] ?? 0,
      Number(dayFirst[3])
    );
  }

  const monthFirst = value.match(
    /\b([a-z]{3,9})\s*[-./]?\s*(\d{1,2})(?:st|nd|rd|th)?[,]?\s*[-./]?\s*(\d{2,4})\b/i
  );
  if (monthFirst) {
    return toIsoDate(
      Number(monthFirst[2]),
      MONTHS[monthFirst[1].toLowerCase()] ?? 0,
      Number(monthFirst[3])
    );
  }

  return "";
}

function parseTime(value: string): string {
  const match = value.match(/\b(\d{1,2})\s*[:.]\s*(\d{2})\s*([ap]\.?\s*m\.?)?\b/i);
  if (!match) return "";

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.replace(/[^apm]/gi, "").toLowerCase();

  if (minute > 59 || hour > (meridiem ? 12 : 23)) return "";
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function uniqueFallback(text: string, parser: (value: string) => string, pattern: RegExp): string {
  const values = Array.from(text.matchAll(pattern), (match) => parser(match[0])).filter(Boolean);
  const unique = [...new Set(values)];
  return unique.length === 1 ? unique[0] : "";
}

function cleanField(value: string): string {
  return value
    .split(/\s{2,}|\||;/)[0]
    .replace(/^[.:\-–—\s]+|[.:\-–—\s]+$/g, "")
    .trim();
}

function firstNameFallback(text: string): string {
  const headingPattern = /^(?:marriage|matrimonial|personal)?\s*(?:bio\s*data|biodata|profile|personal details)$/i;
  const namePattern = /^(?:[a-z]+(?:[.'’-][a-z]+)*)(?:\s+[a-z]+(?:[.'’-][a-z]+)*){1,5}$/i;

  for (const line of text.split("\n")) {
    const candidate = cleanField(line);
    if (
      !candidate ||
      isStructuralLabel(candidate) ||
      headingPattern.test(candidate) ||
      /[:|@/\\]|\d/.test(candidate)
    ) {
      continue;
    }

    if (namePattern.test(candidate)) return candidate;
  }

  return "";
}

export function parseBiodataText(input: string): ParsedBiodata {
  const rawText = cleanText(input);
  const labeledName = cleanField(labeledValue(rawText, NAME_LABELS));
  const labeledDate = parseDate(labeledValue(rawText, DATE_LABELS));
  const labeledTime = parseTime(labeledValue(rawText, TIME_LABELS));

  const date =
    labeledDate ||
    uniqueFallback(
      rawText,
      parseDate,
      /\b(?:\d{1,2}\s*[./-]\s*\d{1,2}\s*[./-]\s*\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s*[-./]?\s*[a-z]{3,9}[,]?\s*[-./]?\s*\d{2,4}|[a-z]{3,9}\s*[-./]?\s*\d{1,2}(?:st|nd|rd|th)?[,]?\s*[-./]?\s*\d{2,4})\b/gi
    );
  const time =
    labeledTime ||
    uniqueFallback(rawText, parseTime, /\b\d{1,2}\s*[:.]\s*\d{2}\s*(?:[ap]\.?\s*m\.?)?\b/gi) ||
    DEFAULT_BIRTH_TIME;

  return {
    name: labeledName || firstNameFallback(rawText),
    date,
    time,
    place: cleanField(labeledValue(rawText, PLACE_LABELS)),
    rawText
  };
}
