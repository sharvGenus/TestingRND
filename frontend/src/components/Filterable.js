import FilterProvider from 'contexts/FilterContext';

// ==============================|| FILTERABLE - WRAPPING WITH FILTER PROVIDER ||============================== //

const Filterable = (Component) => (props) =>
  (
    <FilterProvider>
      <Component {...props} />
    </FilterProvider>
  );

export default Filterable;
