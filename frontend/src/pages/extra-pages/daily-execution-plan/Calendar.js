import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch } from 'react-redux';
import { useProjects } from '../project/useProjects';
import { useProjectScope } from '../project-scope/useProjectScope';
import { PreData } from './headers';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { getDropdownProjects, getProjectAllScope } from 'store/actions';

const Calendar = ({ getFormsdata, getAllFormsData, data, setData }) => {
  const [populateDate, setPopulateDate] = useState([]);
  const [day, setDay] = useState([]);
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [materialTypeData, setMaterialTypeData] = useState([]);
  const [onlyOnce, setOnlyOnce] = useState(true);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  const {
    projectsDropdown: { projectsDropdownObject: projectsData }
  } = useProjects();

  const {
    projectAllScope: {
      projectScopeObject: { rows: projectScopeData }
    }
  } = useProjectScope();

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setValue('projectId', projectsData?.[0]?.id);
      dispatch(getProjectAllScope({ projectId: projectsData?.[0]?.id, listType: 1 }));
    }
  }, [projectsData, setValue, dispatch]);

  useEffect(() => {
    if (projectScopeData && projectScopeData.length > 0) {
      let materialTypeArr = new Set(projectScopeData.map((v) => JSON.stringify(v.material_type)));
      let materialTypeArrSet = [...materialTypeArr].map((v) => JSON.parse(v));
      setMaterialTypeData(materialTypeArrSet);
      if (onlyOnce) {
        setValue('materialTypeId', materialTypeArrSet?.[0]?.id);
        let reqData = {
          projectId: projectScopeData?.[0].projectId,
          materialTypeId: materialTypeArrSet?.[0]?.id
        };
        getFormsdata({
          ...reqData,
          ...(PreData.getCurrentMonthAndYear().month &&
            PreData.getCurrentMonthAndYear().year && {
              month: PreData.getCurrentMonthAndYear().month,
              year: PreData.getCurrentMonthAndYear().year
            })
        });
        getAllFormsData(reqData);
      }
      setOnlyOnce(false);
    } else {
      setMaterialTypeData([]);
      setValue('materialTypeId', null);
    }
  }, [projectScopeData, setValue, getAllFormsData, getFormsdata, onlyOnce]);

  const select = (name, label, menus, md, xs, onChange, required, disabled) => {
    return (
      <Grid item xs={xs} md={md}>
        <RHFSelectbox
          name={name}
          label={label}
          menus={menus}
          onChange={typeof onChange === 'function' ? onChange : () => {}}
          required={required}
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
        />
      </Grid>
    );
  };

  const makeCall = (values) => {
    if (values.month) setSelectedMonth(values.month);
    if (values.year) setSelectedYear(values.year);
    // if (values.projectId && values.materialTypeId && values.projectId !== null && values.materialTypeId !== null) {
    let reqData = {
      projectId: values?.projectId,
      materialTypeId: values?.materialTypeId
    };
    getFormsdata({ ...reqData, ...(values?.month && values?.year && { month: values?.month, year: values?.year }) });
    getAllFormsData(reqData);
    // }
  };

  const prev = (values) => {
    if (values.month === 1) {
      let reqData = {
        projectId: values?.projectId,
        materialTypeId: values?.materialTypeId,
        month: 12,
        year: values.year - 1
      };
      getFormsdata(reqData);
      setSelectedMonth(12);
      setSelectedYear(values.year - 1);
      setValue('month', 12);
      setValue('year', values.year - 1);
    } else {
      let reqData = {
        projectId: values?.projectId,
        materialTypeId: values?.materialTypeId,
        month: values.month - 1,
        year: values.year
      };
      getFormsdata(reqData);
      setSelectedMonth(values.month - 1);
      setValue('month', values.month - 1);
    }
  };

  const next = (values) => {
    if (values.month === 12) {
      let reqData = {
        projectId: values?.projectId,
        materialTypeId: values?.materialTypeId,
        month: 1,
        year: values.year + 1
      };
      getFormsdata(reqData);
      setSelectedMonth(1);
      setSelectedYear(values.year + 1);
      setValue('month', 1);
      setValue('year', values.year + 1);
    } else {
      let reqData = {
        projectId: values?.projectId,
        materialTypeId: values?.materialTypeId,
        month: values.month + 1,
        year: values.year
      };
      getFormsdata(reqData);
      setSelectedMonth(values.month + 1);
      setValue('month', values.month + 1);
    }
  };

  const getPreDetails = useCallback(() => {
    setPopulateDate(new Array(42).fill({ date: '', qty: null }));
    setDay(PreData.day);
    setMonth(PreData.month);
    setYear(PreData.year);
    setSelectedMonth(PreData.getCurrentMonthAndYear().month);
    setSelectedYear(PreData.getCurrentMonthAndYear().year);
    setValue('month', PreData.getCurrentMonthAndYear().month);
    setValue('year', PreData.getCurrentMonthAndYear().year);
  }, [setValue]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    getPreDetails();
  }, [setValue, getPreDetails, dispatch]);

  const generateCalendar = useCallback((calendarData, fillData = undefined) => {
    const { firstDate, lastDate } = calendarData;
    let prevData = new Array(42).fill({ date: '', qty: null });
    for (let i = parseInt(firstDate.day), j = firstDate.dayOfWeekIndex; i <= parseInt(lastDate.day); i++, j++) {
      prevData[j] = { date: i, qty: fillData && fillData.id ? fillData[`q${i}`] : null };
    }
    setPopulateDate([].concat(prevData));
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedMonth !== null && selectedYear && selectedYear !== null) {
      setPopulateDate([].concat(new Array(42).fill({ date: '', qty: null })));
      setTimeout(() => {
        generateCalendar(PreData.getFirstAndLastDateOfMonth(selectedYear, selectedMonth), data && data?.[0] ? data?.[0] : undefined);
      }, [100]);
    }
  }, [data, selectedMonth, selectedYear, generateCalendar]);

  return (
    <>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <FormProvider methods={methods}>
            <Grid container spacing={2}>
              {select('projectId', 'Project', projectsData, 3, 12, (e) => {
                setValue('materialTypeId', null);
                setData([]);
                getPreDetails();
                setTimeout(() => {
                  generateCalendar(PreData.getFirstAndLastDateOfMonth(selectedYear, selectedMonth), undefined);
                }, [100]);
                dispatch(getProjectAllScope({ projectId: e?.target?.value, listType: 1 }));
                let reqData = {
                  projectId: e?.target?.value,
                  materialTypeId: null
                };
                getFormsdata({ ...reqData });
              })}
              {select('materialTypeId', 'Material Type', materialTypeData, 3, 12, handleSubmit(makeCall))}
              <Grid item xs={12} md={1} sx={{}}></Grid>
              <Grid item xs={1} md={1} sx={{ textAlign: 'right' }}>
                <Tooltip title="Prev" placement="bottom" style={{ width: 25, marginTop: 30 }}>
                  <IconButton color="secondary" onClick={handleSubmit(prev)}>
                    <ArrowBackIosIcon style={{ fontSize: 24 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              {select('month', 'Month', month, 1.5, 4, handleSubmit(makeCall))}
              {select('year', 'Year', year, 1.5, 4, handleSubmit(makeCall))}
              <Grid item xs={1} md={1} sx={{ textAlign: 'left' }}>
                <Tooltip title="Next" placement="bottom" style={{ width: 25, marginTop: 30 }}>
                  <IconButton color="secondary" onClick={handleSubmit(next)}>
                    &nbsp;
                    <ArrowForwardIosIcon style={{ fontSize: 24 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
      <Grid container mb={3}>
        {day &&
          day.length &&
          day.map((val) => (
            <Grid key={val} item xs={1.7}>
              <Grid container sx={{ textAlign: 'center' }}>
                <Grid item xs={12} sx={{ minHeight: 25, fontWeight: 700 }}>
                  {val}
                </Grid>
              </Grid>
            </Grid>
          ))}
        {populateDate &&
          populateDate.length &&
          populateDate.map((val, ind) => (
            <Grid key={val} item xs={1.7}>
              <Grid
                container
                sx={{
                  border: '1px solid #afafaf',
                  textAlign: 'center',
                  background: ind % 7 === 0 || ind % 7 === 6 ? '#edfafa' : 'white'
                }}
              >
                <Grid item xs={12} sx={{ height: 35, fontWeight: 400, fontSize: 18, fontStyle: 'italic' }}>
                  {val.date}
                </Grid>
                <Grid item xs={12} sx={{ minHeight: 35, color: '#0767f7', fontWeight: 600, fontSize: 20 }}>
                  <span>{val.qty}</span>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

Calendar.propTypes = {
  getFormsdata: PropTypes.func,
  getAllFormsData: PropTypes.func,
  data: PropTypes.any,
  setData: PropTypes.func
};

export default Calendar;
