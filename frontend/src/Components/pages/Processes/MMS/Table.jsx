import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import clsx from 'clsx';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { downloadFileById } from '../../../../actions/massLoadActions';

import { mmsGetInfo, mmsOpenSuccessDialog, mmsSetFailureModal, mmsSetParams } from '../../../../actions/mmsActions';
import SearchDate from '../../../Tables/SearchDate';
import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

export const columns = [
  { key: 'full_name', title: 'FIELDS.USER_FULL_NAME', search: true, minWidth: 200 },
  { key: 'org_name', title: 'FIELDS.ORGANIZATION_NAME', search: true, minWidth: 200 },
  { key: 'transfer_type', title: 'FIELDS.TRANSFER_TYPE', search: true, minWidth: 150 },
  { key: 'dko_date', title: 'FIELDS.DKO_DATE', search: true, minWidth: 150 },
  { key: 'created_at', title: 'FIELDS.DOWNLOAD_DATETIME', search: true, minWidth: 150 },
  { key: 'file_name', title: 'FIELDS.FILENAME', search: true, minWidth: 200 },
  { key: 'uploaded', title: 'FIELDS.FILE_DOWNLOADED', search: true, minWidth: 150 },
  { key: 'return_codes', title: 'FIELDS.FILE_RETURN_CODES', search: false, minWidth: 100 },
  { key: 'download', title: '', search: false }
];

const transfer_types = [
  { value: 1, label: 'CONTROLS.IMPORT' },
  { value: 3, label: 'API' }
];

const uploaded_types = [
  { value: '1', label: 'CONTROLS.YES' },
  { value: '0', label: 'CONTROLS.NO' }
];

const Table = ({ params, data = [] }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const list = data?.data || [];

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(mmsSetParams({ ...params, [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const onSelectChange = (key, value) => {
    if (!value) {
      const { [key]: v, ...newState } = search;
      setSearch(newState);
      const { [key]: value, ...newParams } = params;
      dispatch(mmsSetParams(newParams));
    } else {
      onSearch(key, value);
    }
  };

  const getSearch = (key) => {
    if (key === 'created_at' || key === 'dko_date') {
      return <SearchDate onSearch={onSearch} column={{ id: key }} />;
    }
    if (key === 'transfer_type' || key === 'uploaded') {
      return (
        <TableSelect
          value={search[key] || ''}
          data={(key === 'transfer_type' ? transfer_types : uploaded_types).map((i) => ({ ...i, label: t(i.label) }))}
          id={key}
          onChange={(key, value) => onSelectChange(key, value)}
          minWidth={80}
        />
      );
    }
    return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
  };

  return (
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
        {list.length > 0 ? (
          list.map((row, index) => <Row key={index} data={row} params={params} />)
        ) : (
          <NotResultRow span={8} text={t('NO_DATA')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

export default Table;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  status: {
    flex: 1,
    fontSize: 12,
    backgroundColor: 'rgba(209, 237, 243, 0.49)',
    borderRadius: 16,
    padding: '4px 8px',
    margin: '0 2px'
  },
  success: {
    color: '#008C0C'
  },
  error: {
    color: '#FC1F1F'
  }
}));

const Row = ({ data, params }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const codes = Array.isArray(data?.return_codes) ? data.return_codes.map((i) => Object.keys(i)[0]) : [];
  const exportFileLog = useExportFileLog(['Передача ДКО в MMS']);

  const handleDownload = (event, file) => {
    event.stopPropagation();

    dispatch(downloadFileById(file.file_uid, file.file_name));
    exportFileLog();
  };

  return (
    <>
      <TableRow
        data-marker="table-row"
        className="body__table-row"
        hover
        onClick={() => {
          if (data?.status === 'DONE' && data?.zstatus === 'DONE') {
            dispatch(mmsOpenSuccessDialog(data?.transaction_id));
          }
          if (data?.status === 'FAILED' && !codes.find((i) => i === 'B99' || i === 'B98')) {
            dispatch(mmsSetFailureModal(data));
          }
          if (
            data?.status === 'NEW' ||
            data?.status === 'IN_PROGRESS' ||
            (data?.status === 'DONE' && data?.zstatus !== 'DONE')
          ) {
            dispatch(mmsGetInfo(params));
          }
        }}
      >
        {columns.map(({ key }) => {
          if (key === 'transfer_type') {
            return (
              <TableCell data-marker={key} key={'cell-' + key}>
                {t(transfer_types.find((i) => i.value === data[key])?.label)}
              </TableCell>
            );
          }
          if (key === 'created_at') {
            return (
              <TableCell data-marker={key} key={'cell-' + key}>
                {data[key] ? moment(data[key]).format('DD.MM.YYYY • HH:mm:ss') : '-'}
              </TableCell>
            );
          }
          if (key === 'uploaded') {
            return (
              <TableCell data-marker="upload" key={'cell-' + key}>
                {data?.upload ? t('CONTROLS.YES') : t('CONTROLS.NO')}
              </TableCell>
            );
          }
          if (key === 'return_codes') {
            return (
              <TableCell data-marker={key} key={'cell-' + key} align={'center'}>
                <div className={classes.root}>
                  {data?.status === 'DONE' &&
                    data?.zstatus === 'DONE' &&
                    codes.map((code) => (
                      <div className={clsx(classes.status, classes.success)} key={code}>
                        {code}
                      </div>
                    ))}
                  {data?.status === 'FAILED' &&
                    !codes.find((i) => i === 'B99' || i === 'B98') &&
                    codes?.slice(0, 4)?.map((code, index) => (
                      <div className={clsx(classes.status, classes.error)} key={code + index}>
                        {code}
                      </div>
                    ))}
                  {data?.status === 'INVALID_FILE_TYPE' && (
                    <LightTooltip title={t('IMPORT_FILE.INVALID_FILE_TYPE')} arrow disableFocusListener>
                      <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                    </LightTooltip>
                  )}
                  {data?.status === 'BAD_SIGNATURE' && (
                    <LightTooltip title={t('IMPORT_FILE.BAD_SIGNATURE')} arrow disableFocusListener>
                      <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                    </LightTooltip>
                  )}
                  {data?.status === 'NO_DATA_FILE' && (
                    <LightTooltip title={t('IMPORT_FILE.NO_DATA_FILE')} arrow disableFocusListener>
                      <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                    </LightTooltip>
                  )}
                  {data?.status === 'SIGNATURE_NOT_MATCH_PROFILE' && (
                    <LightTooltip title={t('IMPORT_FILE.SIGNATURE_NOT_MATCH_PROFILE')} arrow disableFocusListener>
                      <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                    </LightTooltip>
                  )}
                  {data?.status === 'SIGNATURE_SIZE_LIMIT' && (
                    <LightTooltip title={t('VERIFY_MSG.UNCORRECT_SIGNATURE')} arrow disableFocusListener>
                      <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                    </LightTooltip>
                  )}
                  {data?.status === 'FAILED' &&
                    (data?.status_info ? (
                      <LightTooltip title={data?.status_info} arrow disableFocusListener>
                        <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                      </LightTooltip>
                    ) : (
                      codes.find((i) => i === 'B99' || i === 'B98') && (
                        <LightTooltip title={t('IMPORT_FILE.FAILED_MMS')} arrow disableFocusListener>
                          <WarningRounded style={{ cursor: 'pointer', color: '#FF0000', fontSize: 26 }} />
                        </LightTooltip>
                      )
                    ))}
                  {(data?.status === 'NEW' ||
                    data?.status === 'IN_PROGRESS' ||
                    (data?.status === 'DONE' && data?.zstatus !== 'DONE')) && (
                    <CircleButton type={'loading'} title={t('IN_PROGRESS')} size={'small'} />
                  )}
                </div>
              </TableCell>
            );
          }
          if (key === 'download') {
            return (
              <TableCell data-marker={key} key={'cell-' + key} align={'center'}>
                <CircleButton
                  type="download"
                  size="small"
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                  disabled={!data?.file_uid}
                  onClick={(event) => handleDownload(event, data)}
                />
              </TableCell>
            );
          }
          return (
            <TableCell data-marker={key} key={'cell-' + key}>
              {data[key] || '-'}
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
};
