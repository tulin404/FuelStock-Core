import type { Status } from "@dashboard/types/types";

export function StatusIcon({ status, desc }: { status: Status, desc: string }) {
    function renderBadge() {
        switch (status) {
            case "low":
                return (
                    <span className="relative flex size-2.5" title={desc}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-2.5 bg-red-500"></span>
                    </span>
                );
            case "medium":
                return (
                    <span className="relative flex size-2.5" title={desc}>
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400"></span>
                    </span>
                );
            case "ok":
                return (
                    <span className="relative flex size-2.5" title={desc}>
                        <span className="inline-flex rounded-full size-2.5 bg-green-500"></span>
                    </span>
                );
            case "over":
                return (
                    <span className="relative flex size-2.5" title={desc}>
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-700 opacity-60"></span>
                        <span className="relative inline-flex rounded-full size-2.5 bg-blue-700"></span>
                    </span>
                );
            default:
                return null;
        };
    };

    return renderBadge();
};