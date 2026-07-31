import { createPortal } from "react-dom";

export function Overlay({ active, variant = "root" }: { active: boolean, variant?: "root" | "modal" }) {
    const modalRoot = document.getElementById("modal-root");
        
    switch (variant) {
        case "root":
            return (
                <div className={`${active ? "opacity-100" : "opacity-0"} pointer-events-none transition-opacity duration-200 fixed inset-0 bg-black/30 z-20 backdrop-blur-xs shadow-sm`}></div>
            );
        case "modal":
            return createPortal(
                <div className={`${active ? "opacity-100" : "opacity-0"} pointer-events-none transition-opacity duration-200 fixed inset-0 bg-black/30 z-40 backdrop-blur-xs shadow-sm`}></div>,
                modalRoot
            );
    };
};