export function Spinner() {
    return (
        <main className="fixed inset-0 bg-background flex items-center justify-center gap-3 z-1000">
            <span id="dot-1" className="spinner-dot"/>
            <span id="dot-2" className="spinner-dot"/>
            <span id="dot-3" className="spinner-dot"/>
        </main>
    );
};