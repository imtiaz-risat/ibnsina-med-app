import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  console.log("Middleware token: ", token);

  if (url.pathname.startsWith("/admin") && (!token || token.role !== "admin")) {
    url.pathname = "/login/admin";
    return NextResponse.redirect(url);
  }

  if (
    url.pathname.startsWith("/doctor") &&
    (!token || token.role !== "doctor")
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
