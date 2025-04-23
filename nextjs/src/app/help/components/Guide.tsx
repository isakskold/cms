"use client";
import { GuideProps } from "./types";
import { GuideStep } from "./GuideStep";

export const Guide: React.FC<GuideProps> = ({ title, description, steps }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-[#FFE3E3] dark:border-gray-700">
        <h2 className="text-xl font-semibold text-[#557A9E] dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-[#9FB8CF] dark:text-gray-300 text-sm">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <GuideStep key={index} {...step} />
        ))}
      </div>
    </div>
  );
};
