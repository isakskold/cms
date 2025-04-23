"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GuideType } from "./types";

interface GuideSelectorProps {
  selectedGuide: GuideType;
  onSelectGuide: (guide: GuideType) => void;
}

export const GuideSelector: React.FC<GuideSelectorProps> = ({
  selectedGuide,
  onSelectGuide,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <button
        onClick={() =>
          onSelectGuide(selectedGuide === "custom" ? null : "custom")
        }
        className={`p-6 rounded-lg border transition-all ${
          selectedGuide === "custom"
            ? "border-[#789DBC] bg-[#FEF9F2] dark:bg-blue-900/20"
            : "border-[#FFE3E3] dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-[#FEF9F2] dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-medium text-[#557A9E] dark:text-white">
              Custom Integration
            </h3>
            <p className="text-sm text-[#9FB8CF] dark:text-gray-400 mt-1">
              Build your own integration using our API
            </p>
          </div>
          {selectedGuide === "custom" ? (
            <ChevronUp className="w-5 h-5 text-[#789DBC]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#9FB8CF]" />
          )}
        </div>
      </button>

      <button
        onClick={() =>
          onSelectGuide(selectedGuide === "boilerplate" ? null : "boilerplate")
        }
        className={`p-6 rounded-lg border transition-all ${
          selectedGuide === "boilerplate"
            ? "border-[#789DBC] bg-[#FEF9F2] dark:bg-blue-900/20"
            : "border-[#FFE3E3] dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-[#FEF9F2] dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-medium text-[#557A9E] dark:text-white">
              Boilerplate Components (Doesn&apos;t work yet)
            </h3>
            <p className="text-sm text-[#9FB8CF] dark:text-gray-400 mt-1">
              Use our pre-built components for quick integration
            </p>
          </div>
          {selectedGuide === "boilerplate" ? (
            <ChevronUp className="w-5 h-5 text-[#789DBC]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#9FB8CF]" />
          )}
        </div>
      </button>
    </div>
  );
};
