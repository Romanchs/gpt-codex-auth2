import { useTranslation } from 'react-i18next';
import Page from '../../../../Components/Global/Page';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { TableBody, TableCell, TableRow } from '@mui/material';
import TableSelect from '../../../../Components/Tables/TableSelect';
import { columns } from './constants';
import { useEffect, useMemo, useState } from 'react';
import Row from './Row';
import { useDispatch, useSelector } from 'react-redux';
import { useReportDetailsListQuery, useReportsListQuery } from '../../api';
import { useNavigate } from 'react-router-dom';
import { clearAllData, setDetailsData } from '../slice';
import useViewCallbackLog from '../../../../services/actionsLog/useViewCallbackLog';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const QualityMonitoringDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const detailsData = useSelector((state) => state.consistencyMonitoringDetails.detailsData);
  const [search, setSearch] = useState({ name: detailsData.name });
  const [params, setParams] = useState({ page: 1, size: 25 });
  const onPaginateLog = useViewCallbackLog();
  const { data, isFetching: isReportsFetching } = useReportsListQuery();
  const { data: processesList, isFetching } = useReportDetailsListQuery(
    {
      params,
      name: detailsData.name,
      group: detailsData.group
    },
    { skip: !(detailsData.group && detailsData.name) }
  );

  const nameFilterOptions = useMemo(
    () =>
      data
        ?.find((el) => el.group === detailsData.group)
        ?.data.map((fileEl) => ({
          label: fileEl.name,
          value: fileEl.name
        })),
    [data, detailsData]
  );

  const isLoading = isReportsFetching || isFetching;

  useEffect(() => {
    if (!(detailsData.group && detailsData.name)) {
      navigate('/tech/consistency-monitoring');
    }
  }, [processesList]);

  useEffect(() => {
    return () => {
      dispatch(clearAllData());
    };
  }, [dispatch]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    if (key === 'name') {
      dispatch(setDetailsData({ ...detailsData, [key]: value }));
      return;
    }
  };
  const getSearch = (key) => {
    if (key === 'name') {
      return (
        <TableSelect
          value={search[key] || null}
          data={nameFilterOptions}
          id={key}
          withAll={false}
          onChange={onSearch}
          minWidth={80}
          maxWidth={670}
        />
      );
    }
  };

  const onPaginate = (p) => {
    setParams({ ...params, ...p });
    onPaginateLog();
  };

  return (
    <Page
      acceptPermisions={'TECH_WORK.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('PAGES.DATA_CONSISTENCY_MONITORING')}
      backRoute={'/tech/consistency-monitoring'}
      loading={isLoading}
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, width, minWidth, align }) => (
              <TableCell
                style={{ minWidth: minWidth, width: width || 'initial' }}
                className={'MuiTableCell-head'}
                key={id}
                align={align}
              >
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {processesList?.data?.length > 0 ? (
            processesList?.data?.map((rowData) => (
              <Row key={`row-${rowData?.uid}}`} data={rowData} fileName={detailsData.name} />
            ))
          ) : (
            <NotResultRow span={6} text={t('PROCESSES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...processesList}
        elementsName={t('PAGINATION.PROCESSES')}
        params={params}
        onPaginate={onPaginate}
        loading={isLoading}
      />
    </Page>
  );
};

export default QualityMonitoringDetails;
