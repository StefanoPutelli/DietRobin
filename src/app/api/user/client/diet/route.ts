import { NextResponse } from 'next/server';
import { getDietInfo } from '@/db/diet';
import { addDietToClient, deleteDietToClient } from '@/db/user';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientID = searchParams.get('clientID') || '';
    const dietInfo = await getDietInfo(clientID);
    return NextResponse.json(dietInfo);

}

export async function POST(request: Request) {
    const body = await request.json();
    const clientID = body.clientID;
    const dietName = body.dietName;
    const start = new Date(body.start);
    const end = new Date(body.end);
    const diet = await addDietToClient(clientID, dietName, start, end);
    if (!diet) {
        return NextResponse.json({ error: 'Diet not added' });
    }
    if (diet.error) {
        return NextResponse.json({ error: diet.error });
    }
    return NextResponse.json(diet);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientID = searchParams.get('clientID') || '';
    const dietID = searchParams.get('dietID') || '';
    const diet = await deleteDietToClient(clientID, dietID);
    if (!diet) {
        return NextResponse.json({ error: 'Diet not deleted' });
    }
    if (diet.error) {
        return NextResponse.json({ error: diet.error });
    }
    return NextResponse.json(diet);
}