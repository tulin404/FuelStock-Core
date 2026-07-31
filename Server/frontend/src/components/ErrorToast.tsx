import type { ApiError } from "@/utils/ApiError";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react";

export function ErrorToast({ error, onClose }: { error: Error | ApiError, onClose: Dispatch<SetStateAction<Error | null>> }) {
    const [isVisible, setVisible] = useState(false);
    
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));

        const visibleTimer = setTimeout(() => {
            setVisible(false);
        }, 4000);
        
        const unmountTimer = setTimeout(() => {
            onClose(null);
        }, 5000);

        return () => {
            clearTimeout(visibleTimer);
            clearTimeout(unmountTimer);
        };
    }, [onClose]);

    return (
        <div className={`${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"} transition-all duration-300 bg-danger-surface border-2 border-danger-border rounded-md fixed bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-100 w-[80%] sm:max-w-80 p-4`}>
            <div className="text-xl flex gap-2 items-center">
                <CircleAlert className="text-danger" />
                <h2 className="text-danger font-secondary">{error.name}</h2>
            </div>
            <p className="text-text text-left font-secondary mt-2">{error.message}</p>
        </div>
    );
};