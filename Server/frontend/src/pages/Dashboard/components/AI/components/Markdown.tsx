import ReactMarkdown from "react-markdown";

export function Markdown({ displayedText }: { displayedText: string }) {
    return (
        <div className="sm:max-w-[75%] rounded-3xl sm:bg-surface px-5 py-4 text-text">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => (
                        <h1 className="font-main text-3xl font-semibold tracking-tight mt-2 mb-6">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="font-main text-2xl font-semibold tracking-tight mt-8 mb-4">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="font-main text-lg font-medium tracking-tight mt-6 mb-3">
                            {children}
                        </h3>
                    ),

                    p: ({ children }) => (
                        <p className="leading-7 text-text/95 mb-4">
                            {children}
                        </p>
                    ),

                    ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-primary">
                            {children}
                        </ul>
                    ),

                    ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-5 space-y-2 marker:text-primary">
                            {children}
                        </ol>
                    ),

                    li: ({ children }) => (
                        <li className="leading-7">
                            {children}
                        </li>
                    ),

                    blockquote: ({ children }) => (
                        <blockquote className="my-5 rounded-r-xl border-l-2 border-primary bg-primary/5 py-3 pl-4 italic text-text/75">
                            {children}
                        </blockquote>
                    ),

                    strong: ({ children }) => (
                        <strong className="font-semibold text-primary">
                            {children}
                        </strong>
                    ),

                    hr: () => (
                        <hr className="my-8 h-px border-none bg-text-disabled/10" />
                    ),

                    code: ({ children, className }) => {
                        const isBlock =
                            className?.includes("language-");

                        if (!isBlock) {
                            return (
                                <code className="rounded-md border border-text-disabled/10 bg-background px-1.5 py-1 font-mono text-[14px] text-primary">
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code className={className}>
                                {children}
                            </code>
                        );
                    },

                    pre: ({ children }) => (
                        <pre className="my-5 overflow-x-auto rounded-2xl border border-text-disabled/10 bg-background p-4 text-sm">
                            {children}
                        </pre>
                    ),

                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                        >
                            {children}
                        </a>
                    ),

                    table: ({ children }) => (
                        <div className="my-5 overflow-x-auto rounded-2xl border border-text-disabled/10">
                            <table className="w-full border-collapse">
                                {children}
                            </table>
                        </div>
                    ),

                    th: ({ children }) => (
                        <th className="bg-background px-4 py-3 text-left font-main font-medium">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="border-t border-text-disabled/10 px-4 py-3 text-text/90">
                            {children}
                        </td>
                    ),
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    );
}