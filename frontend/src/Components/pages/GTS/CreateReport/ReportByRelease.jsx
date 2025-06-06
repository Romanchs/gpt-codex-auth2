import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { useDispatch, useSelector } from 'react-redux';

import { generalSettingsReport, gtsGetReportByRelease, gtsUpdateReportByRelease } from '../../../../actions/gtsActions';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useEffect, useMemo } from 'react';
import { REPORT_TYPE } from '../constants';
import { Pagination } from '../../../Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const ReportByRelease = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reportByRelease, loading } = useSelector(({ gts }) => gts);

  const list = useMemo(() => reportByRelease?.tkos?.data || [], [reportByRelease]);

  const currentParams = useMemo(
    () => ({
      page: reportByRelease?.tkos?.current_page || 1,
      size: reportByRelease?.tkos?.size || 25
    }),
    [reportByRelease]
  );

  useEffect(() => {
    dispatch(generalSettingsReport(REPORT_TYPE.BY_RELEASE));
  }, [dispatch]);

  const onDelete = (uid) => {
    dispatch(gtsUpdateReportByRelease({ exclude_tko: uid }));
  };

  const onPaginate = (params) => {
    dispatch(gtsGetReportByRelease({ ...currentParams, ...params }));
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableCell className={'MuiTableCell-head'}>{t('GTS_REPORT_BY_EIC')}</TableCell>
            <TableCell className={'MuiTableCell-head'} align={'center'} style={{ width: 120 }}>
              {t('REMOVAL')}
            </TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list.length === 0 ? (
            <NotResultRow text={t('NO_AP_ADDED')} span={3} small />
          ) : (
            list.map(({ mp_id, uid, release }) => (
              <TableRow key={uid + release} data-marker="table-row" className="body__table-row">
                <TableCell data-marker={'mp_id'}>{mp_id}</TableCell>
                <TableCell align={'center'}>
                  <CircleButton
                    type={'delete'}
                    onClick={() => onDelete(uid)}
                    size={'small'}
                    title={t('CONTROLS.DELETE_AP')}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      {list.length > 0 && (
        <Pagination
          {...reportByRelease.tkos}
          loading={loading}
          params={currentParams}
          onPaginate={onPaginate}
          ignoreChangeRelation
        />
      )}
    </>
  );
};

export default ReportByRelease;
