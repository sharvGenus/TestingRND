import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Grid, Stack, Typography, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  },
  {
    id: 'network',
    name: 'Network'
  }
];

export const Filters = ({ loading, gaaAccessRank, hierarchyLevelsData, handleProceed, formName, getProjectAreaLevels, enable }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        ...(hierarchyLevelsData && {
          hierarchyType: Validations.required
        })
      })
    ),
    defaultValues: { hierarchyType: 'gaa' },
    mode: 'all'
  });
  const { handleSubmit, setValue, watch } = methods;
  const valuesWatch = watch();

  const selectBox = (name, label, menus, req, onChange, defaultValue) => {
    return (
      <Stack>
        <RHFSelectbox
          required
          name={name}
          label={label}
          onChange={onChange}
          defaultValue={defaultValue}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const handleHierarchyId = () => {
    Object.keys(methods.getValues()).forEach((key) => {
      if (key.startsWith('gaaLevelEntryId')) {
        methods.setValue(key, []);
      }
    });
  };

  const txtBox = (name, label, type, defaultValue, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        disabled={name == 'user' || name == 'forms' ? true : false}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const filteredMenus = useCallback(
    (gaa, index) => {
      const prev = index - 1;
      return valuesWatch?.[`gaaLevelEntryId${prev}`]
        ? gaa.gaa_level_entries.filter((x) => valuesWatch?.[`gaaLevelEntryId${prev}`] === x?.parentId)
        : gaa.gaa_level_entries;
    },
    [valuesWatch]
  );

  const handleChangeDropDown = useCallback(
    (index, hLevelData, currentValues, isFixedLength, values) => {
      currentValues = structuredClone(currentValues);
      currentValues[`gaaLevelEntryId${index}`] = values;
      let i = index;
      while (i < (isFixedLength ? hLevelData.length - 1 : hLevelData.length)) {
        const nextKey = `gaaLevelEntryId${i + 1}`;
        const curKey = `gaaLevelEntryId${i}`;
        const nextGaa = hLevelData[i + 1];
        const nextMenus =
          currentValues?.[curKey] && nextGaa?.gaa_level_entries
            ? nextGaa?.gaa_level_entries?.filter((x) => currentValues?.[curKey] === x?.parentId)
            : nextGaa?.gaa_level_entries || [];
        const nextValue =
          (Array.isArray(currentValues[nextKey]) && currentValues[nextKey]?.filter((x) => nextMenus.some((y) => y.id === x))) || [];
        setValue(nextKey, nextValue);
        currentValues[nextKey] = nextValue;
        i += 1;
      }
    },
    [setValue]
  );

  const onFormSubmit = (formValues) => {
    const { fromDate, toDate, hierarchyType } = formValues;
    let errorFlag = false;
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      methods.setError(fromDate ? 'toDate' : 'fromDate', ' ', { shouldFocus: true });
      errorFlag = true;
    }
    if (hierarchyLevelsData) {
      const isGaaHierarchy = hierarchyType === 'gaa';
      const [{ gaaLevels }] = hierarchyLevelsData;
      if (!formValues['gaaLevelEntryId0']?.length) {
        methods.setError('gaaLevelEntryId0', { message: ' ' }, { shouldFocus: true });
        errorFlag = true;
      }
      if (isGaaHierarchy) {
        gaaLevels.forEach(({ rank }, index) => {
          if (index > 0 && rank <= gaaAccessRank && !formValues[`gaaLevelEntryId${index}`]?.length) {
            methods.setError(`gaaLevelEntryId${index}`, { message: ' ' }, { shouldFocus: true });
            errorFlag = true;
          }
        });
      }
    }
    if (errorFlag) return;
    if (hierarchyLevelsData) {
      handleProceed(formValues);
    } else {
      delete formValues.hierarchyType;
      handleProceed(formValues);
    }
  };

  const renderHierarchyTypeDropdown = () => (
    <Grid item md={2}>
      {selectBox('hierarchyType', 'Hierarchy Type', hierarchyData, false, handleHierarchyId, 'gaa')}
    </Grid>
  );

  const renderDateFields = () => (
    <>
      <Grid item md={2}>
        {txtBox('fromDate', 'Date From', 'date')}
      </Grid>
      <Grid item md={2}>
        {txtBox('toDate', 'Date To', 'date')}
      </Grid>
    </>
  );

  const renderProceedButton = () => (
    <Grid
      item
      md={2}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
    >
      {enable ? (
        <Button size="small" variant="contained" type="submit" allowClear disabled={loading}>
          Proceed
        </Button>
      ) : (
        <></>
      )}
    </Grid>
  );

  const renderErrorMessage = (message) => (
    <Grid
      item
      md={12}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
    >
      <Typography color="error">{message}</Typography>
    </Grid>
  );

  const renderLevels = (levels, levelType) =>
    levels.map((level, index) => (
      <Grid item md={2} key={level.id}>
        <RHFSelectbox
          required={index === 0 || (level.rank <= gaaAccessRank && levelType === 'gaa')}
          showHelperText={false}
          name={`gaaLevelEntryId${index}`}
          label={level.name}
          onChange={(args) => {
            handleChangeDropDown(index, levels, valuesWatch, true, args);
            if (index < levels.length - 1 && args?.target?.value && getProjectAreaLevels && typeof getProjectAreaLevels === 'function') {
              getProjectAreaLevels(levelType, levels[index + 1].id, args.target?.value, 'post');
            }
          }}
          menus={filteredMenus(level, index)}
          disable={
            index !== 0 &&
            ((level.rank > gaaAccessRank && levelType === 'gaa') || levelType === 'network') &&
            !valuesWatch?.[`gaaLevelEntryId${index - 1}`]?.length
          }
          allowClear
        />
      </Grid>
    ));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <MainCard
        sx={{ mb: 2 }}
        title={
          <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <IconButton sx={{ position: 'absolute', left: 10 }} onClick={() => window.history.back()} color="primary">
              <ArrowBackOutlinedIcon />
            </IconButton>
            <Typography sx={{ position: 'relative', left: 25 }} variant="h4">
              {formName}
            </Typography>
          </Grid>
        }
      >
        <Grid container item spacing={2} wrap="wrap">
          {hierarchyLevelsData ? (
            <>
              {methods.watch('hierarchyType') === 'gaa' ? (
                hierarchyLevelsData[0]?.gaaLevels?.length ? (
                  <>
                    {renderHierarchyTypeDropdown()}
                    {renderLevels(hierarchyLevelsData[0].gaaLevels, 'gaa')}
                    {renderDateFields()}
                    {hierarchyLevelsData[0]?.gaaLevels.length % 6 !== 2 && <Grid item xs />}
                    {renderProceedButton()}
                  </>
                ) : (
                  <>
                    {renderHierarchyTypeDropdown()}
                    {renderDateFields()}
                    <Grid item xs />
                    {renderProceedButton()}
                    {renderErrorMessage(`GAA level columns are not available in "${formName}" form.`)}
                  </>
                )
              ) : methods.watch('hierarchyType') === 'network' ? (
                hierarchyLevelsData[1]?.networkLevels?.length ? (
                  <>
                    {renderHierarchyTypeDropdown()}
                    {renderLevels(hierarchyLevelsData[1].networkLevels, 'network')}
                    {renderDateFields()}
                    {hierarchyLevelsData[1]?.networkLevels.length % 6 !== 2 && <Grid item xs />}
                    {renderProceedButton()}
                  </>
                ) : (
                  <>
                    {renderHierarchyTypeDropdown()}
                    {renderDateFields()}
                    <Grid item xs />
                    {renderProceedButton()}
                    {renderErrorMessage(`Network level columns are not available in "${formName}" form.`)}
                  </>
                )
              ) : null}
            </>
          ) : (
            <>
              {renderDateFields()}
              <Grid item xs />
              {renderProceedButton()}
            </>
          )}
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

Filters.propTypes = {
  loading: PropTypes.bool,
  hierarchyLevelsData: PropTypes.array,
  handleProceed: PropTypes.func,
  formName: PropTypes.string,
  gaaAccessRank: PropTypes.any,
  getProjectAreaLevels: PropTypes.func,
  enable: PropTypes.bool
};
