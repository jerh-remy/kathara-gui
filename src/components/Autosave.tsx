// import React, { FC, useCallback, useEffect } from 'react'

// type Props = {
//   katharaConfig: any;
// }

// export const Autosave:FC<Props> = ({katharaConfig}) => {
//   const debouncedSave = useCallback(
//     debounce(async (newExperimentData) => {
//       await saveExperimentDataToDb(newExperimentData);
//     }, DEBOUNCE_SAVE_DELAY_MS),
//     []
//   );

//   useEffect(() => {
//     if (katharaConfig) {
//       debouncedSave(katharaConfig);
//     }
//   }, [katharaConfig, debouncedSave]);
//   // Do not display anything on the screen.
//   return null;
// }
