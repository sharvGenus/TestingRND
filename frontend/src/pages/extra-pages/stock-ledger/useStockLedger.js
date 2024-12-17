import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useStockLedger = () => {
  const [stocks, setStocks] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const [transaction, setTransaction] = useState({
    transactionObject: {},
    error: '',
    loading: false
  });

  const [transactionsSecond, setTransactionsSecond] = useState({
    transactionObject: {},
    error: '',
    loading: true
  });

  const [transactionQty, setTransactionQty] = useState({
    transactionObject: {},
    error: '',
    loading: true
  });

  const [transactionSecondQty, setTransactionSecondQty] = useState({
    transactionObject: {},
    error: '',
    loading: true
  });

  const [serialNumbers, setSerialNumbers] = useState({
    data: {},
    error: '',
    loading: true
  });

  const [serialNumbersSecond, setSerialNumbersSecond] = useState({
    data: {},
    error: '',
    loading: true
  });

  const [allSerialNumbers, setAllSerialNumbers] = useState({
    data: {},
    error: '',
    loading: true
  });

  const [stoData, setStoData] = useState({
    stoDataObject: {},
    error: '',
    loading: true
  });

  const [refData, setRefData] = useState({
    refDataObject: {},
    error: '',
    loading: true
  });

  const [refDataSecond, setRefDataSecond] = useState({
    refDataSecondObject: {},
    error: '',
    loading: true
  });

  const [refDataThird, setRefDataThird] = useState({
    refDataThirdObject: {},
    error: '',
    loading: true
  });

  const [stockLedgerDetailList, setStockLedgerDetailList] = useState({
    stockLedgerDetailListObject: {},
    error: '',
    loading: true
  });

  const [storeLocationsTransaction, setStoreLocationsTransaction] = useState({
    storeLocationsTransactionObject: {},
    error: '',
    loading: true
  });

  const [storeLocationsStock, setStoreLocationsStock] = useState({
    allStoreLocationsStock: [],
    error: '',
    loading: true
  });

  const [transactionMaterialList, setTransactionMaterialList] = useState({
    transactionObject: {},
    error: '',
    loading: false
  });

  const [txnByMaterial, setTxnByMaterial] = useState({
    transactionObject: {},
    error: '',
    loading: false
  });

  const [txnByLocationMaterial, setTxnByLocationMaterial] = useState({
    storeLocationsTransactionObject: {},
    error: '',
    loading: true
  });

  const [storeStockReport, setStoreStockReport] = useState({
    storeLocationsTransactionObject: {},
    error: '',
    loading: true
  });

  const [stockLedgerMaterialList, setStockLedgerMaterialList] = useState({
    transactionObject: {},
    error: '',
    loading: false
  });

  const stocksData = useSelector((state) => state.stocks || {});
  const transactionData = useSelector((state) => state.transactions || {});
  const transactionDataSecond = useSelector((state) => state.transactionsSecond || {});
  const transactionDataQty = useSelector((state) => state.transactionsQty || {});
  const transactionDataSecondQty = useSelector((state) => state.transactionsSecondQty || {});
  const serialNumberData = useSelector((state) => state.serialNumbers || {});
  const serialNumberDataSecond = useSelector((state) => state.serialNumbersSecond || {});
  const allSerialNumberData = useSelector((state) => state.allSerialNumbers || {});
  const stoTransactionData = useSelector((state) => state.stoData || {});
  const transactionByRefData = useSelector((state) => state.refData || {});
  const transactionByRefDataSecond = useSelector((state) => state.refDataSecond || {});
  const transactionByRefDataThird = useSelector((state) => state.refDataThird || {});
  const stockLedgerDetailListData = useSelector((state) => state.stockLedgerDetailList || {});
  const storeLocationsTransactionData = useSelector((state) => state.storeLocationsTransactions || {});
  const storeLocationsStockData = useSelector((state) => state.storeLocationsStock || []);
  const transactionMaterialData = useSelector((state) => state.transactionMaterialList || {});
  const txnByMaterialData = useSelector((state) => state.txnByMaterial || {});
  const txnByLocationMaterialData = useSelector((state) => state.txnByLocationMaterial || {});
  const storeStockReportData = useSelector((state) => state.storeStockReport || {});
  const stockLedgerMaterialListData = useSelector((state) => state.stockLedgerMaterialList || {});

  useEffect(() => {
    setStocks((prev) => ({
      ...prev,
      ...stocksData
    }));
  }, [stocksData]);

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      ...transactionData
    }));
  }, [transactionData]);

  useEffect(() => {
    setTransactionsSecond((prev) => ({
      ...prev,
      ...transactionDataSecond
    }));
  }, [transactionDataSecond]);

  useEffect(() => {
    setTransactionQty((prev) => ({
      ...prev,
      ...transactionDataQty
    }));
  }, [transactionDataQty]);

  useEffect(() => {
    setTransactionSecondQty((prev) => ({
      ...prev,
      ...transactionDataSecondQty
    }));
  }, [transactionDataSecondQty]);

  useEffect(() => {
    setSerialNumbers((prev) => ({
      ...prev,
      ...serialNumberData
    }));
  }, [serialNumberData]);

  useEffect(() => {
    setSerialNumbersSecond((prev) => ({
      ...prev,
      ...serialNumberDataSecond
    }));
  }, [serialNumberDataSecond]);

  useEffect(() => {
    setAllSerialNumbers((prev) => ({
      ...prev,
      ...allSerialNumberData
    }));
  }, [allSerialNumberData]);

  useEffect(() => {
    setStoData((prev) => ({
      ...prev,
      ...stoTransactionData
    }));
  }, [stoTransactionData]);

  useEffect(() => {
    setRefData((prev) => ({
      ...prev,
      ...transactionByRefData
    }));
  }, [transactionByRefData]);

  useEffect(() => {
    setRefDataSecond((prev) => ({
      ...prev,
      ...transactionByRefDataSecond
    }));
  }, [transactionByRefDataSecond]);

  useEffect(() => {
    setRefDataThird((prev) => ({
      ...prev,
      ...transactionByRefDataThird
    }));
  }, [transactionByRefDataThird]);

  useEffect(() => {
    setStockLedgerDetailList((prev) => ({
      ...prev,
      ...stockLedgerDetailListData
    }));
  }, [stockLedgerDetailListData]);

  useEffect(() => {
    setStoreLocationsTransaction((prev) => ({
      ...prev,
      ...storeLocationsTransactionData
    }));
  }, [storeLocationsTransactionData]);

  useEffect(() => {
    setStoreLocationsStock((prev) => ({
      ...prev,
      ...storeLocationsStockData
    }));
  }, [storeLocationsStockData]);

  useEffect(() => {
    setTransactionMaterialList((prev) => ({
      ...prev,
      ...transactionMaterialData
    }));
  }, [transactionMaterialData]);

  useEffect(() => {
    setTxnByMaterial((prev) => ({
      ...prev,
      ...txnByMaterialData
    }));
  }, [txnByMaterialData]);

  useEffect(() => {
    setTxnByLocationMaterial((prev) => ({
      ...prev,
      ...txnByLocationMaterialData
    }));
  }, [txnByLocationMaterialData]);

  useEffect(() => {
    setStoreStockReport((prev) => ({
      ...prev,
      ...storeStockReportData
    }));
  }, [storeStockReportData]);

  useEffect(() => {
    setStockLedgerMaterialList((prev) => ({
      ...prev,
      ...stockLedgerMaterialListData
    }));
  }, [stockLedgerMaterialListData]);

  return {
    stocks,
    transaction,
    serialNumbers,
    serialNumbersSecond,
    allSerialNumbers,
    stoData,
    refData,
    stockLedgerDetailList,
    storeLocationsTransaction,
    transactionsSecond,
    refDataSecond,
    refDataThird,
    transactionQty,
    transactionSecondQty,
    storeLocationsStock,
    transactionMaterialList,
    txnByMaterial,
    txnByLocationMaterial,
    storeStockReport,
    stockLedgerMaterialList
  };
};
