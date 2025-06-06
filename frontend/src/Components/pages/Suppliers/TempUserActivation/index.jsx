import Page from '../../../Global/Page';
import { useEffect, useRef, useState } from 'react';
import { checkPermissions } from '../../../../util/verifyRole';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTempUserActivationList, updateTempUserActivation } from '../../../../actions/suppliersActions';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import moment from 'moment';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import SearchDate from '../../../Tables/SearchDate';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { label: 'FIELDS.REQUEST_ID', key: 'id', minWidth: 120 },
  { label: 'FIELDS.REQUEST_STATUS', key: 'activated', minWidth: 120 },
  { label: 'FIELDS.AUTOR', key: 'user_name', minWidth: 200 },
  { label: 'FIELDS.CREATION_DATE', key: 'created_at', minWidth: 120 },
  { label: 'FIELDS.COMPANY_NAME', key: 'company_name', minWidth: 400 },
  { label: 'FIELDS.USREOU', key: 'usreou', minWidth: 120 },
  { label: 'FIELDS.TAX_ID', key: 'tax_id', minWidth: 120 },
  { label: 'FIELDS.EMAIL', key: 'email', minWidth: 120 }
];

const TempUserActivation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const { activationList: data, loading } = useSelector(({ suppliers }) => suppliers);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [search, setSearch] = useState({});
  const timeout = useRef(null);

  useEffect(() => {
    if (checkPermissions('SUPPLIERS.LIST.CONTROLS.REQUESTS', 'Адміністратор АР')) {
      dispatch(getTempUserActivationList(params));
    } else {
      navigate('/suppliers');
    }
  }, [navigate, dispatch, params, relation_id]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, [key]: value });
    }, 500);
  };

  const getSearch = (key) => {
    switch (key) {
      case 'created_at':
        return (
          <SearchDate
            onSearch={(key, value) => onSearch(key, value ? moment(value).format('yyyy-MM-DD') : null)}
            column={{ id: key }}
          />
        );
      case 'activated':
        return null;
      default:
        return <input value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
    }
  };

  return (
    <Page pageName={t('LIST_OF_APPLICATIONS_FOR_USER_REGISTRATION')} backRoute={'/suppliers'} loading={loading}>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ label, key, minWidth }) => (
              <TableCell style={{ minWidth }} key={key} className={'MuiTableCell-head'}>
                <p>{t(label)}</p>
                {getSearch(key)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length === 0 ? (
            <NotResultRow span={columns.length} text={t('NO_APPLICATIONS_FOUND')} />
          ) : (
            data?.data?.map((rowData, rowIndex) => (
              <TableRow key={rowIndex} data-marker="table-row" className="body__table-row">
                <TableCell data-marker={'id'}>{rowData?.id}</TableCell>
                <TableCell data-marker={'status'} align={'center'}>
                  <Status
                    rowData={rowData}
                    handleUpdate={(uid, data) => {
                      dispatch(updateTempUserActivation(uid, data, params));
                    }}
                  />
                </TableCell>
                <TableCell data-marker={'user_name'}>{rowData?.user_data?.user_name}</TableCell>
                <TableCell data-marker={'created_at'}>
                  {rowData?.user_data?.created_at && moment(rowData?.user_data?.created_at).format('DD.MM.yyyy')}
                </TableCell>
                <TableCell data-marker={'name'}>{rowData?.user_data?.user_org?.name}</TableCell>
                <TableCell data-marker={'usreou'}>{rowData?.user_data?.user_org?.usreou}</TableCell>
                <TableCell data-marker={'tax_id'}>{rowData?.user_data?.tax_id}</TableCell>
                <TableCell data-marker={'email'}>{rowData?.user_data?.email}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination loading={loading} params={params} onPaginate={(v) => setParams({ ...params, ...v })} {...data} />
    </Page>
  );
};

export default TempUserActivation;

const Status = ({ rowData, handleUpdate }) => {
  const status = rowData?.status;
  const { t } = useTranslation();

  if (status === 'NEW') {
    return (
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
        <CircleButton
          type={'done'}
          size={'small'}
          title={t('CONTROLS.ACCEPT_APPLICATION')}
          onClick={() => handleUpdate(rowData?.uid, { status: 'ACCEPTED' })}
        />
        <CircleButton
          type={'remove'}
          size={'small'}
          title={t('CONTROLS.CANCEL_REQUEST')}
          onClick={() => handleUpdate(rowData?.uid, { status: 'REJECTED' })}
        />
      </div>
    );
  }

  return (
    <LightTooltip
      arrow
      disableTouchListener
      disableFocusListener
      title={
        <center>
          <span data-marker={'updated_by'}>
            {rowData?.updated_by && (
              <>
                {`${t('PERFOMER')}:`} {rowData?.updated_by}
                <br />
              </>
            )}
            {`${t('EXECUTION_DATE')}:`} {rowData?.updated_at && moment(rowData?.updated_at).format('DD.MM.yyyy')}
          </span>
        </center>
      }
    >
      <div
        data-marker={status}
        style={{
          width: '100%',
          backgroundColor: '#D1EDF3',
          borderRadius: 20,
          textAlign: 'center',
          padding: '5px 12px',
          fontSize: 12,
          lineHeight: '14px',
          color: status === 'ACCEPTED' ? '#539489' : '#FF0000',
          cursor: 'pointer'
        }}
      >
        {status === 'ACCEPTED' ? t('STATUSES.DONE_STATUS') : t('STATUSES.CANCELED_STATUS')}
      </div>
    </LightTooltip>
  );
};
