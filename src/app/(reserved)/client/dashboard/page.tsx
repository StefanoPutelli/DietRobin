'use server'
import { authOptionsClient } from "@/lib/auth";
import DietList from "@/components/DietList";

export default async function Clients() {

    const session = await authOptionsClient.auth();

    return (
        <div className="h-min w-full flex flex-wrap justify-center gap-[3em]">
            <DietList session={session}/>
        </div>
    )
}