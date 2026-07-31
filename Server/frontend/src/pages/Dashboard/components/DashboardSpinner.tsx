import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function DashboardSpinner() {
    const root = document.getElementById("root");
    const modalRoot = document.getElementById("modal-root");
    const [hasLoaded, setHasLoaded] = useState(false);
    
    useEffect(() => {
        const animate = setTimeout(() => {
            setHasLoaded(true);
        }, 50);
        root.setAttribute("inert", "");
        document.documentElement.classList.add("overflow-hidden");

        return () => {
            clearTimeout(animate);
            root.removeAttribute("inert");
            document.documentElement.classList.remove("overflow-hidden");
        };
    }, [root]);
    
    return createPortal(
        <div className={`${hasLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"} transition-all duration-200 fixed top-1/2 left-1/2 -translate-1/2 sm:size-12 size-10 border-4 border-t-primary border-transparent rounded-full animate-spin z-100`} />,
        modalRoot
    );
};