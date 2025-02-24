'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavigationLinks() {

    const router = useRouter();
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        setRole(window.location.pathname.split("/")[1]);
    }, [])

    let title = "";
    if(role === "nutritionist") {
        title = "Nutrizionista";
    } else if(role === "client") {
        title = "Cliente";
    }

    return (
        <li>
            <h2 className="menu-title">{title}</h2>
            {role !== "" && (role === "nutritionist" || role === "client") ? <ul>
                {[
                    {
                        title: "Dashboard",
                        link: "/" + role + "/dashboard",
                    },
                    {
                        title: "Catalogo alimenti",
                        link: "/" + role + "/foods",
                    }
                ].map((item, index) => (
                    <li key={index}>
                        <a onClick={(e) => {
                            e.preventDefault();
                            router.push(item.link);
                        }} className="border-[1px] font-semibold p-[1em] rounded-sm">
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul> : null}
        </li>
    )
}