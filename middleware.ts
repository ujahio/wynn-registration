import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === "/") {
		const targetUrl = new URL("/register/user-info", request.url);
		return NextResponse.redirect(targetUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/"],
};
