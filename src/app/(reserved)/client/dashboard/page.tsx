'use server'
import { authOptionsClient } from "@/lib/auth";

const clients = [
    {
        id: 1,
        name: "John Doe",
        email: "ciao"
    }
]

export default async function Clients() {

    const session = await authOptionsClient.auth();
    console.log(session);

    return (
        <div className="h-min w-full flex flex-wrap justify-center gap-[3em]">
            {clients.map((client, index) => {
                return (
                    <div key={index} className="card glass w-96 h-min">
                        <div className="px-[1rem] py-[1rem] border-b-[1px]">
                            <div className="card-title">{session?.user?.name}</div>
                        </div>
                        <div className="card-body">
                            <h2 className="card-title">Life hack</h2>
                            <p>How to park your car at your garage?</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Gestisci</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}