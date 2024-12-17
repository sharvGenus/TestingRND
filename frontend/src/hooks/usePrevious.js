import { useEffect, useRef } from 'react';

// Returns the state of the value provided on previous render
const usePrevious = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
