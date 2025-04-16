// import { authOptionsNutritionist } from "@/lib/auth";
import WeekDiet from "@/components/weekDiet";
import { Suspense } from "react";


export default async function Clients() {

    return (
        <Suspense>
            <WeekDiet readOnly={false}/>
        </Suspense>
    )
}