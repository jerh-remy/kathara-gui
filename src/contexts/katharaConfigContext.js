import React, { createContext, useMemo, useCallback, useEffect } from 'react';
import _ from 'lodash';
import electron from 'electron';
import { writeFileSync } from 'fs';
import path from 'path';
import { labInfo } from '../models/network';

const DEBOUNCE_SAVE_DELAY_MS = 1000;

const KatharaConfigContext = createContext();

function KatharaConfigProvider({ children }) {
  const [katharaConfig, setKatharaConfig] = React.useState({
    labInfo,
    elements: [],
    machines: [],
  });

  // This is the side effect we want to run on users' changes.
  // It is responsible for persisting the changes on the fs.
  const saveData = useCallback((newKatharaConfig) => {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    const labPath = newKatharaConfig.labInfo.labDirPath;
    console.log({ labPath });
    setKatharaConfig(newKatharaConfig);
    try {
      writeFileSync(labPath, JSON.stringify(newKatharaConfig, undefined, 2));
    } catch (error) {
      console.log({ error });
    }
    console.log('Saved successfully!');
  }, []);

  const debouncedSave = useCallback(
    _.debounce((newData) => {
      saveData(newData);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
  );

  // This effect runs only when `katharaConfig` changes.
  // Effectively achieving the auto-save functionality we wanted.
  useEffect(() => {
    if (katharaConfig.labInfo.autosaveEnabled) {
      debouncedSave(katharaConfig);
    }
  }, [katharaConfig, debouncedSave]);

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
