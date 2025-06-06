import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getTkosGrantingAuthorityTkos } from '../../../../actions/processesActions';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import DelegateInput from '../../../../features/delegate/delegateInput';
import TableChip from '../../../Tables/TableChip';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'mp', title: 'FIELDS.EIC_CODE', search: false, minWidth: 200 },
  { key: 'valid_to', title: 'FIELDS.UPDATED_INFO', search: false, minWidth: 200 },
  { key: 'region', title: 'FIELDS.REGION', search: false, minWidth: 100 },
  { key: 'city', title: 'FIELDS.CITY', search: false, minWidth: 150 },
  { key: 'grid_access_provider', title: 'FIELDS.GRID_ACCESS_PROVIDER', search: false, minWidth: 200 },
  { key: 'customer', title: 'FIELDS.AP_OWNER', search: false, minWidth: 60 },
  { key: 'date_end', title: 'FIELDS.ACCESS_PERIOD', search: false, minWidth: 200 }
];

const GrantingAuthorityTkoDetailsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  // Check roles & get data
  useEffect(() => {
    dispatch(getTkosGrantingAuthorityTkos(uid, params));
  }, [dispatch, uid, relation_id, params]);

  const onClickTko = (file) => {
    if (moment().isSameOrBefore(moment(file.date_end), 'day') && currentProcess?.status === 'FORMED') {
      navigate(`/tko/${file.uid}`, {
        state: { from: location, subprocess_uid: uid }
      });
    }
  };

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={currentProcess?.initiator?.username}
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_TYPE_X_OF_COMPANY')}
              disabled
              value={currentProcess?.initiator_company?.eic}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={currentProcess?.initiator_company?.usreou} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              disabled
              value={currentProcess?.initiator_company?.short_name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              disabled
              value={currentProcess?.started_at && moment(currentProcess?.started_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              disabled
              value={currentProcess?.formed_at && moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              disabled
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
        </Grid>
      </div>

      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                style={{ minWidth: column.minWidth, width: column.width }}
                className={'MuiTableCell-head'}
                key={'header' + index}
              >
                <p>{t(column.title)}</p>
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.accounting_points?.data?.length === 0 ? (
            <NotResultRow text={t('SORRY_NOTHING_FOUND')} span={7} small />
          ) : (
            currentProcess?.accounting_points?.data?.map((file, index) => (
              <TableRow
                data-marker="table-row"
                className="body__table-row"
                key={`row-${index}`}
                hover={currentProcess?.status === 'FORMED' && moment().isSameOrBefore(moment(file.date_end), 'day')}
                onClick={() => onClickTko(file)}
              >
                <TableCell data-marker={'mp'}>{file?.eic || ''}</TableCell>
                <TableCell data-marker={'valid_to'}>
                  {file?.valid_to ? moment(file?.valid_to).format('DD.MM.yyyy • HH:mm') : ''}
                </TableCell>
                <TableCell data-marker={'region'}>{file?.region || ''}</TableCell>
                <TableCell data-marker={'city'}>{file?.city || ''}</TableCell>
                <TableCell data-marker={'grid_access_provider'}>{file?.grid_access_provider || ''}</TableCell>
                <TableCell data-marker={'customer'}>{file?.customer || ''}</TableCell>
                <TableCell data-marker={'date_end'}>
                  {file?.date_end && <TableChip label={moment(file?.date_end).format('DD.MM.yyyy')} />}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
        {...currentProcess?.accounting_points}
      />
    </>
  );
};

export default GrantingAuthorityTkoDetailsTab;
