import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const getFilterIdsOnly = (currentFilter) => {
  return Object.fromEntries(Object.entries(currentFilter).map(([key, value]) => [key, value.map((item) => item.id)]));
};

const FilterContext = createContext();

const initialFilterState = {};

const FilterProvider = ({ children }) => {
  const [currentFilter, setCurrentFilter] = useState(initialFilterState);

  const handleSetCurrentFilter = (currentValues, columnId) => {
    setCurrentFilter((prev) => {
      const currentFilterClone = structuredClone(prev);

      if (!currentValues?.length) {
        delete currentFilterClone[columnId];
      } else {
        currentFilterClone[columnId] = currentValues;
      }

      return currentFilterClone;
    });
  };

  const clearAllFilters = () => {
    setCurrentFilter(initialFilterState);
  };

  const isCurrentlyFiltering = Object.keys(currentFilter).length > 0;

  const filterObjectForApi = useMemo(() => JSON.stringify(getFilterIdsOnly(currentFilter)), [currentFilter]);

  return (
    <FilterContext.Provider value={{ isCurrentlyFiltering, currentFilter, filterObjectForApi, handleSetCurrentFilter, clearAllFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default FilterProvider;

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    return {};
  }
  return context;
}
