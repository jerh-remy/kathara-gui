import React, { useCallback, useEffect, useState, SetStateAction } from 'react';
import _ from 'lodash';
import electron from 'electron';
import { writeFileSync } from 'fs';
import path from 'path';

const DEBOUNCE_SAVE_DELAY_MS = 1000;

export default function useAutosave<T>(
  dataToSave: T
): [T, React.Dispatch<SetStateAction<T>>] {
  // This UI state mirrors what's in the database.
  const [data, setData] = useState<T>(dataToSave);

  // This is the side effect we want to run on users' changes.
  // It is responsible for persisting the changes in the database.
  // In this example, we use localStorage for simplicity.
  const saveData = useCallback((newData) => {
    // window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));

    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );

    const configPath = path.join(userDataPath, 'katharaConfig.json');

    setData(newData);
    writeFileSync(configPath, JSON.stringify(newData));
    console.log('Saved successfully!');
  }, []);

  const debouncedSave = useCallback(
    _.debounce(async (newData: T) => {
      saveData(newData);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
  );

  // This effect runs only when `data` changes.
  // Effectively achieving the auto-save functionality we wanted.
  useEffect(() => {
    if (data) {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  return [data, setData];
}
