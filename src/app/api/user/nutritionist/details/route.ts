import { getNutritionistUserInfo } from '@/db/user';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const result = await getNutritionistUserInfo( id as string );
    if (result.error) {
        return NextResponse.json({ error: result.error });
    }
    return NextResponse.json(result);
}