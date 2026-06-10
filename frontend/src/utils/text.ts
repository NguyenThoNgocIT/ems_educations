const MOJIBAKE_PATTERN = /[\u00c2-\u00c6]|\u00e1[\u00ba\u00bb]/;

const WINDOWS_1252_REVERSE_MAP: Record<string, number> = {
  '\u20ac': 0x80,
  '\u201a': 0x82,
  '\u0192': 0x83,
  '\u201e': 0x84,
  '\u2026': 0x85,
  '\u2020': 0x86,
  '\u2021': 0x87,
  '\u02c6': 0x88,
  '\u2030': 0x89,
  '\u0160': 0x8a,
  '\u2039': 0x8b,
  '\u0152': 0x8c,
  '\u017d': 0x8e,
  '\u2018': 0x91,
  '\u2019': 0x92,
  '\u201c': 0x93,
  '\u201d': 0x94,
  '\u2022': 0x95,
  '\u2013': 0x96,
  '\u2014': 0x97,
  '\u02dc': 0x98,
  '\u2122': 0x99,
  '\u0161': 0x9a,
  '\u203a': 0x9b,
  '\u0153': 0x9c,
  '\u017e': 0x9e,
  '\u0178': 0x9f,
};

function toWindows1252Bytes(value: string) {
  const bytes: number[] = [];
  for (const char of Array.from(value)) {
    const mapped = WINDOWS_1252_REVERSE_MAP[char];
    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }

    const code = char.charCodeAt(0);
    if (code > 255) {
      return null;
    }
    bytes.push(code);
  }
  return Uint8Array.from(bytes);
}

export function fixMojibakeText(value?: string | null) {
  if (!value) return '';
  if (!MOJIBAKE_PATTERN.test(value)) return value;

  try {
    const bytes = toWindows1252Bytes(value);
    if (!bytes) {
      return value;
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

export function fixMojibakeList(values?: string[] | null) {
  return (values || []).map((value) => fixMojibakeText(value));
}
