import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Grid, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { CSVLink } from 'react-csv';
import { DownloadOutlined } from '@ant-design/icons';
import CreateNewDevolution from './create-new-devoluion';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import MainCard from 'components/MainCard';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import DevolutionMaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/DevolutionMaterialSerialNumberModal';
import CircularLoader from 'components/CircularLoader';
import tableExportData from 'utils/tablesExportData';

const Devolution = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [showTable, setShowTable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [serialDataArr, setSerialDataArr] = useState([]);
  const [selectedSerials, setSelectedSerials] = useState([]);
  const [formData, setFormData] = useState({});
  const [dataCount, setDataCount] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [payloadRespArr, setPayloadRespArr] = useState([]);
  const navigate = useNavigate();
  const csvExportRef = useRef();
  const [allExportData, setAllExportData] = useState([]);

  const setAllShowTable = (fdata) => {
    setFormData(fdata);
    setShowTable(true);
  };

  const onOpenPopup = () => {
    setOpenModal(true);
  };

  const onSubmit = async () => {
    setLoading(true);
    const payload = {
      projectId: formData.projectId,
      formId: formData.formId,
      customerId: formData.customerId,
      customerStoreId: formData.customerStoreId,
      gaaHierarchy: formData.gaaHierarchy,
      devolution_materials: payloadRespArr
    };
    const response = await request('/devolution-create', {
      method: 'POST',
      timeoutOverride: 20 * 60000,
      body: payload
    });
    if (response.success) {
      setLoading(false);
      toast(`Devolution created successfully`, { variant: 'success' });
      navigate('/devolution-view');
    } else {
      setLoading(false);
      toast(response?.error?.message);
    }
  };

  const makeHeaders = (obj) => {
    const arr = [];
    Object.keys(obj).forEach((k) => {
      if (k !== 'Response ID') {
        arr.push({
          Header: k,
          accessor: k
        });
      }
    });
    return arr;
  };

  const getSelectedIds = (selectedData) => {
    const chunkSize = Math.min(selectedData.length, 10000); // Adjust chunk size based on memory
    let filteredData = [];

    for (let i = 0; i < selectedData.length; i += chunkSize) {
      const chunk = selectedData.slice(i, i + chunkSize); // Process chunk
      filteredData = filteredData.concat(chunk.map((item) => item['Response ID']));
    }

    return filteredData; // Save the filtered data
  };

  const getSelectedRecords = useCallback(
    async (vl, forExport = false) => {
      let newVl = getSelectedIds(vl);
      if (formData && formData.projectId && formData.formId) {
        setPayloadRespArr(
          vl.map((resp) => {
            return { responseId: resp['Response ID'], oldSerialNo: resp.oldSerialNo };
          })
        );
        const response = await request('/devolution-form-data', {
          method: 'POST',
          timeoutOverride: 20 * 60000,
          body: {
            projectId: formData.projectId,
            formId: formData.formId,
            selectedResponseIds: newVl,
            ...(!forExport && { pageNumber: pageIndex }),
            ...(!forExport && { rowPerPage: pageSize })
          }
        });
        if (response.success) {
          let { rows, count } = response.data.data;
          if (rows && rows.length > 0) {
            const newHeaders = makeHeaders(rows[0]);
            setHeaders([...newHeaders]);
            if (forExport) {
              setAllExportData(tableExportData.getData(rows, [...newHeaders], true, true));
              setTimeout(() => {
                if (rows && csvExportRef.current) csvExportRef.current.link.click();
              }, 500);
            } else {
              setData(rows);
              setDataCount(count);
            }
          }
        } else toast(response?.error?.message);
      }
    },
    [formData, pageIndex, pageSize]
  );

  useEffect(() => {
    selectedSerials && selectedSerials.length > 0 && getSelectedRecords(selectedSerials);
  }, [pageIndex, pageSize, selectedSerials, getSelectedRecords]);

  const getExportData = () => {
    selectedSerials && selectedSerials.length > 0 && getSelectedRecords(selectedSerials, true);
  };

  return (
    <>
      <CreateNewDevolution
        setShowTable={setAllShowTable}
        setSerialDataArr={(arr, key) => {
          setSerialDataArr(
            arr.map((vl) => {
              return { ...vl, oldSerialNo: vl[key] };
            })
          );
          setSelectedSerials([]);
          setData([]);
          setDataCount(0);
          setPageSize(25);
          setPageIndex(1);
        }}
      />
      <MainCard>
        {openModal && (
          <DevolutionMaterialSerialNumberModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={(selectedData) => {
              getSelectedRecords(selectedData);
              setSelectedSerials(selectedData);
            }}
            selectedSerials={selectedSerials}
            showCheckboxes
            showRejectSection
            serialNumberData={serialDataArr}
          />
        )}
        {showTable && (
          <div style={{ position: 'absolute', float: 'right', zIndex: 99, right: 80, top: 33 }}>
            <Tooltip title={'Devolution Export'}>
              <DownloadOutlined
                style={{
                  fontSize: '21px',
                  color: 'grey',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                onClick={() => {
                  getExportData();
                }}
              />
            </Tooltip>
          </div>
        )}
        <CSVLink ref={csvExportRef} data={allExportData} className="hidden" filename={'Devloution_Data_Export'} />
        {showTable && (
          <TableForm
            hideSearch
            hideExportButton
            hideColumnsSelect
            data={data}
            count={dataCount}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            columns={headers}
            onClick={onOpenPopup}
            hideActions
            normalDate
            exportConfig={{
              tableName: '',
              apiQuery: {}
            }}
          />
        )}
      </MainCard>
      {loading && <CircularLoader />}
      {data && data.length > 0 && (
        <Grid container spacing={4} mb={3}>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button disabled={loading} size="small" variant="contained" color="primary" onClick={onSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Devolution;
