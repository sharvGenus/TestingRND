import { useEffect, useRef, useState } from 'react';

/*
  This custom hook is designed to return the 'dataObject' value after the loading is completed.
  
  It assumes that the initial loading state is set to false.
  To reset the loaded state, set 'resetTrigger' to true.
  
  Reset trigger is particularly useful for scenarios where you need to reset loaded states on
  actions such as 'back button' for example.
*/
const useValueAfterLoad = ({ dataObject, key, resetTrigger }) => {
  const [loadedState, setLoadedState] = useState(undefined);

  const isInitialLoadingState = useRef(true);
  const { loading, [key]: itemValue } = dataObject;

  const itemValueRef = useRef(itemValue);
  itemValueRef.current = itemValue;

  useEffect(() => {
    if (isInitialLoadingState.current) {
      isInitialLoadingState.current = false;
      return;
    }
    if (!loading) {
      setLoadedState(itemValueRef.current);
    }
  }, [loading]);

  useEffect(() => {
    if (resetTrigger) {
      isInitialLoadingState.current = true;
      setLoadedState(undefined);
    }
  }, [resetTrigger]);

  return loadedState;
};

export default useValueAfterLoad;
