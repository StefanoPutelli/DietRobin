import { searchFood } from "@/lib/foodApi";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const result = await searchFood(query);
    return NextResponse.json(result);
}