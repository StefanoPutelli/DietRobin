import { NextResponse, NextRequest } from 'next/server';
import { deleteFoodFromMeal } from '@/db/diet';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const dietID = searchParams.get('dietid') || '';
//     const result = await getDietInfo(dietID as string);
//     if (result.error) {
//         return NextResponse.json({ error: result.error });
//     }
//     return NextResponse.json(result);
// }

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { dietID, mealID, foodID } = body;
        const result = await deleteFoodFromMeal(dietID, mealID, foodID);
    if (result.error) {
        return NextResponse.json({ error: result.error });
    }
    return NextResponse.json(result);
}

