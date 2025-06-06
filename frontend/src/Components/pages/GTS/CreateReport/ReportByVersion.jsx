import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { Pagination } from '../../../Theme/Table/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { generalSettingsReport, gtsGetReportByVersion, gtsUpdateReportByVersion } from '../../../../actions/gtsActions';
import { REPORT_TYPE } from '../constants';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const ReportByVersion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reportByVersion, loading } = useSelector(({ gts }) => gts);

  const list = useMemo(() => reportByVersion?.tkos?.data || [], [reportByVersion]);
  const currentParams = useMemo(
    () => ({
      page: reportByVersion?.tkos?.current_page || 1,
      size: reportByVersion?.tkos?.size || 25
    }),
    [reportByVersion]
  );

  useEffect(() => {
    dispatch(generalSettingsReport(REPORT_TYPE.BY_VERSION));
  }, [dispatch]);

  const onDelete = (uid) => () => {
    dispatch(gtsUpdateReportByVersion({ exclude_tko: uid }));
  };

  const onPaginate = (params) => {
    dispatch(gtsGetReportByVersion({ ...currentParams, ...params }));
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableCell className={'MuiTableCell-head'}>ЕІС-код типу ZV</TableCell>
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
                    onClick={onDelete(uid)}
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
          {...reportByVersion.tkos}
          loading={loading}
          params={currentParams}
          onPaginate={onPaginate}
          ignoreChangeRelation
        />
      )}
    </>
  );
};

export default ReportByVersion;
