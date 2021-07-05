import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();

  return (
    <nav className="flex flex-shrink-0 justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div>
        <p className="text-gray-300 text-xs">{`${
          katharaConfig.labInfo.autosaveEnabled
            ? 'Your project is being autosaved'
            : 'Please save this project as a new Kathara lab to enable the autosave feature.'
        }`}</p>
      </div>
    </nav>
  );
};
