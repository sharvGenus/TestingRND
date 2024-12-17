import { CloseCircleOutlined, DownOutlined, MoreOutlined } from '@ant-design/icons';
import { RightOutlined } from '@ant-design/icons';
import { Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import Headers from './headers';
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/ReactTable';
import { formatTimeStamp, getValueByAccessor, sortAlphanumeric } from 'utils';
import tableExportData from 'utils/tablesExportData';
import ScrollX from 'components/ScrollX';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import TableForm from 'tables/table';

const Arrows = ({ row, index, openCloseRow }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (row && row.open) setOpen(row.open);
  }, [row]);

  return (
    <>
      {open ? (
        <DownOutlined
          onClick={() => {
            setOpen(false);
            openCloseRow(index, false);
          }}
        />
      ) : (
        <RightOutlined
          onClick={() => {
            setOpen(true);
            openCloseRow(index, true);
          }}
        />
      )}
    </>
  );
};

Arrows.propTypes = {
  index: PropTypes.number,
  row: PropTypes.any,
  openCloseRow: PropTypes.func
};

const TableSubForm = ({ level, cols, row, subCols, superSubCols, fetchSubData, modal, allValues, setAllTableData }) => {
  const [data, setData] = useState([]);

  cols = level === 2 ? superSubCols : level === 1 ? subCols : cols;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSubData(
          row,
          row &&
            row.storeLocation &&
            row.storeLocation.name &&
            (row.storeLocation.name.toLowerCase().includes('installer') ||
              row.storeLocation.name.toLowerCase().includes('old') ||
              row.storeLocation.name.toLowerCase().includes('installed'))
            ? true
            : false
        );
        setData(response);
      } catch (error) {
        setData([]);
      }
    };

    fetchData();
  }, [fetchSubData, row]);

  return (
    <TableFormData
      cols={cols}
      data={data}
      level={level}
      subCols={subCols}
      allValues={allValues}
      superSubCols={superSubCols}
      setAllTableData={setAllTableData}
      fetchSubData={fetchSubData}
      modal={modal}
    />
  );
};

TableSubForm.propTypes = {
  level: PropTypes.number,
  cols: PropTypes.array,
  row: PropTypes.any,
  subCols: PropTypes.array,
  superSubCols: PropTypes.array,
  fetchSubData: PropTypes.func,
  setAllTableData: PropTypes.func,
  allValues: PropTypes.any,
  modal: PropTypes.bool
};

const TableFormData = ({ data, cols, subCols, superSubCols, level, setAllTableData, modal, fetchSubData, allValues, headTitle }) => {
  const [tableData, setTableData] = useState([]);
  const [serialNumberDetails, setSerialNumberDetails] = useState(false);
  const [serialNumberData, setSerialNumberData] = useState([]);
  const [allSNData, setAllSNData] = useState([]);
  const [serialNumberCount, setSerialNumberCount] = useState(null);
  const [serialIndex, setSerialIndex] = useState(null);
  const [serailActive, setSerailActive] = useState(null);
  const [details, setDetails] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedRow, setSelectedRow] = useState(undefined);

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  cols = [{ Header: ' ', accessor: 'btn' }, ...cols];
  const closeCss = { cursor: 'pointer', fontSize: 20 };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const getVendorDetails = (obj) => {
    if (obj.transactionTypeId === 'bec7c5ef-291f-4147-bb20-88bac5a2aec3') {
      return {
        vendorStoreName: '',
        vendorName: obj.organization?.name,
        vendorCode: obj.organization?.code
      };
    } else if (obj.transactionTypeId === '3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf') {
      if (obj.requestNumber && obj.requestNumber !== null) {
        let org = obj?.stock_ledger_detail?.other_party_store?.organization;
        if (obj?.stock_ledger_detail?.other_party_store?.parentId && obj?.stock_ledger_detail?.other_party_store?.parentId !== null)
          org = obj?.stock_ledger_detail?.other_party_store?.parent;

        return {
          vendorStoreName: obj?.stock_ledger_detail?.other_party_store?.name + ' - ' + obj?.stock_ledger_detail?.other_party_store?.code,
          vendorName: org?.name,
          vendorCode: org?.code
        };
      } else
        return {
          vendorStoreName: '',
          vendorName: obj.organization?.name,
          vendorCode: obj.organization?.code
        };
    } else if (
      [
        '5b4e46d5-7bf5-4f42-8c4a-b6337533fdff',
        '160269a8-612a-4827-a21b-166ed33dc773',
        '3ac35029-c4d5-4013-819a-516c707c550f',
        '22ce5829-2a1e-407c-88f6-5ebc38455519',
        '8ae879e6-7b55-4040-8254-7f4420a6a1c1',
        'a4ae48a0-fab0-4450-a369-57f34a20a68a'
      ].includes(obj.transactionTypeId)
    )
      return {
        vendorStoreName: obj.organization_store?.name + ' - ' + obj.organization_store?.code,
        vendorName: obj.organization?.name,
        vendorCode: obj.organization?.code
      };
    else if (
      [
        'ac909ed3-92c2-4cdf-b463-0e351c42cda2',
        'fc1015da-7db4-4aa6-844d-92a5557f7941',
        '34c8d448-5fbb-4a37-9dce-2d346a77ae97',
        'fadec802-92aa-4127-8ba1-e3d9b6bd4936',
        'c69c9f62-c3fc-4703-95d4-dd3a5227e010'
      ].includes(obj.transactionTypeId) &&
      obj?.stock_ledger_detail?.other_party_store &&
      obj?.stock_ledger_detail?.other_party_store !== null
    ) {
      let org = obj?.stock_ledger_detail?.other_party_store?.organization;
      if (obj?.stock_ledger_detail?.other_party_store?.parentId && obj?.stock_ledger_detail?.other_party_store?.parentId !== null)
        org = obj?.stock_ledger_detail?.other_party_store?.parent;
      return {
        vendorStoreName: obj?.stock_ledger_detail?.other_party_store?.name + ' - ' + obj?.stock_ledger_detail?.other_party_store?.code,
        vendorName: org?.name,
        vendorCode: org?.code
      };
    } else
      return {
        vendorStoreName: '',
        vendorName: '',
        vendorCode: ''
      };
  };

  const getVendorStoreDetails = (arr) => {
    let respArray = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        let newVl = { ...vl };
        if (vl.other_store && vl.other_store !== null) {
          newVl['vendorStoreName'] = vl.other_store?.name + ' - ' + vl.other_store?.code;
          let org = vl.other_store?.organization;
          if (vl.other_store?.organization?.parentId && vl.other_store?.organization?.parentId !== null) {
            org = vl.other_store?.organization?.parent;
          }
          newVl['vendorName'] = org.name;
          newVl['vendorCode'] = org.code;
        } else {
          let vendorDetails = getVendorDetails(vl);
          newVl['vendorStoreName'] = vendorDetails?.vendorStoreName;
          newVl['vendorName'] = vendorDetails?.vendorName;
          newVl['vendorCode'] = vendorDetails?.vendorCode;
        }
        respArray.push(newVl);
      });
    return respArray;
  };

  const fetchApiDetails = useCallback(
    async (selectedRw) => {
      const response = await request('/all-stock-details', {
        method: 'GET',
        timeoutOverride: 20 * 60000,
        query: {
          projectId: allValues.projectId ? allValues.projectId : allValues.project,
          storeId: allValues.storeId ? allValues.storeId : allValues.store,
          ...(allValues.material && { materialId: allValues.material }),
          ...(selectedRw.materialId && { materialId: selectedRw.materialId }),
          ...(selectedRw.storeLocationId && { storeLocationId: selectedRw.storeLocationId }),
          ...(selectedRw.installerId && { installerId: selectedRw.installerId }),
          sort: ['createdAt', 'DESC']
        }
      });
      if (response.success) return response?.data?.data;
    },
    [allValues]
  );

  const fetchDetails = async (selectedRw = {}, stitle = `Store: ${allValues?.storeDetails?.name}`, obj = undefined) => {
    let resp = await fetchApiDetails(selectedRw);
    if (resp) {
      setDetailData(getVendorStoreDetails(resp?.rows));
      setTitle(stitle);
      setDetails(obj ? obj : true);
    }
  };

  const handleClose = () => {
    setDetailData([]);
    setTitle(' ');
    setDetails(false);
    setSelectedRow(undefined);
  };

  const showDetails = (e, ind) => {
    if (ind !== null) {
      // const popData = data[ind]?.transactions;
      // setDetailData(getVendorStoreDetails(popData));
      // setTitle(`Store: ${allValues?.storeDetails?.name} > Material: ${data[ind]?.material?.name}`);
      // setDetails(e);
      fetchDetails(data[ind], `Store: ${allValues?.storeDetails?.name} > Material: ${data[ind]?.material?.name}`, e);
    } else {
      fetchDetails();
    }
  };

  const showSubDetails = (e, subData, subInd) => {
    if (subData && subInd !== null) {
      // const popData = subData[subInd].transactions;
      // setDetailData(getVendorStoreDetails(popData));
      // setTitle(
      //   `Store: ${allValues?.storeDetails?.name} > Store Location: ${subData[subInd]?.storeLocation?.name} > Material: ${subData[subInd]?.material?.name}`
      // );
      // setDetails(e);
      fetchDetails(
        subData[subInd],
        `Store: ${allValues?.storeDetails?.name} > Store Location: ${subData[subInd]?.storeLocation?.name} > Material: ${subData[subInd]?.material?.name}`,
        e
      );
    } else {
      fetchDetails();
    }
  };

  const updateTable = (index, show, lvl) => {
    let nTable = structuredClone(tableData);
    nTable[index]['open'] = show;
    show ? nTable.splice(index + 1, 0, { newRow: true, id: `newRow${index + 1}` }) : nTable.splice(index + 1, 1);
    setTableData([...nTable]);
    if (lvl === 0) setAllTableData([...nTable]);
  };

  const moreFontSize = { fontSize: 20 };

  const onClose = () => {
    setSerialNumberDetails(false);
    setTimeout(() => {
      setPageIndex(1);
      setPageSize(25);
      setSerialIndex(null);
      setSerailActive(null);
      setSerialNumberData([]);
      setAllSNData([]);
    }, 200);
  };

  const createSerialData = useCallback(
    (arr, showActive) => {
      const resp = [];
      arr &&
        arr.length > 0 &&
        arr.map((val) => {
          if (showActive === true) {
            if (val?.status === '1') {
              resp.push({
                nos: (pageIndex * pageSize - pageSize + resp.length + 1).toString(),
                // name: value?.material?.name,
                serialNo: val?.serialNumber,
                status: 'Active'
              });
            }
          } else {
            resp.push({
              nos: (pageIndex * pageSize - pageSize + resp.length + 1).toString(),
              // name: value?.material?.name,
              serialNo: val?.serialNumber,
              status: val?.status === '1' ? 'Active' : 'Inactive'
            });
          }
        });
      setSerialNumberData(resp);
    },
    [pageIndex, pageSize]
  );

  const createNewSerialData = useCallback(
    (arr) => {
      const resp = [];
      arr &&
        arr.length > 0 &&
        arr.map((val) => {
          resp.push({
            nos: (pageIndex * pageSize - pageSize + resp.length + 1).toString(),
            // name: value?.material?.name,
            serialNo: val?.serialNumber,
            status: val?.status === '1' ? 'Active' : 'Inactive'
          });
        });
      setSerialNumberData(resp);
    },
    [pageIndex, pageSize]
  );

  const createOldSerialData = useCallback(
    (arr) => {
      const obj = {};
      arr.map((vl) => {
        if (obj[vl?.stock_ledger_detail?.serialNumber]) {
          obj[vl?.stock_ledger_detail?.serialNumber] += vl.quantity;
        } else obj[vl?.stock_ledger_detail?.serialNumber] = vl.quantity;
      });

      const resultArr = [];
      Object.keys(obj).forEach((k) => {
        if (obj[k] > 0) {
          resultArr.push([...Array(obj[k]).fill(k)]);
        }
      });

      const respArr = sortAlphanumeric(resultArr.flat(Infinity));
      setSerialNumberCount(respArr.length);
      let resp = [];
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, respArr.length);
      setAllSNData(
        respArr.map((vl, i) => {
          return {
            nos: i + 1,
            serialNo: vl?.serialNumber,
            status: 'Inactive'
          };
        })
      );
      respArr.slice(startIndex, endIndex).map((vl) => {
        resp.push({
          nos: (pageIndex * pageSize - pageSize + resp.length + 1).toString(),
          // name: value?.material?.name,
          serialNo: vl,
          status: 'Inactive'
        });
      });
      setSerialNumberData(resp);
    },
    [pageIndex, pageSize]
  );

  const arrToArrObj = (arr, apiRecords = []) => {
    const getStatus = (vl) => {
      let recd = apiRecords.find((element) => element.serialNumber === vl);
      if (recd) return recd?.status;
      else return '0';
    };
    const newObj = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        newObj.push({
          serialNumber: vl,
          ...(apiRecords && apiRecords.length > 0 && { status: getStatus(vl) })
        });
      });
    return newObj;
  };

  const paginateData = useCallback((apiData, addOnData, pageNo, pageSze) => {
    const apiDataLength = apiData.length;
    const addOnDataLength = addOnData.length;
    let currentPageData = [];
    // Calculate start index for the current page
    const startIndex = (pageNo - 1) * pageSze;
    // Pick data from apiData
    const apiDataEndIndex = Math.min(startIndex + pageSze, apiDataLength);
    currentPageData = apiData.slice(startIndex, apiDataEndIndex);
    // Fill remaining space with data from addOnData
    const remainingSpace = pageSze - currentPageData.length;
    if (remainingSpace > 0 && apiDataEndIndex < apiDataLength) {
      const remainingData = [...apiData.slice(apiDataEndIndex, apiDataLength), ...addOnData];
      currentPageData = [...currentPageData, ...remainingData.slice(0, remainingSpace)];
    } else if (remainingSpace > 0) {
      const addOnStartIndex = Math.max(0, startIndex - apiDataLength);
      const addOnEndIndex = Math.min(addOnStartIndex + remainingSpace, addOnDataLength);
      currentPageData = [...currentPageData, ...addOnData.slice(addOnStartIndex, addOnEndIndex)];
    }
    return { currentPageData };
  }, []);

  const makeAllRespData = useCallback((dta, dataCount, pageInd, pageSze) => {
    let apiData = Array(dataCount).fill('');
    apiData.splice((pageInd - 1) * pageSze, dta.length, ...dta);
    return apiData;
  }, []);

  // For showing serial numbers
  const showSerialNo = useCallback(
    async (ind, showActive = 0, checkRow = undefined) => {
      const { rows: transactionArr } = await fetchApiDetails(data[ind]);
      let installedData = transactionArr?.filter((vl) => vl?.organization_store_location?.name.toLowerCase().includes('installed'));
      if (tableData && tableData[ind] && tableData[ind].material && tableData[ind].material.isSerialNumber) {
        if (checkRow) {
          const { rows: transactions } = await fetchApiDetails(checkRow);
          if (transactions) {
            const transactionIdArr = [];
            transactions &&
              transactions.length > 0 &&
              transactions.map((vl) => {
                transactionIdArr.push({
                  stockLedgerId: vl.id,
                  transaction: vl.quantity < 0 ? 'debit' : 'credit'
                });
              });
            const response = await request('/installed-serial-number', { method: 'POST', body: { transactionIdArr: transactionIdArr } });
            if (response.success) {
              setSerialNumberDetails(true);
              let respData = sortAlphanumeric(response?.data?.serialNumber);
              const startIndex = (pageIndex - 1) * pageSize;
              const endIndex = Math.min(startIndex + pageSize, respData.length);
              setSerialNumberCount(respData?.length);
              createSerialData(arrToArrObj(respData.slice(startIndex, endIndex)), false);
              setAllSNData(
                respData.map((vl, i) => {
                  return {
                    nos: i + 1,
                    serialNo: vl?.serialNumber,
                    status: vl?.status === '1' ? 'Active' : 'Inactive'
                  };
                })
              );
            }
          }
        } else if (tableData[ind] && tableData[ind].materialId && tableData[ind].materialId === '84b473e1-62bb-4afe-af56-1691bdffbc55') {
          setSerialNumberDetails(true);
          if (modal) {
            setSerialNumberCount(1);
            createSerialData([tableData[ind].stock_ledger_detail], false);
            setAllSNData(
              [tableData[ind].stock_ledger_detail].map((vl, i) => {
                return {
                  nos: i + 1,
                  serialNo: vl?.serialNumber,
                  status: vl?.status === '1' ? 'Active' : 'Inactive'
                };
              })
            );
          } else {
            const { rows: transactions } = await fetchApiDetails(tableData[ind]);
            if (transactions) createOldSerialData(transactions, false, 'stock_ledger_detail');
          }
        } else {
          const mainQuery = {
            projectId: allValues.projectId ? allValues.projectId : allValues.project,
            storeId: allValues.storeId ? allValues.storeId : allValues.store,
            materialId: tableData[ind].materialId,
            ...(tableData[ind].storeLocationId && { storeLocationId: tableData[ind].storeLocationId }),
            ...(tableData[ind].installerId && { installerId: tableData[ind].installerId }),
            ...(tableData[ind].stockLedgerDetailId && { stockLedgerId: tableData[ind].id }),
            ...(showActive && { status: showActive }),
            sort: ['serialNumber', 'ASC']
          };
          const allResp = await request('/serial-number-list', {
            method: 'GET',
            query: mainQuery
          });
          const response = await request('/serial-number-list', {
            method: 'GET',
            query: {
              ...mainQuery,
              rowPerPage: pageSize,
              pageNumber: pageIndex
            }
          });
          if (response.success) {
            let installedRespData = [];
            if (installedData && installedData.length > 0 && level === 0) {
              let transactionIdArr = [];
              installedData.map((vl) => {
                transactionIdArr.push({
                  stockLedgerId: vl.id,
                  transaction: vl.quantity < 0 ? 'debit' : 'credit'
                });
              });
              const resp = await request('/installed-serial-number', { method: 'POST', body: { transactionIdArr: transactionIdArr } });
              if (resp.success) {
                setSerialNumberDetails(true);
                installedRespData = resp?.data?.serialNumber;
              }
            }
            setSerialNumberDetails(true);
            let respData = response?.data?.data?.rows || [];
            let apiData = respData.map((item) => item.serialNumber);
            let allData = makeAllRespData(sortAlphanumeric(apiData), response?.data?.data?.count, pageIndex, pageSize);
            const allDataResp = paginateData(allData, sortAlphanumeric(installedRespData), pageIndex, pageSize);
            setSerialNumberCount(response?.data?.data?.count + installedRespData?.length);

            if (installedRespData && installedRespData?.length && level === 0) {
              createNewSerialData(
                arrToArrObj(
                  allDataResp?.currentPageData?.filter((vl) => vl !== ''),
                  respData
                )
              );
            } else {
              createSerialData(respData, false);
            }
          }
          if (allResp.success) {
            let installedRespData = [];
            if (installedData && installedData.length > 0 && level === 0) {
              let transactionIdArr = [];
              installedData.map((vl) => {
                transactionIdArr.push({
                  stockLedgerId: vl.id,
                  transaction: vl.quantity < 0 ? 'debit' : 'credit'
                });
              });
              const resp = await request('/installed-serial-number', { method: 'POST', body: { transactionIdArr: transactionIdArr } });
              if (resp.success) {
                installedRespData = resp?.data?.serialNumber;
              }
            }
            setSerialNumberDetails(true);
            let respData = allResp?.data?.data?.rows || [];
            let apiData = respData.map((item) => item.serialNumber);
            const allDataResp = [
              ...apiData.map((v) => {
                return typeof v === 'string'
                  ? { serialNumber: v, status: 'active' }
                  : { ...v, status: v.status === '1' ? 'active' : v.status === '0' ? 'inActive' : v.status };
              }),
              ...sortAlphanumeric(installedRespData).map((v) => {
                return { serialNumber: v, status: 'inActive' };
              })
            ];
            if (installedRespData && installedRespData?.length && level === 0) {
              setAllSNData(
                allDataResp.map((vl, i) => {
                  return {
                    nos: i + 1,
                    serialNo: vl?.serialNumber,
                    status: vl?.status
                  };
                })
              );
            } else {
              setAllSNData(
                [
                  ...respData.map((v) => {
                    return typeof v === 'string'
                      ? { serialNumber: v, status: 'active' }
                      : { ...v, status: v.status === '1' ? 'active' : v.status === '0' ? 'inActive' : v.status };
                  })
                ].map((vl, i) => {
                  return {
                    nos: i + 1,
                    serialNo: vl?.serialNumber,
                    status: vl?.status
                  };
                })
              );
            }
          }
        }
      }
    },
    [
      createSerialData,
      createOldSerialData,
      createNewSerialData,
      pageIndex,
      makeAllRespData,
      paginateData,
      allValues,
      pageSize,
      level,
      tableData,
      modal,
      data,
      fetchApiDetails
    ]
  );

  useEffect(() => {
    if (pageIndex && pageSize && serialIndex !== null && serailActive !== null) showSerialNo(serialIndex, serailActive, selectedRow);
  }, [pageIndex, pageSize, serialIndex, serailActive, showSerialNo, selectedRow]);

  const scrollCss = modal ? { height: 400, overflow: 'auto', paddingRight: 60, marginBottom: 20 } : {};

  return (
    <>
      <MainCard
        content={false}
        smallTitle={true}
        title={headTitle}
        secondary={
          level !== 1 && level !== 2 && <CSVExport data={tableExportData.getData(data, cols)} filename={'expanding-sub-table.csv'} />
        }
      >
        <ScrollX style={scrollCss}>
          <Table>
            <TableHead style={{ position: 'sticky', top: -0.1, zIndex: 2 }}>
              <TableRow>
                {cols && cols.length > 0 && cols.map((col) => <TableCell key={col.Header}>{col.Header}</TableCell>)}
                {level === 0 && !modal && (
                  <TableCell sx={{ width: 20 }}>
                    <MoreOutlined style={moreFontSize} onClick={() => showDetails(true, null)} />
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData &&
                tableData.length > 0 &&
                tableData.map((row, ind) => (
                  <TableRow key={row.id}>
                    {row.newRow ? (
                      <TableCell colSpan={cols.length}>
                        <TableSubForm
                          cols={cols}
                          subCols={subCols}
                          superSubCols={superSubCols}
                          level={level + 1}
                          fetchSubData={fetchSubData}
                          row={tableData[ind - 1]}
                          showDetails={showDetails}
                          allValues={allValues}
                          setAllTableData={setAllTableData}
                          showSubDetails={showSubDetails}
                        />
                      </TableCell>
                    ) : (
                      <>
                        {cols &&
                          cols.length > 0 &&
                          cols.map((col) => (
                            <TableCell key={row.id + col.Header}>
                              {col.Header === ' ' && !modal ? (
                                <>
                                  {!row.storeLocation ||
                                  (row.storeLocation &&
                                    row.storeLocation.name &&
                                    (row.storeLocation.name.toLowerCase().includes('installer') ||
                                      row.storeLocation.name.toLowerCase().includes('old') ||
                                      row.storeLocation.name.toLowerCase().includes('installed')) &&
                                    !row.installer) ? (
                                    <Arrows
                                      row={row}
                                      index={ind}
                                      openCloseRow={(index, bl) => {
                                        updateTable(index, bl, level);
                                      }}
                                    />
                                  ) : (
                                    <>&nbsp;&nbsp;</>
                                  )}
                                </>
                              ) : col.Header === 'QTY' && row.material?.isSerialNumber ? (
                                <Typography
                                  onClick={() => {
                                    setSerialIndex(ind);
                                    setSerailActive(modal || row?.storeLocation?.name?.toLowerCase().includes('installed') ? 0 : 1);
                                    if (row?.storeLocation?.name?.toLowerCase().includes('installed')) setSelectedRow(row);
                                    else setSelectedRow(undefined);
                                    modal
                                      ? showSerialNo(ind, 0)
                                      : showSerialNo(
                                          ind,
                                          row?.storeLocation?.name?.toLowerCase().includes('installed') ? 0 : 1,
                                          row?.storeLocation?.name?.toLowerCase().includes('installed') ? row : undefined
                                        );
                                  }}
                                  color={'primary'}
                                  sx={{ cursor: 'pointer' }}
                                >
                                  {getValueByAccessor(row, col.accessor)}
                                </Typography>
                              ) : (
                                (row[col.Header] = ['Updated On', 'Created On', 'Submitted On'].includes(col.Header)
                                  ? formatTimeStamp(getValueByAccessor(row, col.accessor))
                                  : col.Header.includes('Date')
                                  ? formatTimeStamp(getValueByAccessor(row, col.accessor))
                                  : col.Header === 'Rate' || col.Header === 'Value'
                                  ? getValueByAccessor(row, col.accessor)?.toFixed(2)
                                  : getValueByAccessor(row, col.accessor))
                              )}
                            </TableCell>
                          ))}
                        {!modal && (
                          <TableCell sx={{ width: 20 }}>
                            <MoreOutlined
                              style={moreFontSize}
                              onClick={() => {
                                level === 0 ? showDetails(true, ind) : showSubDetails(true, tableData, ind);
                              }}
                            />
                          </TableCell>
                        )}
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollX>
      </MainCard>
      <Modal open={details} onClose={handleClose} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: '95%' }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={handleClose} style={closeCss} />
            </Grid>
          </Grid>
          <div>
            <TableFormData
              data={structuredClone(detailData)}
              allValues={allValues}
              cols={Headers.viewHeaders}
              headTitle={title}
              modal={true}
            />
          </div>{' '}
        </MainCard>
      </Modal>
      <Modal open={serialNumberDetails} onClose={onClose} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: 1020 }} modal darkTitle content={false}>
          <Grid container alignItems={'center'} sx={{ mt: -1, mb: -1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={onClose} style={closeCss} />
            </Grid>
          </Grid>
          <TableForm
            data={serialNumberData || []}
            allData={allSNData || []}
            columns={Headers.serialHeaders}
            count={serialNumberCount}
            hideActions
            hideAddButton
            hideSearch
            hideColumnsSelect
            title="Serial Numbers"
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </MainCard>
      </Modal>
    </>
  );
};

TableFormData.propTypes = {
  data: PropTypes.any,
  cols: PropTypes.any,
  subCols: PropTypes.any,
  showDetails: PropTypes.func,
  show: PropTypes.bool,
  headTitle: PropTypes.string,
  showSerials: PropTypes.bool,
  subData: PropTypes.any,
  showStoreLocationData: PropTypes.func,
  showSubDetails: PropTypes.func,
  modal: PropTypes.bool,
  level: PropTypes.number,
  superSubCols: PropTypes.array,
  fetchSubData: PropTypes.func,
  setAllTableData: PropTypes.func,
  allValues: PropTypes.any
};

const ExpandingNewTable = ({ data, cols, subCols, superSubCols, setAllTableData, fetchSubData, allValues }) => {
  return (
    <>
      <TableFormData
        cols={cols}
        data={data}
        subCols={subCols}
        superSubCols={superSubCols}
        level={0}
        headTitle={' '}
        fetchSubData={fetchSubData}
        setAllTableData={setAllTableData}
        modal={false}
        allValues={allValues}
      />
    </>
  );
};

ExpandingNewTable.propTypes = {
  data: PropTypes.any,
  cols: PropTypes.any,
  subCols: PropTypes.any,
  superSubCols: PropTypes.array,
  fetchSubData: PropTypes.func,
  setAllTableData: PropTypes.func,
  allValues: PropTypes.any
};

export default ExpandingNewTable;
