"use client";
import { useState } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  prism,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react";
import { GuideStepProps } from "./types";

export const GuideStep: React.FC<GuideStepProps> = ({
  title,
  description,
  code,
  language,
  icon: Icon,
}) => {
  const { isDarkMode } = useThemeStore();
  const codeStyle = isDarkMode ? tomorrow : prism;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-[#789DBC] dark:text-blue-500" />}
        <h3 className="font-medium text-[#557A9E] dark:text-white">{title}</h3>
      </div>

      <p className="text-[#9FB8CF] dark:text-gray-300 mb-4 text-sm">
        {description}
      </p>

      {code && language && (
        <div className="w-full">
          <div className="flex justify-start mb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF9F2] dark:bg-gray-700 hover:bg-[#FFE3E3] dark:hover:bg-gray-600 transition-colors text-sm"
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#789DBC] dark:text-gray-400" />
                  <span className="text-[#789DBC] dark:text-gray-400">
                    Copy code
                  </span>
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <div className="min-w-max">
              <SyntaxHighlighter
                language={language}
                style={codeStyle}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  padding: "1rem",
                  background: isDarkMode ? "#1f2937" : "#f3f4f6",
                }}
                wrapLongLines={false}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
