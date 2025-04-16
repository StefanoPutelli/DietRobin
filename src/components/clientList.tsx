'use client';
import React from "react"
import { useRouter } from "next/navigation"

export default function ClientList({ session }: { session: any }) {

    const [nutritionist, setNutritionist] = React.useState<any>(null)
    const [clientsLoading, setClientsLoading] = React.useState<boolean>(false)
    const [dietLoading, setDietLoading] = React.useState<boolean>(false)
    const [mainLoading, setMainLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const newClientForm = React.useRef<HTMLFormElement>(null)
    const newDietForm = React.useRef<HTMLFormElement>(null)

    const router = useRouter();

    const selectedClient = React.useRef<any>(null)

    React.useEffect(() => {
        if (!session) return
        setMainLoading(true)
        fetch(`/api/user/nutritionist/clients?id=${session.user.id}`, {
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
                setNutritionist(data)
            })
            .catch((error) => {
                setMainLoading(false)
                console.error('Error:', error)
            })
    }, [session])

    async function handleSubmitNewClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (clientsLoading) return;
        setClientsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email');
        const response = await fetch('/api/user/nutritionist/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                nutritionistId: session.user.id
            })
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error)
            setClientsLoading(false);
            setError(data.error);
            return
        }
        setNutritionist(data);
        setClientsLoading(false);
        // Reset the form
        newClientForm.current?.reset();
        // Close the modal
        const modal = document.getElementById('newClient') as HTMLDialogElement;
        modal.close();
    }

    async function handleSubmitNewDiet(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (dietLoading) return;

        setDietLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const nome = formData.get('nome');
        const start = formData.get('start');
        const end = formData.get('end');
        const response = await fetch('/api/user/client/diet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientID: selectedClient.current._id,
                dietName: nome,
                start: start,
                end: end
            })
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error)
            setDietLoading(false);
            setError(data.error);
            return
        }
        const updatedClients = nutritionist.clients.map((client: any) => {
            if (client._id === selectedClient.current._id) {
                client.diet.push(data);
            }
            return client;
        })
        setNutritionist({
            ...nutritionist,
            clients: updatedClients
        });
        setDietLoading(false);
        // Reset the form
        newDietForm.current?.reset();
        // Close the modal
        const modal = document.getElementById('newDiet') as HTMLDialogElement;
        modal.close();
    }

    async function handleDeleteDiet(clientID: string, dietID: string) {
        const response = await fetch(`/api/user/client/diet?clientID=${clientID}&dietID=${dietID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error)
            setError(data.error);
            return
        }
        const updatedClients = nutritionist.clients.map((client: any) => {
            if (client._id === clientID) {
                client.diet = client.diet.filter((diet: any) => diet._id !== dietID);
            }
            return client;
        })
        setNutritionist({
            ...nutritionist,
            clients: updatedClients
        });
    }

    async function handleDeleteClient(clientID: string, nutritionistID: string) {
        const response = await fetch(`/api/user/nutritionist/clients?clientID=${clientID}&nutritionistID=${nutritionistID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error)
            setError(data.error);
            return
        }
        setNutritionist(data);
    }

    return (
        <>
            {mainLoading ? <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-lg"></div>
            </div> :
                <>
                    <div className="flex items-center justify-between mb-[2em]">
                        <div>
                            {nutritionist ? <span className="text-[1.2em] font-semibold">{nutritionist.name}</span> : null}
                        </div>
                        <div onClick={() => {
                            const modal = document.getElementById('newClient');
                            if (modal) {
                                (modal as HTMLDialogElement).showModal();
                            }
                        }} className="cursor-pointer font-semibold flex items-center justify-center w-min gap-[0.2em] px-[1em] py-[0.5em] hover:border-base-300 border-transparent border-[1px] rounded-md transition-all">
                            <svg className="h-6 w-6 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="h-full mt-[2px]">
                                Cliente
                            </span>
                        </div>
                    </div>
                    <dialog id="newClient" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Aggiungi un cliente</h3>
                            <form ref={newClientForm} className="py-4" onSubmit={handleSubmitNewClient}>
                                <div className="form-control">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" name="email" id="email" defaultValue="" className="input input-bordered" required />
                                </div>
                                <div className="modal-action items-center">
                                    {clientsLoading ? <span className="loading loading-spinner loading-md mr-[1em]"></span> : null}
                                    {error ? <span className="text-error h-min">{error}</span> : null}
                                    <button type="submit" className="btn btn-primary">Aggiungi</button>
                                    <button type="button" className="btn" onClick={() => {
                                        const modal = document.getElementById('newClient') as HTMLDialogElement;
                                        newClientForm.current?.reset();
                                        setError(null);
                                        modal.close();
                                    }}>Chiudi</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <dialog id="newDiet" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Aggiungi dieta al cliente</h3>
                            <form ref={newDietForm} className="py-4" onSubmit={handleSubmitNewDiet}>
                                <div className="form-control">
                                    <label className="label" htmlFor="nome">
                                        <span className="label-text">Nome</span>
                                    </label>
                                    <input type="text" name="nome" id="nome" defaultValue="" className="input input-bordered" required />
                                    <label className="label" htmlFor="start">
                                        <span className="label-text">Data di inizio</span>
                                    </label>
                                    <input type="date" name="start" id="start" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor="end">
                                        <span className="label-text">Data di fine</span>
                                    </label>
                                    <input type="date" name="end" id="end" className="input input-bordered" required />
                                </div>
                                <div className="modal-action items-center">
                                    {dietLoading ? <span className="loading loading-spinner loading-md mr-[1em]"></span> : null}
                                    {error ? <span className="text-error h-min">{error}</span> : null}
                                    <button type="submit" className="btn btn-primary">Aggiungi</button>
                                    <button type="button" className="btn" onClick={() => {
                                        const modal = document.getElementById('newDiet') as HTMLDialogElement;
                                        newClientForm.current?.reset();
                                        setError(null);
                                        selectedClient.current = null;
                                        modal.close();
                                    }}>Chiudi</button>
                                </div>
                            </form>
                        </div>
                    </dialog >
                    {nutritionist ?
                        <div className="h-min w-full flex flex-wrap gap-[3em]">
                            {
                                nutritionist.clients.length ? nutritionist.clients.map((client: any, index: number) => {
                                    return (
                                        <div key={index} className="card glass w-96 h-min">
                                            <div className="px-[1rem] py-[1rem] border-b-[1px] flex justify-between">
                                                <div className="card-title flex flex-col items-start gap-[0.1em]">
                                                    <span>{client.name}</span>
                                                    <span className="text-[0.8em] font-normal">{client.mail}</span>
                                                </div>
                                                <button type="button" className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.5em] aspect-square z-10" onClick={() => {
                                                    handleDeleteClient(client._id, nutritionist._id);
                                                }}>
                                                    <svg className="h-5 w-5 text-primary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                                </button>
                                            </div>
                                            <div className="card-body p-[1em]">
                                                {client.diet.length ? client.diet.map((diet: any, index: number) => {
                                                    return (
                                                        <div key={index} className="flex items-center justify-between border-base-300 border-[1px] px-[1em] py-[0.5em] rounded-md">
                                                            <span>{diet.name}</span>
                                                            <div className="flex items-center gap-[0.5em]">
                                                                <button className="btn btn-primary btn-outline btn-sm" onClick={() => {
                                                                    router.push(`/nutritionist/dietplan?dietID=${diet._id}`);
                                                                }}>
                                                                    Gestisci
                                                                </button>
                                                                <button type="button" className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.5em] aspect-square z-10" onClick={() => {
                                                                    handleDeleteDiet(client._id, diet._id);
                                                                }}>
                                                                    <svg className="h-5 w-5 text-primary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                    :
                                                    null
                                                }
                                                <div onClick={() => {
                                                    const modal = document.getElementById('newDiet');
                                                    selectedClient.current = client;
                                                    if (modal) {
                                                        (modal as HTMLDialogElement).showModal();
                                                    }
                                                }} className="cursor-pointer font-semibold flex items-center justify-center w-min gap-[0.2em] px-[1em] py-[0.5em] hover:border-base-300 border-transparent border-[1px] rounded-md transition-all">
                                                    <svg className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="h-full mt-[2px] text-[0.9em]">
                                                        Dieta
                                                    </span>
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