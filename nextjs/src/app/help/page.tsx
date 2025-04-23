"use client";
import { useState } from "react";
import { Guide } from "./components/Guide";
import { GuideSelector } from "./components/GuideSelector";
import { GuideType } from "./components/types";
import { customGuide, boilerplateGuide } from "./components/guideData";

export default function Help() {
  const [selectedGuide, setSelectedGuide] = useState<GuideType>(null);

  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <GuideSelector
          selectedGuide={selectedGuide}
          onSelectGuide={setSelectedGuide}
        />

        <div className="overflow-x-auto">
          {selectedGuide === "custom" && <Guide {...customGuide} />}
          {selectedGuide === "boilerplate" && <Guide {...boilerplateGuide} />}
        </div>
      </div>
    </div>
  );
}
