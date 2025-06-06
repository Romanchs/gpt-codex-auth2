import { Box, Checkbox, Divider, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { detailsTabStyles as styles } from '../styles';
import { defaultColumns, roleOptions } from './constants';
import Grid from '@mui/material/Grid';
import StyledInput from '../../../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../../../Components/Theme/Table/StyledTable';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../../../../Components/Theme/Table/NotResultRow';
import {
  useAutocompleteQuery,
  useDeleteTkoPointMutation,
  useGetProcessApsQuery,
  useGetProcessQuery,
  useInitProcessMutation
} from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { setInitData } from '../../slice';
import { useParams } from 'react-router-dom';
import DatePicker from '../../../../../Components/Theme/Fields/DatePicker';
import moment from 'moment/moment';
import { Pagination } from '../../../../../Components/Theme/Table/Pagination';
import React, { useEffect, useMemo, useState } from 'react';
import TableSelect from '../../../../../Components/Tables/TableSelect';
import { CONNECTION_STATUSES } from '../../../../../util/directories';
import CircleButton from '../../../../../Components/Theme/Buttons/CircleButton';
import DelegateInput from '../../../../delegate/delegateInput';
import { useChangePPKORolesQuery } from '../../../changePPKO/api';

const DetailsTab = ({ setIsLoading }) => {
  const dispatch = useDispatch();
  const [timeOut, setTimeOut] = useState(null);
  const { uid } = useParams();
  const [search, setSearch] = useState({});
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { t, i18n } = useTranslation();
  const { data: autocompleteData, isFetching: isAutocompleteLoading } = useAutocompleteQuery({}, { skip: uid });
  const { full_name } = useSelector(({ user }) => user);
  const { initData } = useSelector(({ accountingServiceCompletion }) => accountingServiceCompletion);
  const initMutation = useInitProcessMutation({
    fixedCacheKey: 'initAccountingServiceCompletion'
  });
  const { data: processData, isFetching: isProcessLoading } = useGetProcessQuery({ uid }, { skip: !uid });
  const { data: apsData, isFetching: isApsLoading } = useGetProcessApsQuery({ uid, params }, { skip: !uid });
  const [deleteTko, { isLoading: isDeleting }] = useDeleteTkoPointMutation();
  const { data: rolesData, isFetching: isRolesLoading } = useChangePPKORolesQuery();

  useEffect(() => {
    setIsLoading(isAutocompleteLoading || isProcessLoading || isDeleting || isApsLoading || isRolesLoading);
  }, [isAutocompleteLoading, isProcessLoading, isDeleting, isApsLoading, rolesData]);

  const isLoading = isProcessLoading || isAutocompleteLoading;

  const handleRole = (role, value) => {
    dispatch(setInitData({ ...initData, roles_info: { ...initData.roles_info, [role]: value } }));
  };

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    if (key === 'connection_status') {
      setParams({ ...params, [key]: value, page: 1 });
      return;
    }
    if (key === 'chosen') {
      setParams({ ...params, [key]: value.length ? Boolean(Number(value)) : value, page: 1 });
      return;
    }
    if (key === 'eic' && value.length < 16 && value.length > 0) return;
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        setParams({ ...params, [key]: value, page: 1 });
      }, 1000)
    );
  };

  const getSearch = (key) => {
    switch (key) {
      case 'connection_status':
        return (
          <TableSelect
            value={search.connection_status}
            id={'connection_status'}
            data={Object.entries(CONNECTION_STATUSES)
              .filter((i) => i[0] !== 'Underconstruction' && i[0] !== 'Demolished')
              .map((i) => ({
                value: i[0],
                label: t(i[1])
              }))}
            onChange={(key, value) => onSearch(key, value)}
          />
        );
      case 'dropped_out_of_process':
        return (
          <TableSelect
            value={search.chosen || ''}
            data={[
              { label: t('CONTROLS.YES'), value: '1' },
              { label: t('CONTROLS.NO'), value: '0' }
            ]}
            id={'chosen'}
            minWidth={80}
            onChange={onSearch}
          />
        );
      case 'delete-tko':
        return null;
      default:
        return (
          <input
            value={search[key] || ''}
            onChange={({ target }) => onSearch(key, target.value)}
            {...(key === 'eic' ? { maxLength: 16 } : {})}
          />
        );
    }
  };

  const getValue = (data, key) => {
    switch (key) {
      case 'connection_status':
        return i18n.exists(CONNECTION_STATUSES[data[key]]) && t(CONNECTION_STATUSES[data[key]]);
      case 'dropped_out_of_process':
        return data?.chosen
          ? data?.cancel_by_process?.rejected_at
            ? moment(data?.cancel_by_process?.rejected_at).format('DD.MM.yyyy • HH:mm')
            : t('CONTROLS.YES')
          : t('CONTROLS.NO');
      default:
        return data[key];
    }
  };

  const handleDeleteTko = (tkoUid) => {
    deleteTko({ processUid: uid, tkoUid: tkoUid });
  };

  const columns = [
    ...defaultColumns,
    processData?.status === 'IN_PROCESS' && {
      key: 'delete-tko',
      title: '',
      minWidth: 30,
      align: 'right',
      renderBody: (...args) => (
        <Box>
          <CircleButton
            type={'delete'}
            title={t('CONTROLS.DELETE')}
            onClick={() => handleDeleteTko(args[0].uid)}
            size={'small'}
            disabled={!processData?.can_delete_point}
          />
        </Box>
      )
    }
  ].filter(Boolean);

  const filteredRolesOptions = useMemo(() => roleOptions.filter((el) => rolesData?.[el.value]), [rolesData]);

  return (
    <Box>
      <Box sx={styles.rolesBox}>
        <Typography sx={styles.rolesBoxTitle}>
          {uid ? t('SELECTED_PPCO_ROLES_CHANGE') : t('SELECT_ROLES_PPCO_CHANGE')}
        </Typography>
        <Divider />
        <Box sx={styles.checkboxContainer}>
          {filteredRolesOptions.map(({ value, label }) => (
            <Box key={value} sx={styles.checkboxElement}>
              <Checkbox
                sx={{ padding: 0, height: 24, width: 24 }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<TaskAltRoundedIcon color={'orange'} />}
                onChange={(e) => handleRole(value, e.target.checked)}
                checked={initData.roles_info[value]}
                data-status={initData.roles_info[value] ? 'active' : 'inactive'}
                disabled={Boolean(uid)}
              />
              <Typography>{t(label)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.SHORT_PPKO_NAME')}
              value={uid ? processData?.additional_data?.ppko_company?.short_name : autocompleteData?.short_name}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.EIC_PPKO')}
              value={uid ? processData?.additional_data?.ppko_company?.eic : autocompleteData?.eic}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              value={uid ? processData?.additional_data?.ppko_company?.usreou : autocompleteData?.usreou}
              readOnly
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }} alignItems={'flex-start'}>
          <Grid item xs={12} md={2}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.PLANNED_EXECUTION_DATE')}
                value={
                  processData?.additional_data?.planned_completion_date &&
                  moment(processData?.additional_data?.planned_completion_date).format('DD.MM.yyyy')
                }
                readOnly
              />
            ) : (
              <DatePicker
                label={t('FIELDS.PLANNED_EXECUTION_DATE')}
                required
                value={initData?.planned_completion_date}
                minDate={
                  autocompleteData?.min_date_start
                    ? moment(autocompleteData?.min_date_start).add(1, 'days')
                    : moment().add(14, 'day')
                }
                error={initMutation[1]?.error?.data?.planned_completion_date}
                onChange={(v) => {
                  dispatch(setInitData({ ...initData, planned_completion_date: moment(v).format() }));
                  initMutation[1]?.reset();
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={2}>
            <StyledInput
              label={t('FIELDS.FORMED_DATE_TIME')}
              value={
                processData?.additional_data?.formed_at &&
                moment(processData?.additional_data?.formed_at).format('DD.MM.yyyy • HH:mm')
              }
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t(
                processData?.status?.startsWith('CANCELED')
                  ? 'FIELDS.CANCELED_AT'
                  : processData?.status === 'REJECTED'
                  ? 'FIELDS.REQUEST_CANCEL_REJECTED_DATE'
                  : 'FIELDS.DONE_DATETIME'
              )}
              value={processData?.finished_at && moment(processData.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={5}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              readOnly
              value={uid ? processData?.initiator?.username : full_name}
              data={processData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={processData?.created_at && moment(processData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }} alignItems={'flex-start'}>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={uid ? processData?.additional_data?.ppko_company?.short_name : autocompleteData?.short_name}
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      {processData?.status && processData?.status !== 'NEW' && (
        <>
          <StyledTable>
            <TableHead>
              <TableRow>
                {columns.map(({ title, key, minWidth = 0 }) => (
                  <TableCell key={key} sx={{ minWidth }}>
                    <p>{t(title)}</p>
                    {getSearch(key)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {apsData?.aps.data.length === 0 && (
                <NotResultRow text={t('THERE_ARE_NO_AP')} span={columns.length} small />
              )}
              {apsData?.aps.data.map((item, index) => (
                <TableRow key={index} className="body__table-row">
                  {columns.map(({ key, renderBody, align }) => (
                    <TableCell key={key} data-marker={key} align={align}>
                      {renderBody ? renderBody(item) : getValue(item, key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          <Pagination
            {...apsData?.aps}
            loading={isLoading}
            params={params}
            onPaginate={(p) => setParams({ ...params, ...p })}
          />
        </>
      )}
    </Box>
  );
};

export default DetailsTab;
