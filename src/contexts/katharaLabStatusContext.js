import React, { createContext, useMemo, useCallback, useEffect } from 'react';

const KatharaLabStatusContext = createContext();

function KatharaLabStatusProvider({ children }) {
  const [katharaLabStatus, setKatharaLabStatus] = React.useState({
    isLabRunning: false,
    isConsoleOpen: false,
    killTerminals: false,
    terminals: [],
    output: '',
  });

  const value = useMemo(() => [katharaLabStatus, setKatharaLabStatus], [
    katharaLabStatus,
  ]);

  return (
    <KatharaLabStatusContext.Provider value={value}>
      {children}
    </KatharaLabStatusContext.Provider>
  );
}

function useKatharaLabStatus() {
  const context = React.useContext(KatharaLabStatusContext);
  if (context === undefined) {
    throw new Error(
      'useKatharaLabStatus must be used within a KatharaLabStatusProvider'
    );
  }
  return context;
}
export { KatharaLabStatusProvider, useKatharaLabStatus };
