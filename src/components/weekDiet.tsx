'use client'
import { useSearchParams } from "next/navigation";
import React from "react"
import { useEffect, useState, useRef } from 'react';
import SearchBar from "./SearchBar";

const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
// const meals = ['Colazione', 'Spuntino', 'Pranzo', 'Merenda', 'Cena'];

export default function WeekDiet({readOnly = false}: {readOnly?: boolean}) {

    const params = useSearchParams();
    const [dietID, setdietID] = useState<string | null>(null);
    const [clientDiet, setClientDiet] = useState<any | null>(null);
    const [mealFoods, setMealFoods] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const errorRef = useRef<HTMLDivElement>(null);
    const selectedMeal = useRef<{
        day: number,
        name: string,
        id: string
    }>({
        day: 0,
        name: "",
        id: ""
    });
    const [mealToEdit, setMealToEdit] = useState<any | null>(null);

    const dietDayList = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (params.has('dietID')) {
            setdietID(params.get('dietID'));
        }
    }, [params]);

    useEffect(() => {
        if (dietID) {
            fetch(`/api/user/nutritionist/clientdiet?dietid=${dietID}`)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        setError("Error during diet fetching");
                    } else {
                        setClientDiet(res);
                    }
                }).catch(err => {
                    console.error(err);
                });
        }
    }, [dietID]);

    async function handleAddMeal(dietID: string, day: number, name: string, foods: { foodID: string, name: string, quantity: number }[]) {
        const res = await fetch(`/api/user/nutritionist/clientmeal`, {
            method: 'POST',
            body: JSON.stringify({
                dietID: dietID,
                day: day,
                name: name,
                foods: foods
            })
        });
        const data = await res.json();
        if (data.error) {
            setError("Error during meal addition");
        } else {
            setClientDiet(data);
        }
    }

    async function handleDeleteMeal(dietID: string, mealID: string) {
        const res = await fetch(`/api/user/nutritionist/deletemeal`, {
            method: 'POST',
            body: JSON.stringify({
                dietID: dietID,
                mealID: mealID
            })
        });
        const data = await res.json();
        console.log(data)
        if (data.error) {
            setError("Error during deletion");
        } else {
            console.log("before: ", clientDiet);
            console.log("after: ", data)
            setClientDiet(data);
        }
    }

    async function handleDeleteFoodFromMeal(dietID: string, mealID: string, foodID: string) {
        const res = await fetch(`/api/user/nutritionist/deletefoodmeal`, {
            method: 'POST',
            body: JSON.stringify({
                dietID: dietID,
                mealID: mealID,
                foodID: foodID
            })
        });
        const data = await res.json();
        if (data.error) {
            setError("Error during deletion");
        } else {
            const mealToEdit = clientDiet.meals.find((meal: any) => meal._id === mealID);
            if (mealToEdit) {
                mealToEdit.foods = mealToEdit.foods.filter((food: any) => food.foodID !== foodID);
            } else {
                setError("Meal not found");
            }
            setClientDiet({
                ...clientDiet,
                meals: [
                    ...clientDiet.meals.filter((meal: any) => meal._id !== mealID),
                    mealToEdit
                ]
            });
        }
    }

    useEffect(() => {
        if (error) {
            errorRef.current?.style.setProperty('transition', 'bottom 0.5s ease-in-out');
            errorRef.current?.style.setProperty('bottom', '10px');
            setTimeout(() => {
                errorRef.current?.style.setProperty('bottom', '-100px');
                setError(null);
            }, 2000);
        }
    }, [error])


    if (!clientDiet)
        return (
            <div className="flex items-center justify-center w-full h-full ">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )


    return (
        <>
            <div ref={errorRef} role="alert" className="alert alert-error w-[500px] absolute bottom-[-100px] right-[5%] z-[999999999999999999]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="addMeal" className="modal modal-bottom sm:modal-middle">
                <form className="modal-box">
                    <h3 className="font-bold text-lg">Aggiungi alimenti</h3>
                    <div className="w-full h-[50vh] sm:h-[70vh] mt-[1em]">
                        <input type="text" id="mealNameId" className="input input-bordered w-full mt-[1em]" placeholder="Nome pasto" required />
                        <div className="divider" />
                        <div className="">
                            <SearchBar setCustResult={() => { }} setCustLoading={() => { }} custResult={false} clickHandler={(result) => {
                                setMealFoods([...mealFoods, result]);
                            }} />
                        </div>

                        <div className="w-full mt-[1em] flex flex-col gap-[0.5em] overflow-scroll">
                            {mealFoods.map((food, index) => (
                                <li key={index} className="flex items-center justify-between w-full">
                                    <span>{food.foodName}</span>
                                    <div className="flex items-center justify-end gap-[1em]">
                                        <input
                                            name="quantity"
                                            id={`grammi-${index}`}
                                            type="number"
                                            placeholder="Grammi"
                                            className="input input-bordered w-24 ml-2"
                                            required
                                        />
                                        <button type="button" className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.5em] aspect-square" onClick={() => {
                                            setMealFoods(mealFoods.filter((_, i) => i !== index));
                                        }}>
                                            <svg className="h-5 w-5 text-primary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className="modal-action items-center">
                        <button type="button" className="btn btn-primary" onClick={() => {
                            const quantities = mealFoods.map((_, index) => (document.getElementById(`grammi-${index}`) as HTMLInputElement).value);
                            const mealNameElem = (document.getElementById('mealNameId') as HTMLInputElement);
                            const mealName = mealNameElem.value;
                            if (quantities.some(quantity => !quantity) || mealName === "") {
                                setError("Compilare tutti i campi");
                                return;
                            }
                            handleAddMeal(clientDiet._id, selectedMeal.current.day, mealName, mealFoods.map((food) => ({
                                foodID: food.id,
                                quantity: parseInt(quantities[mealFoods.indexOf(food)]),
                                name: food.foodName
                            })));
                            const modal = document.getElementById('addMeal') as HTMLDialogElement;
                            setMealFoods([]);
                            mealNameElem.value = "";
                            modal.close();
                        }}>Aggiungi</button>
                        <button type="button" className="btn" onClick={() => {
                            const modal = document.getElementById('addMeal') as HTMLDialogElement;
                            const mealNameElem = (document.getElementById('mealNameId') as HTMLInputElement);
                            setMealFoods([]);
                            mealNameElem.value = "";
                            modal.close();
                        }}>Chiudi</button>
                    </div>
                </form>
            </dialog>
            <dialog id="editMeal" className="modal modal-bottom sm:modal-middle">
                <form className="modal-box">
                    <h3 className="font-bold text-lg">Modifica Alimenti</h3>
                    <div className="w-full flex flex-col gap-[10px] h-[50vh] sm:h-[70vh] mt-[1em] overflow-scroll">
                        {mealToEdit ? mealToEdit.foods.map((food: any, food_index: number) => {
                            return (
                                <div key={food_index} className="flex justify-between items-center w-full">
                                    <span className="overflow-hidden text-ellipsis text-nowrap">{food.name}</span>
                                    <div className="flex items-center gap-[0.5em]">
                                        <span className="overflow-hidden text-ellipsis text-nowrap">{food.quantity}g</span>
                                        <button type="button" className="btn min-h-0 h-[2.5em] btn-primary btn-error p-[0.5em] aspect-square" onClick={() => {
                                            handleDeleteFoodFromMeal(clientDiet._id, selectedMeal.current.id, food.foodID);
                                        }}>
                                            <svg className="h-5 w-5 text-secondary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : null}
                    </div>
                    <div className="modal-action items-center">
                        <button type="button" className="btn" onClick={() => {
                            const modal = document.getElementById('editMeal') as HTMLDialogElement;
                            setMealFoods([]);
                            modal.close();
                        }}>Chiudi</button>
                    </div>
                </form>
            </dialog>
            {/* {!dietID ?
                <div className="w-full h-full flex justify-center items-center bg-transparent">
                    <span className="loading loading-lg" />
                </div>
                :
                <div className="w-full h-full relative">
                    <table className="table-auto w-full overflow-scroll">
                        <thead>
                            <tr>
                                <th className="text-primary text-start">Pasto</th>
                                {days.map((day, index) => {
                                    return (
                                        <th style={{
                                            width: 'calc(100%/' + (days.length + 1) + ')',
                                            minWidth: 100
                                        }} key={index}>{day}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal, meal_index) => {
                                return (
                                    <tr key={meal_index}>
                                        <td>{meal}</td>
                                        {days.map((day, day_index) => {
                                            return (
                                                <td key={day_index}>
                                                    <div className="card glass aspect-square w-full hover:scale-[1.1] hover:z-10 cursor-pointer transition-all" onClick={
                                                        () => {
                                                            selectedMeal.current = {
                                                                day: day_index,
                                                                time: meal_index
                                                            };
                                                            (document.getElementById('addMeal') as HTMLDialogElement)?.showModal()
                                                        }
                                                    }>
                                                        <div className="card-body relative">
                                                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 hover:opacity-100">
                                                                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            } */}
            {!dietID ?
                <div className="w-full h-full flex justify-center items-center bg-transparent">
                    <span className="loading loading-lg" />
                </div>
                :
                <div ref={dietDayList} className="flex lg:flex-row flex-col justify-evenly flex-wrap gap-[1em]">
                    {days.map((day, index) => {
                        return (
                            <div key={day + " " + index} className="card lg:w-[calc(50%-1em)] 2xl:w-[calc(33%-1em)] w-full glass mt-[1em]">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <h2 className="card-title">{day}</h2>
                                        <div className="flex items-center gap-[0.5em]">
                                            {!readOnly && <button className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.6em] aspect-square z-10" onClick={
                                                () => {
                                                    selectedMeal.current = {
                                                        day: index,
                                                        name: "",
                                                        id: ""
                                                    };
                                                    (document.getElementById('addMeal') as HTMLDialogElement)?.showModal()
                                                }
                                            }>
                                                <svg className="h-4 w-4 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>}
                                            {/* <button className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.6em] aspect-square" onClick={() => {
                                                const acc = dietDayList.current?.getElementsByClassName('meal-accordion-' + day);
                                                if (acc) {
                                                    const checked = (acc[0] as HTMLInputElement).checked;
                                                    for (let i = 0; i < acc.length; i++) {
                                                        (acc[i] as HTMLInputElement).checked = !checked;
                                                    }
                                                }
                                            }}>

                                                <svg className="h-4 w-4 text-primary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <polyline points="3 8 6 5 9 8" />  <polyline points="3 16 6 19 9 16" />  <line x1="6" y1="5" x2="6" y2="19" />  <line x1="13" y1="6" x2="20" y2="6" />  <line x1="13" y1="12" x2="20" y2="12" />  <line x1="13" y1="18" x2="20" y2="18" /></svg>
                                            </button> */}
                                        </div>
                                    </div>
                                    {clientDiet.meals.filter((meal: any) => meal.day === index).map((meal: any, meal_index: any) => {
                                        return (
                                            <div key={meal.name + " " + meal_index} className="collapse collapse-arrow border-primary border-2 rounded-lg mt-[1em]">
                                                <input type="checkbox" className={"meal-accordion-" + day} name="meal-accordion" />

                                                <div className="collapse-title text-xl font-medium flex items-center justify-between gap-[0.5em]">
                                                    {meal.name}
                                                    {!readOnly && <div className="flex items-center gap-[0.3em]">
                                                        <button className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.6em] aspect-square z-10" onClick={
                                                            () => {
                                                                selectedMeal.current = {
                                                                    day: index,
                                                                    name: meal.name,
                                                                    id: meal._id
                                                                };
                                                                const mealname = meal.name;
                                                                setMealToEdit(clientDiet.meals.filter((meal: any) => meal.day === index && meal.name === mealname)[0]);
                                                                (document.getElementById('editMeal') as HTMLDialogElement)?.showModal()
                                                            }
                                                        }>
                                                            <svg className="h-4 w-4 text-primary-content" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                                                        </button>
                                                        <button type="button" className="btn min-h-0 h-[2.5em] btn-primary btn-outline p-[0.5em] aspect-square z-10" onClick={() => {
                                                            handleDeleteMeal(clientDiet._id, meal._id);
                                                        }}>
                                                            <svg className="h-5 w-5 text-primary-content" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                                        </button>
                                                    </div>}
                                                </div>
                                                <div className="collapse-content">
                                                    <div className="flex flex-col gap-[10px] justify-between items-center">
                                                        {meal.foods.map((food: any, food_index: number) => {
                                                            return (
                                                                <div key={food_index} className="flex justify-between items-center w-full">
                                                                    <span>{food.name}</span>
                                                                    <span>{food.quantity}g</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>

                            </div>
                        )
                    })}
                </div>
            }
        </>
    )
}

