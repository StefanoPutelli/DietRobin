'use client';
import SearchBar from "@/components/SearchBar"
import { foodInterface } from "@/lib/foodApi";
import FoodDetails from "@/components/FoodDetails";
import React from "react"
import { ParsedNutritionData } from "@/lib/foodApi";

export default function FoodDetailsPage() {

    const tabs = ["Cerca", "Recenti"];
    const [custResult, setCustResult] = React.useState<foodInterface[]>([]);
    const [selectedFood, setSelectedFood] = React.useState<ParsedNutritionData | null>(null);
    const [custLoading, setCustLoading] = React.useState(false);
    const [recentFoodList, setRecentFoodList] = React.useState<foodInterface[]>([]);
    const [selectedFoodLoading, setSelectedFoodLoading] = React.useState(false);
    const [audio] = React.useState(typeof Audio !== "undefined" ? new Audio("/assets/donotdelete.mp3") : null);

    function saveSearchLocal(food: foodInterface) {
        const recentFoods = JSON.parse(localStorage.getItem("food_search") || "[]") as foodInterface[];
        let found = false;
        recentFoods.forEach((recentfood) => {
            if (recentfood.id === food.id) {
                found = true;
            }
        });
        if(found) return;
        if (recentFoods.length > 10) {
            recentFoods.shift();
        }
        recentFoods.push(food);
        localStorage.setItem("food_search", JSON.stringify(recentFoods));
        setRecentFoodList(recentFoods);
    }

    async function handleFoodClick(id: number) {
        if (selectedFoodLoading) return;
        setSelectedFoodLoading(true);
        setSelectedFood(null);
        const res = await fetch(`/api/food/details?id=${id}`);
        const data = await res.json();
        setSelectedFoodLoading(false);
        setSelectedFood(data);
    }

    React.useEffect(() => {
        const recentFoods = JSON.parse(localStorage.getItem("food_search") || "[]") as foodInterface[];
        setRecentFoodList(recentFoods);
    }, []);

    

    const sections = [
        <div className="w-full flex flex-col xl:flex-row h-full gap-[1.5em]">
            <div className="flex-1 flex flex-col overflow-hidden p-[2px]">
                <div className="w-full mb-[1em] ">
                    <SearchBar custResult={true} setCustResult={setCustResult} setCustLoading={setCustLoading} />
                </div>
                <div id="foodResultContainer" className="card w-full flex-1 glass overflow-y-scroll">
                    {custLoading ? <div className="w-full h-full flex justify-center items-center">
                        <span className="loading loading-spinner loading-lg"></span>                </div> : null}
                    {custResult.map((result: foodInterface) => (
                        <div key={result.id} onClick={() => { handleFoodClick(result.id); saveSearchLocal(result) }} className="w-[clac(100%-1em)] mx-[1em] border-base-300 border-b-[1px] p-2 mt-2 cursor-pointer hover:bg-base-300">
                            {result.foodName}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-scroll p-[2px]">
                <div className="card w-full h-full glass flex-1 overflow-y-scroll">
                    {selectedFoodLoading ? <div className="w-full h-full flex justify-center items-center">
                        <span className="loading loading-spinner loading-lg"></span>                </div> : null}
                    {selectedFood ? <div>
                        <FoodDetails npdata={selectedFood} />
                    </div> : null}
                </div>
            </div>
        </div>,
        <div className="w-full flex flex-col xl:flex-row h-full gap-[1.5em]">
            <div className="flex-1 flex flex-col overflow-hidden p-[2px]">
                <div id="foodResultContainer" className="card w-full flex-1 glass overflow-y-scroll">
                    {recentFoodList.map((result: foodInterface, index: number) => {
                        return (<div key={index} onClick={() => { handleFoodClick(result.id); }} className="w-[clac(100%-1em)] mx-[1em] border-base-300 border-b-[1px] p-2 mt-2 cursor-pointer hover:bg-base-300">
                            {result.foodName}
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="flex-1 overflow-y-scroll p-[2px]">
                <div className="card w-full h-full glass flex-1 overflow-y-scroll">
                    {selectedFoodLoading ? <div className="w-full h-full flex justify-center items-center">
                        <span className="loading loading-spinner loading-lg"></span>                </div> : null}
                    {selectedFood ? <div>
                        <FoodDetails npdata={selectedFood} />
                    </div> : null}
                </div>
            </div>
        </div>
    ]

    const handleClick = () => {
        if (audio) {
            audio.play();
        }
    };

    return (
        <div className="flex flex-col gap-[1em] relative h-full">
            <div role="tablist" className="tabs tabs-bordered">
                {tabs.map((tab, index) => (
                    <React.Fragment key={index}>
                        <input
                            type="radio"
                            name="foods_tabs"
                            role="tab"
                            className="tab z-10"
                            aria-label={tab}
                            defaultChecked={index === 0}
                        />
                        <div role="tabpanel" className="absolute tab-content top-0 left-0 pt-14 w-full h-full">
                            {sections[index]}
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <div className="absolute right-0 bottom-0 w-[1em] h-[1em]" onClick={handleClick} />
        </div>
    )
}