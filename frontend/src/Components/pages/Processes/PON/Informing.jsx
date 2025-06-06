import Grid from '@material-ui/core/Grid';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { downloadFileById } from '../../../../actions/massLoadActions';
import {
  clearPonInformingList,
  clearPonRequestTko,
  createFilesPonInforming,
  getFilesPonInforming,
  getPonInforming
} from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import DataTable from '../../../Theme/Table/DataTable';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

export const INFORMING_PON_ACCEPT_ROLES = [ 'АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники', 'СВБ'];

const Informing = ({ dispatch, loading, data, notFound, listLoading, activeRoles }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { uid } = useParams();
  const [tableData, setTableData] = useState({
    current_page: 1,
    next_page: 2,
    data: [],
    previous_page: null,
    total: 0
  });
  const [params, setParams] = useState({ page: 1, size: 25 });
  const exportFileLog = useExportFileLog(['Інформування ПОН']);
  const columns = [
    { id: 'user', label: t('FIELDS.USER_FULL_NAME'), minWidth: 150 },
    {
      id: 'created_at',
      label: t('FIELDS.DOWNLOAD_DATETIME'),
      minWidth: 200,
      renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
    },
    { id: 'filename', label: t('FIELDS.FILENAME'), minWidth: 200 },
    {
      id: 'status',
      label: t('FIELDS.FILE_RETURN_CODES'),
      minWidth: 200,
      renderBody: (status, { file, filename }) => {
        if (status === 'IN_PROCESS') {
          return (
            <CircleButton
              type={'loading'}
              size={'small'}
              onClick={() => getFiles(setTableData, params)}
              title={`${t('PROCESSING')}...`}
            />
          );
        }
        if (status === 'DONE') {
          return (
            <CircleButton
              type={'download'}
              size={'small'}
              onClick={() => {dispatch(downloadFileById(file, filename)); exportFileLog(uid)}}
              title={t('DOWNLOAD_RESULT')}
            />
          );
        }
        return (
          <WarningRounded
            data-marker={'error'}
            style={{
              color: '#f90000',
              fontSize: 22
            }}
          />
        );
      }
    }
  ];

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.INFORMING.ACCESS', INFORMING_PON_ACCEPT_ROLES)
    ) {
      dispatch(getPonInforming(uid));
    } else {
      navigate('/processes');
    }
    return () => {
      dispatch(clearPonRequestTko());
      dispatch(clearPonInformingList());
    };
  }, [dispatch, navigate, uid, activeRoles]);

  const getFiles = (callback, params) => {
    dispatch(
      getFilesPonInforming(uid, params || { page: 1, size: 25 }, (data) => {
        callback({ ...data, data: data?.data?.map((v, i) => ({ ...v, uid: v.file || i })) || [] });
      })
    );
  };

  const handleCreate = () => {
    dispatch(createFilesPonInforming(uid, () => getFiles(setTableData)));
  };

  const handleUploadTable = (params, setCurrentProcess) => {
    setParams(params);
    getFiles((data) => {
      setTableData(data);
      setCurrentProcess(data);
    }, params);
  };

  return (
    <Page
      pageName={data?.id && !loading ? t('PAGES.INFORMING_ID', {id: data?.id}) : t('PAGES.INFORMING')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__INFORMING_PON'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={loading || listLoading}
      controls={
        checkPermissions('PROCESSES.PON.INFORMING.CONTROLS.GENERATE_FILES', 'СВБ') && (
          <CircleButton type={'download'} onClick={handleCreate} title={t('CONTROLS.GENERATE_FILES')} />
        )
      }
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} lg={8}>
            <StyledInput label={t('FIELDS.SUPPLIER_LAST_RESORT_NAME')} disabled value={data?.supplier_last_resort?.full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput label={t('FIELDS.COMPANY_USREOU')} disabled value={data?.supplier_last_resort?.usreou} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput label={t('FIELDS.AP_NUMBER_MOVE_TO_PON')} disabled value={data?.tko_number_move_to_pon?.toString()} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput
              label={t('FIELDS.TERMINATION_SUPPLY_AT')}
              disabled
              value={data?.termination_supply_at && moment(data?.termination_supply_at).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.MESSAGE_DATE')}
              disabled
              value={data?.receipt_at && moment(data?.receipt_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            <StyledInput label={t('FIELDS.BALANCE_SUPPLIER')} disabled value={data?.current_supplier?.full_name} />
          </Grid>
        </Grid>
      </div>
      <DataTable
        columns={columns}
        loading={loading}
        uploadData={handleUploadTable}
        emptyResult={t('FILES_ARE_MISSING')}
        externalData={tableData}
      />
    </Page>
  );
};

const mapStateToProps = ({ pon: { requestTko, informingList }, user }) => ({
  loading: requestTko.loading,
  data: requestTko.data,
  notFound: requestTko.notFound,
  listLoading: informingList.loading,
  list: informingList.data,
  listParams: informingList.params,
  activeRoles: user.activeRoles
});

export default connect(mapStateToProps)(Informing);
