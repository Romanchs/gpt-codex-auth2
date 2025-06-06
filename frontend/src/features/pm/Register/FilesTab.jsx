import { Chip, TableBody, TableCell, TableRow } from '@material-ui/core';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import WarningRounded from '@mui/icons-material/WarningRounded';
import TableSelect from '../../../Components/Tables/TableSelect';
import SearchDate from '../../../Components/Tables/SearchDate';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { downloadFileById } from '../../../actions/massLoadActions';
import { useDispatch } from 'react-redux';
import { useGetFilesPMQuery, useGetListPMQuery, useLazyResendToMMSPMQuery } from './api';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'upload_at', label: 'FIELDS.DOWNLOAD_DATETIME', minWidth: 180 },
  { id: 'file_name', label: 'FIELDS.FILENAME', minWidth: 150, value: 'file_name' },
  { id: 'loaded', label: 'FIELDS.FILE_DOWNLOADED', minWidth: 50 },
  { id: 'period', label: 'FIELDS.DATE', minWidth: 80 },
  { id: 'version', label: 'FIELDS.VERSION', minWidth: 110 },
  { id: 'result', label: 'FIELDS.FILE_RETURN_CODES', minWidth: 100 },
  { id: 'download', label: 'CONTROLS.DOWNLOAD', minWidth: 50 },
  { id: 'send_MMS', label: 'CONTROLS.SEND_MMS', minWidth: 120 }
];

const FilesTab = ({ params, setParams }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data, isFetching: loading, refetch } = useGetFilesPMQuery({ uid, params });
  const { data: parentProcess } = useGetListPMQuery({ uid });
  const [resendToMMSPM] = useLazyResendToMMSPMQuery();
  const exportFileLog = useExportFileLog(['Менеджер процесів']);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    if (value && (id === 'upload_at' || id === 'period' || id === 'file_name') && value.length < 3) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, [id]: value || '', page: 1 });
    }, 500);
  };

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.file_uid, file?.file_name));
    exportFileLog(uid);
  };

  const handlesendToMMSPM = (row) => {
    resendToMMSPM({ uid, file_uid: row.uid }).then(() => {
      refetch();
      dispatch(
        enqueueSnackbar({
          message: t('FIELDS.SEND_MMS'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        })
      );
    });
  };

  const resultData = (row) => {
    if (row?.status === 'NEW' || row?.status === 'IN_PROGRESS') {
      return <CircleButton type={'loading'} size={'small'} onClick={refetch} title={`${t('FILE_PROCESSING')}...`} />;
    }
    if (
      row?.status === 'NO_DATA' ||
      row?.status === 'SYSTEM_ERROR' ||
      row?.status === 'MMS_ERROR' ||
      row?.status === 'NO_MMS_RESPONSE' ||
      row?.status === 'DATA_ERROR'
    ) {
      return (
        <LightTooltip title={row?.description} arrow disableFocusListener>
          <WarningRounded
            data-marker={'error'}
            style={{
              color: '#f90000',
              fontSize: 22,
              cursor: 'pointer'
            }}
          />
        </LightTooltip>
      );
    }
    if (row?.status === 'FAILED') {
      return row?.files_status?.map((status) => (
        <Chip
          key={status}
          label={status}
          size="small"
          style={{ color: '#FC1F1F', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
        />
      ));
    }
    if (row?.status === 'DONE') {
      return row?.files_status?.map((status) => (
        <Chip
          key={status}
          label={status}
          size="small"
          style={{ color: '#008C0C', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
        />
      ));
    }
    return '-';
  };

  const getData = (id, value, row) => {
    if (id === 'upload_at') return value && moment(value).format('DD.MM.yyyy • HH:mm');
    if (id === 'period') {
      return value && moment(value).format('DD.MM.yyyy');
    }
    if (id === 'loaded') {
      return value ? t('CONTROLS.YES') : t('CONTROLS.NO');
    }
    if (id === 'result') {
      return resultData(row);
    }
    if (id === 'download') {
      return (
        <CircleButton
          size={'small'}
          type={'download'}
          title={t('CONTROLS.DOWNLOAD')}
          onClick={() => handleDownload(row)}
          disabled={!row?.file_uid}
        />
      );
    }
    if (id === 'send_MMS') {
      return (
        <CircleButton
          size={'small'}
          type={'send'}
          title={t('CONTROLS.SEND_MMS')}
          disabled={
            row?.files_status?.[0] === 'A01' ||
            row?.status === 'IN_PROGRESS' ||
            !row?.file_uid ||
            !parentProcess?.finished_at ||
            row?.version > 0
          }
          onClick={() => handlesendToMMSPM(row)}
        />
      );
    }
    return value || '-';
  };

  const getSearchField = (id) => {
    switch (id) {
      case 'result':
      case 'download':
      case 'send_MMS':
      case 'version':
        return null;
      case 'loaded':
        return (
          <TableSelect
            value={search[id] || ''}
            data={[
              { label: t('CONTROLS.YES'), value: '1' },
              { label: t('CONTROLS.NO'), value: '0' }
            ]}
            id={'loaded'}
            minWidth={80}
            onChange={onSearch}
          />
        );
      case 'period':
      case 'upload_at':
        return (
          <SearchDate
            label={''}
            value={search[id] || null}
            id={id}
            onSearch={(_, value) => onSearch(id, value)}
            minWidth={80}
            formatDate={'YYYY-MM-DD'}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(label)}</p>
                {getSearchField(id)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data.data?.map((row, index) => (
              <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
                {columns.map(({ id, value }) => (
                  <TableCell data-marker={id} key={'cell' + id} align={'center'}>
                    {getData(id, value ? row[value] : row[id], row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data}
        loading={loading}
        params={params}
        onPaginate={(newParams) => setParams({ ...params, ...newParams })}
      />
    </>
  );
};

export default FilesTab;
