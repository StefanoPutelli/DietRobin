import { NextResponse } from 'next/server';
import { deleteClientUser, getClientUserInfo} from '@/db/user';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    const userInfo = await getClientUserInfo(id);
    return NextResponse.json(userInfo);
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const user = await deleteClientUser(body.id);
    return NextResponse.json(user);
}



