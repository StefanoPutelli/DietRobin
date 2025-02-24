'use client';

import { doClientLogout, doNutritionistLogout } from "@/app/actions/authAction";
import {useState, useEffect} from "react";
import logo from "@/asstes/logo.svg"

export default function NavBar() {

    const [role, setRole] = useState<string>();

    useEffect(() => {
        setRole(window.location.pathname.split("/")[1]);
    }, [])

    return (
        <div className="navbar flex w-full gap-[0.5em] justify-between h-full">
            <div className="flex-none xl:w-0 overflow-hidden">
                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-6 w-6 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <img src={logo.src} alt="logo" className="h-[80%]"/>
            <div className="flex-none">
                <div className="flex gap-[0.5em]">
                    {role === "client" ? (
                        <form action={doClientLogout}>
                            <button className="btn btn-ghost">Logout</button>
                        </form>
                    ) : (
                        <form action={doNutritionistLogout}>
                            <button className="btn btn-ghost">Logout</button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    )
}