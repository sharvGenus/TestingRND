import _ from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';

const useSearch = (props) => {
  const { isFcMode } = props || {};

  const [searchString, setSearchString] = useState(undefined);
  const [forceSearch, setForceSearch] = useState(false);

  const accessorsRef = useRef([]);

  const setAccessors = useCallback(
    (data) => {
      const previousAccessors = accessorsRef.current;
      accessorsRef.current = data;

      if (!searchString) {
        return;
      }

      if (!isFcMode && !_.isEqual(data, previousAccessors)) {
        setForceSearch((flag) => !flag);
      }
    },
    [isFcMode, searchString]
  );

  const searchStringTrimmed = useMemo(() => searchString?.trim(), [searchString]);

  return { searchString, searchStringTrimmed, forceSearch, accessorsRef, setSearchString, setAccessors };
};

export default useSearch;
