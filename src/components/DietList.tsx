'use client';
import React from "react"
import { useRouter } from "next/navigation"

export interface Diet {
    _id:   string;
    name:  string;
    start: Date;
    end:   Date;
    meals: string[];
    __v:   number;
}

export default function DietList({ session }: { session: any }) {

    const [diets, setDiets] = React.useState<any>(null)
    const [mainLoading, setMainLoading] = React.useState<boolean>(false)
    // const [error, setError] = React.useState<string | null>(null)
    // const newClientForm = React.useRef<HTMLFormElement>(null)
    // const newDietForm = React.useRef<HTMLFormElement>(null)

    const router = useRouter();

    React.useEffect(() => {
        if (!session) return
        setMainLoading(true)
        fetch(`/api/user/client/diet?clientID=${session.user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error)
                    return
                }
                setMainLoading(false)
                setDiets(data)
            })
            .catch((error) => {
                setMainLoading(false)
                console.error('Error:', error)
            })
    }, [session])

    return (
        <>
            {mainLoading ? <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-lg"></div>
            </div> :
                <>                
                    {diets ?
                        <div className="h-min w-full flex flex-wrap gap-[3em]">
                            {
                                diets.length ? diets.map((diet: any, index: number) => {
                                    return (
                                        <div key={index} className="card glass w-96 h-min">
                                            <div className="px-[1rem] py-[1rem] border-b-[1px] flex justify-between">
                                                <div className="card-title flex flex-col items-start gap-[0.1em]">
                                                    <span>{diet.name}</span>
                                                </div>
                                            </div>
                                            <div className="card-body p-[1em]">
                                                <div className="flex flex-col gap-2">
                                                    <p><strong>Start:</strong> {new Date(diet.start).toLocaleDateString()}</p>
                                                    <p><strong>End:</strong> {new Date(diet.end).toLocaleDateString()}</p>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => router.push(`/client/dietplan?dietID=${diet._id}`)}
                                                    >
                                                        View Diet
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : "Non ci sono clienti da mostrare"
                            }
                        </div> : null}
                </>
            }
        </>
    )
}