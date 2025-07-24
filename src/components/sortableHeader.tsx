import { ArrowUp, ArrowDown } from "lucide-react";

interface SortableHeaderProps {
    label: string;
    onClick?: () => void;
    sortable?: boolean;
    active?: boolean;
    direction?: "asc" | "desc";
}

export function SortableHeader({
                                   label,
                                   onClick,
                                   sortable = true,
                                   active,
                                   direction,
                               }: SortableHeaderProps) {
    const isClickable = typeof onClick === "function";

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`flex items-center gap-2 ${isClickable ? "cursor-pointer" : "cursor-default"} select-none`}
        >
            {label}
            {sortable && (
                <div className="flex flex-col justify-center">
                    <ArrowUp
                        className={`h-3 w-3 ${active && direction === "asc" ? "text-black" : "text-gray-400"}`}
                    />
                    <ArrowDown
                        className={`h-3 w-3 ${active && direction === "desc" ? "text-black" : "text-gray-400"}`}
                    />
                </div>
            )}
        </div>
    );
}
