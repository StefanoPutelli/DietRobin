// import { authOptionsNutritionist } from "@/lib/auth";
import WeekDiet from "@/components/weekDiet";
import { Suspense } from "react";


export default async function Diet() {

    return (
        <Suspense>
            <WeekDiet readOnly={true}/>
        </Suspense>
    )
}