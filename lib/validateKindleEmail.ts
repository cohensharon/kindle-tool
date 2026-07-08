export type KindleEmailValidationResult =
  | {
      valid: true;
      email: string;
    }
  | {
      valid: false;
      email: string;
      error: string;
    };

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateKindleEmail(value: string): KindleEmailValidationResult {
  const email = value.trim();

  if (!looksLikeEmail(email)) {
    return {
      valid: false,
      email,
      error: "Please enter a valid email address.",
    };
  }

  return {
    valid: true,
    email,
  };
}
