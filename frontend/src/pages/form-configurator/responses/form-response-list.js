import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
// import QRCode from 'qrcode.react';
import { Button, Dialog, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useDefaultFormAttributes } from '../useDefaultAttributes';
import { useFormResponses } from './useFormResponses';
import ImageCard from './response-images';
import { Filters } from './filters';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { getFormAttributes, getFormResponses, getSecondFormResponses } from 'store/actions';
import { formResponsesSlice } from 'store/reducers/formResponseSlice';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import Loader from 'components/Loader';

const ignoredColumnTypesForFilter = ['ocr', 'blob', 'network', 'location', 'date', 'file', 'image'];
const ignoredColumnTypesForSort = ['ocr', 'blob', 'file', 'image'];

const FormResponsePage = () => {
  const dispatch = useDispatch();
  const [enable, setEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const firstRenderRef = useRef(true);
  const firstRenderSecondRef = useRef(true);
  const prevFilterParamsForCount = useRef({});
  const [gaaLevelData, setGAALevelData] = useState();
  const [accessRank, setAccessRank] = useState(-1);
  const [gaaLevelFilter, setGaaLevelFilter] = useState();
  const { formId, formName, info, isTemp } = useParams();
  const [record, setRecord] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [countLoader, setCountLoad] = useState(false);
  const [refreshCount, setRefreshCounts] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [listType, setListType] = useState(1);
  const [restoreRow, setRestoreRow] = useState(null);
  const [count, setCount] = useState(0);
  // const [openQR, setOpenQR] = useState(false);
  // const [QRcode, setQRcode] = useState();
  const [fileList, setFileList] = useState([]);
  const [sort, setSort] = useState(null);
  const [reportsData, setReportsData] = useState({ data: [], count: 0, column: [], isLoading: false });
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setAccessors, setSearchString, searchStringTrimmed } = useSearch({ isFcMode: true });
  const { filterObjectForApi, clearAllFilters } = useFilterContext();
  const filterObjectRef = useRef({ filterObjectForApi, sort });

  const getFormResponse = useCallback(() => {
    setDataLoading(true);
    if (gaaLevelData && !gaaLevelFilter) return;
    const newRef = { filterObjectForApi, sort };
    if (!isEqual(filterObjectRef.current, newRef)) {
      filterObjectRef.current = newRef;
      refreshPagination();
      if (pageIndex !== 1) {
        return;
      }
    }
    let promise;
    if (formId && !info) {
      promise = dispatch(
        getFormResponses({
          pageIndex: pageIndex,
          pageSize,
          formId,
          sortBy: sort?.[0] || 'Updated On',
          sortOrder: sort?.[1] || 'DESC',
          sortType: sort?.[3],
          filterObject: filterObjectForApi,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed }),
          listType,
          gaaLevelFilter
        })
      );
      promise
        .then(() => {
          setDataLoading(false);
        })
        .catch(() => {
          setDataLoading(false);
        });
    }
    return () => {
      promise?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    pageIndex,
    pageSize,
    formId,
    filterObjectForApi,
    gaaLevelFilter,
    searchStringTrimmed,
    sort,
    listType,
    refreshPagination,
    info
  ]);

  const getResponseCount = useCallback(async () => {
    if (info) return;
    if (gaaLevelData && !gaaLevelFilter) return;
    setCountLoad(true);
    const response = await request('/form-form-responses', {
      method: 'POST',
      body: {
        formId,
        isActive: listType,
        filterObject: filterObjectForApi,
        searchString: searchStringTrimmed,
        gaaLevelFilter
      },
      query: { countOnly: '1' },
      timeoutOverride: 10 * 60 * 1000
    });
    if (response.status === 200 && response?.data?.data?.count) {
      setCount(response?.data?.data?.count);
    }
    setCountLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterObjectForApi, gaaLevelFilter, formId, listType, searchStringTrimmed, refreshCount]);

  useEffect(() => {
    if (firstRenderSecondRef.current) {
      firstRenderSecondRef.current = false;
      return;
    }
    getResponseCount();
  }, [getResponseCount]);

  const getFormReport = useCallback(
    async ({ countOnly } = {}) => {
      if ((gaaLevelData && !gaaLevelFilter) || (countOnly && countLoader)) return;

      const currentApiFilterParams = { formId, mode: info, gaaLevelFilter };

      let shouldLoadCount = false;
      if (countOnly && !isEqual(prevFilterParamsForCount.current, currentApiFilterParams)) {
        shouldLoadCount = true;
        prevFilterParamsForCount.current = currentApiFilterParams;
      }
      if (countOnly && !shouldLoadCount) {
        return;
      }

      if (countOnly) {
        setCountLoad(true);
      } else {
        setReportsData((prev) => ({ ...prev, isLoading: true }));
      }

      setDataLoading(true);
      const response = await request('/form-response-report', {
        method: 'GET',
        query: { isTemp, pageIndex, pageSize, countOnly, ...currentApiFilterParams }
      });

      if (response.success) {
        if (countOnly) {
          setReportsData((prev) => ({ ...prev, count: response?.data?.data?.count }));
          setCountLoad(false);
        } else {
          const { data } = response.data;
          setReportsData((prev) => {
            getFormReport({ countOnly: '1' });
            return { ...prev, data: data?.rows, column: data?.columns, isLoading: false };
          });
        }
      } else {
        if (countOnly) {
          setCountLoad(false);
        } else {
          setReportsData((prev) => ({ ...prev, isLoading: false }));
        }
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      }
      setDataLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageIndex, pageSize, formId, info, gaaLevelFilter]
  );

  useEffect(() => {
    if (!firstRenderRef.current) {
      if (info) {
        getFormReport();
      } else {
        getFormResponse();
      }
    }
    firstRenderRef.current = false;
  }, [getFormResponse, getFormReport, info]);

  // Checking if GAA is configured for this project

  function getIndexForHierarchies(pre, hierarchy, objectKey) {
    const index = pre.findIndex((x) => Object.keys(x).includes(objectKey));
    let hierarchyIndex = -1;
    if (index > -1) {
      hierarchyIndex = pre[index][objectKey].findIndex((x) => x.id === hierarchy);
    }
    return { index, hierarchyIndex };
  }
  const getProjectAreaLevels = useCallback(
    async (levelType, hierarchy, selectedParent, method = 'get') => {
      const fetchingLevelEnteries = method === 'post';
      const objectKey = levelType === 'gaa' ? 'gaaLevels' : 'networkLevels';
      const isDynamicFlag = '1';
      if (method === 'post' && isDynamicFlag !== '1') return;
      if (fetchingLevelEnteries) {
        setGAALevelData((pre) => {
          const { index, hierarchyIndex } = getIndexForHierarchies(pre, hierarchy, objectKey);
          if (index > -1 && hierarchyIndex > -1) {
            pre[index][objectKey][hierarchyIndex].gaa_level_entries = [];
          }
          return pre;
        });
      }
      setLoading(true);
      const response = await request('/area-project-level', {
        method,
        params: formId,
        query: { formId, sort: ['rank', 'ASC'], isHeirarchiesOnly: isDynamicFlag },
        body: { hierarchy, selectedParent }
      });
      if (response.success) {
        setEnable(true);
        const { data, accessRank: accessRankData, levelEntires } = response.data;
        if (accessRankData) {
          setAccessRank(accessRankData);
        }
        setLoading(false);
        if (fetchingLevelEnteries && levelEntires?.length > 0) {
          setGAALevelData((pre) => {
            const { index, hierarchyIndex } = getIndexForHierarchies(pre, hierarchy, objectKey);
            if (index > -1 && hierarchyIndex > -1) {
              pre[index][objectKey][hierarchyIndex].gaa_level_entries = levelEntires;
            }
            return pre;
          });
        }
        if (data?.some((entry) => entry.count > 0)) {
          setGAALevelData(data);
        }
      } else {
        setLoading(false);
      }
    },
    [formId]
  );

  useEffect(() => {
    getProjectAreaLevels();
  }, [getProjectAreaLevels]);

  useEffect(() => {
    if (record?.['Response ID']) {
      formId && !info && dispatch(getSecondFormResponses({ pageIndex, pageSize, formId, recordId: record?.['Response ID'] }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, formId, info, record]);

  useEffect(() => {
    return () => {
      dispatch(formResponsesSlice.actions.reset());
    };
  }, [dispatch, formId]);

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC', listType: 2 }));
    }
  }, [dispatch, formId]);

  const { formAttributes } = useDefaultFormAttributes();
  const formCatagory = useMemo(() => formAttributes?.formAttributesObject?.formsData?.master_maker_lov?.name || '', [formAttributes]);
  const formAttributesList = useMemo(() => formAttributes?.formAttributesObject?.rows || [], [formAttributes]);

  const formAttributesArray = useMemo(() => {
    const defaultColumnsToAdd = [
      { id: 'mdm_payload_title', name: 'MDM Payload Title' },
      { id: 'mdm_payload_timestamp', name: 'MDM Payload Timestamp' },
      { id: 'mdm_payload_status', name: 'MDM Payload Status' },
      { id: 'mdm_payload_message', name: 'MDM Payload Message' }
    ];
    // include some default columns & exclude material related columns and factory table related columns always
    const existingColumns =
      formAttributesList
        ?.filter(
          (x) =>
            x.isActive !== '0' &&
            !(
              [
                '2bfda55d-d007-4c75-b696-5ee05ef1ec66',
                '02cc1fdc-0c8b-4cf9-9977-34fed65601e7',
                '63dfdba2-8bbc-40ea-a934-f38e44d0d2ca'
              ].includes(x.properties.sourceTable) ||
              (x.properties.factoryTable && x.properties.factoryColumn) ||
              x.properties.isMaterial
            )
        )
        ?.map((entry) => ({ id: entry.columnName, name: entry.name })) || [];
    return Array.from(new Set([...existingColumns, ...defaultColumnsToAdd]));
  }, [formAttributesList]);

  const { formResponse, secondFormResponse } = useFormResponses();
  const { data, columns, permissions } = useMemo(
    () => ({
      permissions: formResponse.formResponseObject.formPermissions || {},
      data: formResponse.formResponseObject?.rows || [],
      columns: formResponse.formResponseObject?.columns || []
    }),
    [formResponse]
  );

  const {
    historyData,
    historyCounts,
    isLoading: isLoadingHistory
  } = useMemo(
    () => ({
      historyData: secondFormResponse.formResponseObject?.rows || [],
      historyCounts: secondFormResponse.formResponseObject?.count || 0,
      isLoading: secondFormResponse.loading || false
    }),
    [secondFormResponse]
  );

  const downloadFile = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.click();
  };

  const handleResponseUpdate = (item) => {
    window.open(`/form-response-data/${formId}/${item['Response ID']}/edit`, '_blank');
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleResponseView = (item) => {
    window.open(`/form-response-data/${formId}/${item['Response ID']}/view`, '_blank');
  };

  const handleResponseDelete = async (item) => {
    setDeleteId(item);
    setOpenDeleteModal(true);
  };

  const setListTypeData = (value) => {
    setListType(value);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const confirmDelete = async () => {
    let response = await request(`/form/delete-response`, {
      method: 'DELETE',
      params: `${formId}/${deleteId?.['Response ID']}`,
      query: { is_active: 0 }
    });
    if (response.success) {
      setRefreshCounts((pre) => !pre);
      toast('Response Deleted Successfully', { variant: 'success', autoHideDuration: 5000 });
      formId && getFormResponse();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const confirmRestore = async () => {
    setOpenRestoreModal(false);
    window.open(`/form-response-data/${formId}/${restoreRow['Response ID']}/edit`, '_blank');
  };

  const updateColumnUtil = (columnArr = []) =>
    columnArr.map((item) => {
      let column = structuredClone(item);

      const isSupportedDateColumnForFilter =
        column.type === 'date' && (column?.properties?.pickerType === 'dateOnly' || column?.properties?.pickerType === 'dateTimeBoth');

      if (!info) {
        if (!ignoredColumnTypesForFilter.includes(column.type) || isSupportedDateColumnForFilter) {
          column = {
            ...column,
            filterProps: {
              formId: formId,
              apiRouteForFetchOptions: '/form-get-distinct-column',
              tableName: item.Header,
              customAccessor: item.column,
              isDateTypeColumn: isSupportedDateColumnForFilter,
              filterObjectForApi,
              method: 'post',
              gaaLevelFilter
            }
          };
        }

        if (ignoredColumnTypesForSort.includes(column.type)) {
          column = { ...column, disableSortBy: true };
        }
      } else {
        column = { ...column, disableSortBy: true };
      }

      if (column.type === 'image') {
        return {
          ...column,
          Cell: (list) =>
            list?.row?.original?.[column.accessor]?.length ? (
              <Button
                onClick={() => {
                  setOpenImage(true);
                  setFileList(list?.row?.original?.[column.accessor]);
                }}
                size="small"
                variant="outlined"
                color="primary"
              >
                View
              </Button>
            ) : (
              <></>
            )
        };
      } else if (column.type === 'blob') {
        return {
          ...column,
          Cell: (list) =>
            list?.row?.original?.[column.accessor]?.length ? (
              <Button
                onClick={() => {
                  setOpenImage(true);
                  setFileList([list?.row?.original?.[column.accessor]]);
                }}
                size="small"
                variant="outlined"
                color="primary"
              >
                View
              </Button>
            ) : (
              <></>
            )
        };
      } else if (column.type === 'file') {
        return {
          ...column,
          Cell: (list) =>
            list?.row?.original?.[column.accessor]?.length ? (
              <Button
                onClick={() => downloadFile(list?.row?.original?.[column.accessor][0])}
                size="small"
                variant="outlined"
                color="primary"
              >
                View
              </Button>
            ) : (
              <></>
            )
        };
      } else if (column.type === 'checkbox') {
        return {
          ...column,
          accessor: (list) => list?.[column.accessor]
        };
      } else if (column.type === 'network') {
        return {
          ...column,
          minWidth: 550,
          Cell: (list) => {
            const cellContent = list?.row?.original?.[column.accessor];
            if (cellContent) {
              const formattedContent = cellContent.replace(/;/g, '<br />').replaceAll(',', ', ').replaceAll(':', ': ');
              return <Typography dangerouslySetInnerHTML={{ __html: formattedContent }} />;
            }
            return <></>;
          }
        };
      } else if (column.type === 'text' && column.column?.startsWith('vr_')) {
        return {
          ...column,
          Cell: (list) => {
            const cellContent = list?.row?.original?.[column.accessor];
            if (cellContent) {
              const formattedContent = cellContent.replace(/,/g, '<br />');
              return <Typography dangerouslySetInnerHTML={{ __html: formattedContent }} />;
            }
            return <></>;
          }
        };
      } else if (column.type === 'location') {
        return {
          ...column,
          minWidth: 250,
          accessor: (list) => list?.[column.accessor]?.replaceAll(',', ', '),
          Cell: (list) => {
            const cellContent = list?.row?.original?.[column.accessor];
            if (cellContent) {
              const parts = cellContent.split(',');
              const lat = parts[0]?.trim();
              const lon = parts[1]?.trim();
              const accuracy = isNaN(parseFloat(parts[2]?.trim())) ? '' : parseFloat(parts[2].trim()).toFixed(7);
              return (
                <Grid container xl={12}>
                  <Grid item xl={6} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Tooltip title="Visit Location" placement="bottom">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          window.open(`https://maps.google.com?q=${lat},${lon}`);
                        }}
                      >
                        <LocationOnOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xl={6}>
                    <Typography>{lat}</Typography>
                    <Typography>{lon}</Typography>
                    <Typography>{accuracy}</Typography>
                  </Grid>
                </Grid>
              );
            }
            return <></>;
          }
        };
      }
      return column;
    });

  useEffect(() => {
    if (countLoader && formResponse.formResponseObject.nextButton) {
      setCount(pageIndex * pageSize + 1);
    }
  }, [countLoader, data, formResponse.formResponseObject.nextButton, info, pageIndex, pageSize, reportsData.data]);

  return (
    <>
      {(loading || dataLoading) && <Loader />}
      <Filters
        formName={formName}
        enable={enable}
        gaaAccessRank={accessRank}
        hierarchyLevelsData={gaaLevelData}
        loading={loading}
        setDataLoading={setDataLoading}
        getProjectAreaLevels={getProjectAreaLevels}
        handleProceed={(value) => {
          let newLevelFilter = {};
          if (value?.hierarchyType === 'gaa') {
            for (let i = gaaLevelData[0].gaaLevels.length - 1; i >= 0; i--) {
              if (value[`gaaLevelEntryId${i}`]?.length) {
                newLevelFilter[`${gaaLevelData[0].gaaLevels[i].columnName}`] = value[`gaaLevelEntryId${i}`];
                break;
              }
            }
          } else if (value?.hierarchyType === 'network') {
            for (let i = gaaLevelData[1].networkLevels.length - 1; i >= 0; i--) {
              if (value[`gaaLevelEntryId${i}`]?.length) {
                newLevelFilter[`${gaaLevelData[1].networkLevels[i].columnName}`] = value[`gaaLevelEntryId${i}`];
                break;
              }
            }
          }
          clearAllFilters();
          setGaaLevelFilter({
            ...newLevelFilter,
            ...(value?.fromDate && { fromDate: value?.fromDate }),
            ...(value?.toDate && { toDate: value?.toDate })
          });
        }}
      />
      <TableForm
        count={info ? reportsData?.count || 0 : count}
        customCount
        isMasterForm={['master data', 'masters'].includes(formCatagory?.toLowerCase())}
        countLoader={countLoader}
        data={info ? reportsData.data : data}
        columns={info ? updateColumnUtil(reportsData.column || []) : updateColumnUtil(columns || [])}
        oldColumns={info ? reportsData.column : columns}
        hideAddButton
        handleRowView={handleResponseView}
        handleRowUpdate={handleResponseUpdate}
        handleRowDelete={handleResponseDelete}
        handleRowRestore={handleRowRestore}
        handleRowHistory={handleRowHistory}
        hideViewIcon={!permissions?.view}
        hideEditIcon={!permissions?.update}
        hideType={!permissions?.deleteRecord || info}
        hideRestoreIcon={!permissions?.deleteRecord}
        hideDeleteIcon={!permissions?.deleteRecord}
        normalDate
        searchOnClick
        isFcMode
        hideSearch
        hideActions={info ? true : false}
        hideImportButton={info ? true : false}
        hideUpdateButton={info ? true : false}
        hideColumnsSelect={info ? true : false}
        listType={listType}
        setListType={setListTypeData}
        source="/form-responses"
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        formAttributesArray={formAttributesList?.length ? formAttributesArray : []}
        importConfig={{ apiBody: { formId } }}
        sortConfig={{ sort, setSort }}
        searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
        exportConfig={{
          tableName: 'form-responses',
          fileName: formName,
          apiBody: {
            gaaLevelFilter,
            formId,
            isActive: listType,
            isReport: !!info,
            isTemp,
            ...(info && { mode: info }),
            filterObject: filterObjectForApi,
            ...(sort && {
              sortObject: [
                {
                  sortBy: sort?.[0],
                  sortOrder: sort?.[1],
                  type: sort?.[3]
                }
              ]
            }),
            isExport: true
          },
          apiRoute: '/form-export-form-responses'
        }}
      />
      <Dialog open={openImage} onClose={() => setOpenImage(false)} scroll="paper" disableEscapeKeyDown>
        <ImageCard imageList={fileList} />
      </Dialog>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      <ConfirmModal
        open={openRestoreModal}
        handleClose={() => setOpenRestoreModal(false)}
        handleConfirm={confirmRestore}
        title="Confirm Restore"
        message="Are you sure you want to restore?"
        confirmBtnTitle="Restore"
      />
      <Dialog
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        scroll="paper"
        disableEscapeKeyDown
        maxWidth="xl"
        PaperProps={{
          style: {
            height: '90%',
            maxHeight: '90%'
          }
        }}
      >
        <TableForm
          isHistory
          title={formName}
          data={historyData}
          columns={updateColumnUtil(columns?.filter((x) => !['id'].includes(x.column)) || [])}
          oldColumns={columns}
          count={historyCounts}
          hideActions
          hideSearch
          hideAddButton
          hideExportButton
          normalDate
          hidePagination
          hideColumnsSelect
          forceDisableFilter
          loadingCondition={isLoadingHistory}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Dialog>
      {/* <Dialog open={openQR} onClose={() => setOpenQR(false)} scroll="paper" disableEscapeKeyDown>
        <Box sx={{ width: '25vw', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <QRCode value={JSON.stringify(QRcode)} size={300} />
        </Box>
      </Dialog> */}
    </>
  );
};

export default FormResponsePage;
