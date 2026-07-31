export function KPICard({ data, legend }: { data: number | string, legend: string }) {
    return (
        <div className="bg-surface border-2 border-border-hover sm:hover:border-primary sm:hover:shadow-lg transition-all duration-200 rounded-lg py-4 px-6 shadow-md">
            <h3 className="font-main font-medium text-text text-xl md:text-2.5xl/[1.3] text-center lg:text-left">{data}</h3>
            <h4 className="font-secondary text-text md:text-lg text-center lg:text-left">{legend}</h4>
        </div>
    );
};