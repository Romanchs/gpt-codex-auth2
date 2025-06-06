import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { Pagination } from '../../../Theme/Table/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { generalSettingsReport, gtsGetReportByZV, gtsUpdateReportByZV } from '../../../../actions/gtsActions';
import { REPORT_TYPE } from '../constants';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const ReportByZv = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reportByZV, loading } = useSelector(({ gts }) => gts);

  const list = useMemo(() => reportByZV?.tkos?.data || [], [reportByZV]);
  const currentParams = useMemo(
    () => ({
      page: reportByZV?.tkos?.current_page || 1,
      size: reportByZV?.tkos?.size || 25
    }),
    [reportByZV]
  );

  useEffect(() => {
    dispatch(generalSettingsReport(REPORT_TYPE.BY_ZV));
  }, [dispatch]);

  const onDelete = (uid) => () => {
    dispatch(gtsUpdateReportByZV({ exclude_tko: uid }));
  };

  const onPaginate = (params) => {
    dispatch(gtsGetReportByZV({ ...currentParams, ...params }));
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
            list.map(({ eic_zv, uid }) => (
              <TableRow key={uid} data-marker="table-row" className="body__table-row">
                <TableCell data-marker={'eic_zv'}>{eic_zv}</TableCell>
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
          {...reportByZV.tkos}
          loading={loading}
          params={currentParams}
          onPaginate={onPaginate}
          ignoreChangeRelation
        />
      )}
    </>
  );
};

export default ReportByZv;
