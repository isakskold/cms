import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className = "" }: InfoTooltipProps) {
  return (
    <div className={`relative inline-block ml-2 group ${className}`}>
      <Info className="w-4 h-4 text-gray-400 cursor-help" />
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {content}
      </div>
    </div>
  );
}
