import { authOptionsClient, authOptionsNutritionist } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server" 

export function GET(request: NextRequest) {
    const callbackUrl = request.cookies.get('authjs.callback-url')?.value || request.cookies.get("__Secure-authjs.callback-url")?.value as string;
    const url = new URL(callbackUrl);
    const role = url.pathname.split('/')[1];
    if(role === 'client') {
        return authOptionsClient.handlers.GET(request);
    } else if(role === 'nutritionist') {
        return authOptionsNutritionist.handlers.GET(request);
    } else {
        return NextResponse.json({ error: 'Invalid role' });
    }
}

export function POST(request: NextRequest) {
    const callbackUrl = request.cookies.get('authjs.callback-url')?.value || request.cookies.get("__Secure-authjs.callback-url")?.value as  string;
    const url = new URL(callbackUrl);
    const role = url.pathname.split('/')[1];
    if(role === 'client') {
        return authOptionsClient.handlers.POST(request);
    } else if(role === 'nutritionist') {
        return authOptionsNutritionist.handlers.POST(request);
    } else {
        return NextResponse.json({ error: 'invalid role' });
    }
}