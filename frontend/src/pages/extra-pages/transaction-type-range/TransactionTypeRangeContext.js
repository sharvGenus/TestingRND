import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const TransactionTypeRangeContext = createContext();

const TransactionTypeRangeProvider = ({ children }) => {
  const [organizationId, setOrganizationId] = useState('Initial Value 1');
  const [storeId, setStoreId] = useState('Initial Value 2');

  return (
    <TransactionTypeRangeContext.Provider value={{ organizationId, setOrganizationId, storeId, setStoreId }}>
      {children}
    </TransactionTypeRangeContext.Provider>
  );
};

TransactionTypeRangeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default TransactionTypeRangeProvider;

export function useTransactionTypeRangeContext() {
  const context = useContext(TransactionTypeRangeContext);
  if (!context) {
    throw new Error('useTransactionTypeRangeContext must be used within MyProvider');
  }
  return context;
}
