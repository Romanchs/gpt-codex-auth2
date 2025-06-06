import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { generalSettingsReport, gtsGetReportByEic, gtsUpdateReportByEic } from '../../../../actions/gtsActions';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { REPORT_TYPE } from '../constants';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const ReportByEic = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reportByEic, loading } = useSelector(({ gts }) => gts);

  const list = useMemo(() => reportByEic?.tkos?.data || [], [reportByEic]);
  const currentParams = useMemo(
    () => ({
      page: reportByEic?.tkos?.current_page || 1,
      size: reportByEic?.tkos?.size || 25
    }),
    [reportByEic]
  );

  useEffect(() => {
    dispatch(generalSettingsReport(REPORT_TYPE.BY_EIC));
  }, [dispatch]);

  const onDelete = (uid) => {
    dispatch(gtsUpdateReportByEic({ exclude_tko: uid }));
  };

  const onPaginate = (params) => {
    dispatch(gtsGetReportByEic({ ...currentParams, ...params }));
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
            <NotResultRow text={t('NO_AP_ADDED')} span={2} small />
          ) : (
            list.map(({ mp_id, uid }) => (
              <TableRow key={uid} data-marker="table-row" className="body__table-row">
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
          {...reportByEic.tkos}
          loading={loading}
          params={currentParams}
          onPaginate={onPaginate}
          ignoreChangeRelation
        />
      )}
    </>
  );
};

export default ReportByEic;
