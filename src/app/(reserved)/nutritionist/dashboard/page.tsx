import ClientList from "@/components/clientList";
import { authOptionsNutritionist } from "@/lib/auth";


export default async function Clients() {

    const session = await authOptionsNutritionist.auth();

    return (
        <>
            <ClientList session={session} />
        </>
    )
}