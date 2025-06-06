import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearPonInformingList,
  getPonById,
  getPonInformingList,
  setPonInformingListParams
} from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const PONTkoList = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, params } = useSelector(({ pon }) => pon.informingList);
  // const {ponData, ponLoading, notFound} = useSelector(({pon}) => pon);
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.INFORMING.ACCESS', [
        'АКО',
        'АКО_Процеси',
        'АКО_ППКО',
        'АКО_Користувачі',
        'АКО_Довідники',
        'СВБ'
      ])
    ) {
      dispatch(getPonById(uid));
    } else {
      navigate('/processes');
    }
    return () => {
      dispatch(clearPonInformingList());
    };
  }, [dispatch, navigate, uid, relation_id]);

  useEffect(() => {
    dispatch(getPonInformingList(uid, params));
  }, [dispatch, params, uid]);

  // const handleUpdate = () => {
  //   dispatch(getPonById(uid));
  //   dispatch(getPonInformingList(uid, params));
  // }

  const handleUpdateParams = (newParams) => {
    dispatch(setPonInformingListParams({ ...params, ...newParams }));
  };

  return (
    <Page
      pageName={t('PAGES.PON_TKO_LIST')}
      backRoute={`/processes/pon/${uid}`}
      loading={loading}
      // notFoundMessage={notFound && 'Заявка не знайдена'}
      // controls={<CircleButton type={'refresh'} title={'Оновити заявку'} onClick={handleUpdate}/>}
    >
      {/*<Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE']} currentStatus={ponData?.status?.startsWith('CANCELED') ? 'DONE' : ponData?.status}/>*/}
      {/*<Typography variant={'h3'} color={'textPrimary'} style={{marginTop: 18, marginBottom: 8}}>*/}
      {/*  Перелік ТКО, за якими сформована заявка :*/}
      {/*</Typography>*/}
      <PONTkoTable
        {...data}
        handleSetParams={handleUpdateParams}
        handleClick={(row_uid) => navigate(`/processes/pon/informing/${uid}/tko/${row_uid}`)}
      />
      <Pagination {...data} loading={loading} params={params} onPaginate={handleUpdateParams} />
    </Page>
  );
};

export default PONTkoList;

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 150 },
  { id: 'customer', label: 'CHARACTERISTICS.CODE_OWNER_AP', minWidth: 200 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 }
];

const PONTkoTable = ({ data = [], handleClick, handleSetParams }) => {
  const { t } = useTranslation();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState({ page: 1 });

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        handleSetParams({ ...search, [key]: value });
      }, 1000)
    );
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id} className={'MuiTableCell-head'} style={{ minWidth: column.minWidth }}>
              <p>{t(column.label)}</p>
              <input
                type="text"
                value={search[column.id] || ''}
                onChange={({ target: { value } }) => onSearch(column.id, value)}
              />
            </TableCell>
          ))}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data.length < 1 ? (
          <NotResultRow span={5} text={t('NO_POINTS_FOUND')} />
        ) : (
          data.map((row) => <Row key={row.uid} data={row} handleClick={() => handleClick(row?.uid)} />)
        )}
      </TableBody>
    </StyledTable>
  );
};

const Row = ({ data }) => {
  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align} data-marker={column.id}>
            {data[column.id]}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};
