import { NextResponse, NextRequest } from 'next/server';
import { addMealToDiet } from '@/db/diet';

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
    const { dietID, day, name, foods } = body;
    const result = await addMealToDiet(dietID, day, name, foods);
    if (result.error) {
        return NextResponse.json({ error: result.error });
    }
    return NextResponse.json(result);
}

// export async function DELETE(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const dietID = searchParams.get('mealid') || '';
//     const result = await deleteFoodFromMeal(dietID as string);
//     if (result.error) {
//         return NextResponse.json({ error: result.error });
//     }
//     return NextResponse.json(result);
// }

