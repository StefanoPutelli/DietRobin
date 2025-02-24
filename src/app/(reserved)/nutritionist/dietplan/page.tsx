import { authOptionsNutritionist } from "@/lib/auth";
import WeekDiet from "@/components/weekDiet";


export default async function Clients() {

    const session = await authOptionsNutritionist.auth();

    return (
        <>
            <WeekDiet session={session} />
        </>
    )
}