import React, { createContext, useMemo } from 'react';
import { labInfo } from '../models/network';

const KatharaConfigContext = createContext();

function KatharaConfigProvider({ children }) {
  const [katharaConfig, setKatharaConfig] = React.useState({
    labInfo,
    elements: [],
    machines: [],
  });

  const value = useMemo(() => [katharaConfig, setKatharaConfig], [
    katharaConfig,
  ]);

  return (
    <KatharaConfigContext.Provider value={value}>
      {children}
    </KatharaConfigContext.Provider>
  );
}

function useKatharaConfig() {
  const context = React.useContext(KatharaConfigContext);
  if (context === undefined) {
    throw new Error(
      'useKatharaConfig must be used within a KatharaConfigProvider'
    );
  }
  return context;
}
export { KatharaConfigProvider, useKatharaConfig };
