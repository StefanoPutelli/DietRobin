import { NextResponse, NextRequest } from "next/server"
import { authOptionsClient, authOptionsNutritionist } from "@/lib/auth";

const notProtected = [
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
]

export default async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  for (const path of notProtected) {
    if (url.pathname.startsWith(path)) {
      return NextResponse.next();
    }
  }
  if(url.pathname.startsWith('/client')) {
    const session = await authOptionsClient.auth();
    if (!session || session.user.role !== 'client') 
      return NextResponse.redirect(new URL('/login', request.url))
  } else if(url.pathname.startsWith('/nutritionist')) {
    const session = await authOptionsNutritionist.auth();
    if (!session || session.user.role !== 'nutritionist') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } else if(url.pathname.startsWith('/api/nutritionist')) {
    const session = await authOptionsNutritionist.auth();
    if(!session || session.user.role !== 'nutritionist') {
      // return access denied
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }
  }
  return NextResponse.next()
}