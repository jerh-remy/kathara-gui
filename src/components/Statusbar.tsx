import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();

  return (
    <nav className="flex flex-shrink-0 justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div>
        <p className="text-white text-xs">Status bar</p>
      </div>
    </nav>
  );
};
