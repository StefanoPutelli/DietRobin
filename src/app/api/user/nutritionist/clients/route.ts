import { getNutritionistClientAndDietInfo, getClientUserInfoByEmail, addClientToNutritionist, DeleteClientFromNutritionist } from '@/db/user';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const result = await getNutritionistClientAndDietInfo(id as string);
    if (result.error) {
        return NextResponse.json({ error: result.error });
    }
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const clientInfo = await getClientUserInfoByEmail(body.email);
    if (!clientInfo) {
        return NextResponse.json({ error: "Client not found" });
    }
    if (clientInfo.error) {
        return NextResponse.json({ error: clientInfo.error });
    }
    const nutritionist = await addClientToNutritionist(body.nutritionistId, clientInfo);
    if (!nutritionist) {
        return NextResponse.json({ error: "Nutritionist not found" });
    }
    if (nutritionist.error) {
        return NextResponse.json({ error: nutritionist.error });
    }
    return NextResponse.json(nutritionist);
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientID') || '';
    const nutritionistId = searchParams.get('nutritionistID') || '';

    if (!clientId || !nutritionistId) {
        return NextResponse.json({ error: "Client ID and Nutritionist ID are required" });
    }

    const result = await DeleteClientFromNutritionist(nutritionistId, clientId);
    if (result.error) {
        return NextResponse.json({ error: result.error });
    }

    return NextResponse.json(result);
}