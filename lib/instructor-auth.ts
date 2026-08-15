export const INSTRUCTOR_COOKIE = "frontline_instructor_access";

const DEFAULT_PASSWORD = "frontline25";

export function instructorPassword() {
  return process.env.INSTRUCTOR_RESOURCES_PASSWORD || DEFAULT_PASSWORD;
}

export async function instructorSessionToken() {
  const input = new TextEncoder().encode(`frontline-instructor:${instructorPassword()}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hasInstructorAccess(cookieValue?: string) {
  if (!cookieValue) return false;
  return cookieValue === await instructorSessionToken();
}
