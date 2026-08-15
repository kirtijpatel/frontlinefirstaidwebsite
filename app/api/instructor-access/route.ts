import { NextResponse } from "next/server";
import { INSTRUCTOR_COOKIE, instructorPassword, instructorSessionToken } from "@/lib/instructor-auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Please enter the instructor password." }, { status: 400 });
  }

  if (password !== instructorPassword()) {
    return NextResponse.json({ error: "That password is incorrect. Please try again." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(INSTRUCTOR_COOKIE, await instructorSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(INSTRUCTOR_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
