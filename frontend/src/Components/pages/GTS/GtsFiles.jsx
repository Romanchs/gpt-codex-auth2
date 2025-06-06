import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearGts, gtsGetInfo, gtsUploadFiles } from '../../../actions/gtsActions';
import { downloadFileById } from '../../../actions/massLoadActions';
import { checkOneOfPermissions, checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import SearchDate from '../../Tables/SearchDate';
import TableSelect from '../../Tables/TableSelect';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../Theme/Components/LightTooltip';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { Pagination } from '../../Theme/Table/Pagination';
import { StyledTable } from '../../Theme/Table/StyledTable';
import DragDropFiles from '../Processes/MMS/DragDropFiles';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useImportFileLog from '../../../services/actionsLog/useImportFileLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';

export const columns = [
  { key: 'full_name', title: 'FIELDS.USER_FULL_NAME', search: true, minWidth: 200 },
  { key: 'org_name', title: 'FIELDS.ORGANIZATION_NAME', search: true, minWidth: 200 },
  { key: 'transfer_type', title: 'FIELDS.TRANSFER_TYPE', search: true, minWidth: 100 },
  { key: 'created_at', title: 'FIELDS.DOWNLOAD_DATETIME', search: true, minWidth: 100 },
  { key: 'upload_at', title: 'FIELDS.SAVE_DATETIME', search: true, minWidth: 100 },
  { key: 'period_from', title: 'FIELDS.PERIOD_FROM', search: true, minWidth: 100 },
  { key: 'period_to', title: 'FIELDS.PERIOD_TO', search: true, minWidth: 100 },
  { key: 'file_name', title: 'FIELDS.FILENAME', search: true, minWidth: 200 },
  { key: 'uploaded', title: 'FIELDS.FILE_DOWNLOADED', search: true, minWidth: 100 },
  { key: 'return_codes', title: 'FIELDS.FILE_RETURN_CODES', search: false, minWidth: 100 }
];

const transfer_types = [
  { value: 1, label: 'CONTROLS.IMPORT' },
  { value: 3, label: 'API' }
];

const uploaded_types = [
  { value: '2', label: 'CONTROLS.PARTIALLY' },
  { value: '1', label: 'CONTROLS.YES' },
  { value: '0', label: 'CONTROLS.NO' }
];

export const GTS_FILES_ACCEPT_ROLES = ['АКО', 'АКО_Довідники', 'АКО_Процеси', 'АКО_Користувачі', 'АКО_ППКО', 'АКО_Суперечки', 'ОДКО'];

const GtsFiles = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const relation_id = useSelector(({ user }) => user?.activeRoles[0]?.relation_id);
  const { loading, uploadFiles } = useSelector(({ gts }) => gts);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const [openDialog, setOpenDialog] = useState(false);

  const importFileLog = useImportFileLog();
  const searchLog = useSearchLog();
  const onPaginateLog = useViewCallbackLog();

  const getList = useCallback(() => {
    dispatch(gtsGetInfo(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (
      checkOneOfPermissions(
        [
          'GTS.TKO_LIST_VIEW.CONTROLS.UPLOAD_DKO',
          'PROCESSES.PON.REQUEST_ACTUAL_DKO.CONTROLS.UPLOAD',
          'PROCESSES.PON.REQUEST_HISTORICAL_DKO.CONTROLS.UPLOAD'
        ],
        GTS_FILES_ACCEPT_ROLES
      )
    ) {
      getList();
    } else {
      navigate('/');
    }
  }, [navigate, relation_id, params, getList]);

  useEffect(() => () => dispatch(clearGts()), [dispatch]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, [key]: value, page: 1 });
      searchLog();
    }, 1000);
  };

  const getSearch = (key) => {
    if (['created_at', 'upload_at'].includes(key)) {
      return <SearchDate onSearch={onSearch} column={{ id: key }} />;
    }
    if (key === 'period_from' || key === 'period_to') {
      return <SearchDate onSearch={onSearch} column={{ id: key }} formatDate={'yyyy-MM-DD'} />;
    }
    if (key === 'transfer_type' || key === 'uploaded') {
      return (
        <TableSelect
          value={search[key] || ''}
          data={(key === 'transfer_type' ? transfer_types : uploaded_types).map((i) => ({ ...i, label: t(i.label) }))}
          id={key}
          onChange={(key, value) => {
            if (!value) {
              const { [key]: v, ...newState } = search;
              setSearch(newState);
              const { [key]: value, ...newParams } = params;
              setParams(newParams);
            } else {
              onSearch(key, value);
            }
          }}
          minWidth={80}
        />
      );
    }
    return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    importFileLog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpload = (data) => {
    dispatch(
      gtsUploadFiles(data, () => {
        setParams({ page: 1, size: 25 });
        handleCloseDialog();
      })
    );
  };

  return (
    <Page
      pageName={t('PAGES.GTS')}
      backRoute={'/gts'}
      loading={loading}
      faqKey={'GTS__GTS_FILES'}
      acceptRoles={GTS_FILES_ACCEPT_ROLES}
      controls={
        checkPermissions('GTS.FILES.CONTROLS.UPLOAD', ['ОДКО', 'АКО_Процеси']) && (
          <CircleButton type={'upload'} onClick={handleOpenDialog} title={t('CONTROLS.IMPORT')} />
        )
      }
    >
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map(({ key, title, search, minWidth }) => (
              <TableCell style={{ minWidth, paddingBottom: search ? 16 : 20 }} key={key}>
                <p>{t(title)}</p>
                {search && getSearch(key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {uploadFiles?.data?.length > 0 ? (
            uploadFiles?.data?.map((row, index) => <Row row={row} key={'row' + index} getList={getList} />)
          ) : (
            <NotResultRow span={columns.length} text={t('NO_DATA')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...uploadFiles}
        params={params}
        elementsName={t('PAGINATION.DKO')}
        onPaginate={(p) => {
          setParams({ ...params, ...p });
          onPaginateLog();
        }}
        loading={loading}
      />
      <DragDropFiles open={openDialog} handleClose={handleCloseDialog} onUpload={handleUpload} maxSize={100} />
    </Page>
  );
};

export default GtsFiles;

const Row = ({ row, getList }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exportFileLog = useExportFileLog(GTS_LOG_TAGS);

  const handleClick = (e) => {
    if (
      !ref.current.contains(e.target) &&
      checkPermissions('GTS.FILES.FUNCTIONS.UPLOAD_RESULTS', [
        'АКО_Процеси',
        'АКО_Користувачі',
        'АКО_Довідники',
        'АКО_ППКО',
        'ОДКО'
      ])
    ) {
      row?.transaction_id && navigate(`/gts/files/${row?.transaction_id}`);
    }
  };

  const handleDownload = () => {
    dispatch(downloadFileById(row?.file_id, row?.file_name));
    exportFileLog();
  };

  return (
    <TableRow data-marker="table-row" className="body__table-row" hover onClick={handleClick}>
      <TableCell data-marker={'full_name'}>{row?.full_name}</TableCell>
      <TableCell data-marker={'org_name'}>{row?.org_name}</TableCell>
      <TableCell data-marker={'transfer_type'}>
        {t(transfer_types.find((i) => i.value === row?.transfer_type)?.label)}
      </TableCell>
      <TableCell data-marker={'created_at'}>
        {row?.created_at ? moment(row?.created_at).format('DD.MM.YYYY • HH:mm') : '-'}
      </TableCell>
	    <TableCell data-marker={'upload_at'}>
        {row?.upload_at ? moment(row?.upload_at).format('DD.MM.YYYY • HH:mm') : '-'}
      </TableCell>
      <TableCell data-marker={'period_from'}>{row?.period_from || '-'}</TableCell>
      <TableCell data-marker={'period_to'}>{row?.period_to || '-'}</TableCell>
      <TableCell data-marker={'file_name'}>{row?.file_name}</TableCell>
      <TableCell data-marker={'upload'}>{row?.status === 'PARTIALLY_DONE' ? t('CONTROLS.PARTIALLY') : row?.upload ? t('CONTROLS.YES') : t('CONTROLS.NO')}</TableCell>
      <TableCell data-marker={'return_codes'} align={'center'}>
        <span ref={ref}>
          {(row?.status === 'FAILED' || row?.status === 'SYSTEM_ERROR') && (
            <LightTooltip title={row?.status_info} arrow disableFocusListener>
              <WarningRounded
                style={{
                  cursor: 'pointer',
                  color: '#FF0000',
                  fontSize: 26,
                  marginTop: -4,
                  marginBottom: -6
                }}
              />
            </LightTooltip>
          )}
          {(row?.status === 'DONE' || row?.status === 'PARTIALLY_DONE') && row?.file_id && (
            <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD')} size={'small'} onClick={handleDownload} />
          )}
          {(row?.status === 'NEW' || row?.status === 'IN_PROGRESS') && (
            <CircleButton type={'loading'} title={t('IN_PROGRESS')} size={'small'} onClick={getList} />
          )}
        </span>
      </TableCell>
    </TableRow>
  );
};
