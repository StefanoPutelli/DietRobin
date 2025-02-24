import { NextResponse, NextRequest } from 'next/server';
import { getFoodDetailsById } from '@/lib/foodApi';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const result = await getFoodDetailsById(id);
    return NextResponse.json(result);
}