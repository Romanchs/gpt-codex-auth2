import React, { useState } from 'react';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { TableBody, TableCell, TableRow } from '@mui/material';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { downloadFileById } from '../../../actions/massLoadActions';
import { useUploadDkoFileMutation, useUploadZVforAKOQuery } from './api';
import moment from 'moment';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import UploadDkoFileButton from './UploadDkoFileButton';
import { useDispatch } from 'react-redux';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import { UPLOAD_ZV_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'full_name', label: i18n.t('FIELDS.USER_FULL_NAME'), minWidth: 150 },
  { id: 'created_at', label: i18n.t('FIELDS.DOWNLOAD_DATETIME'), minWidth: 180 },
  { id: 'file_name', label: i18n.t('FIELDS.FILENAME'), minWidth: 150 },
  { id: 'version', label: i18n.t('FIELDS.VERSION'), minWidth: 110 },
  { id: 'start_period', label: i18n.t('FIELDS.PERIOD_FROM'), minWidth: 80 },
  { id: 'end_period', label: i18n.t('FIELDS.PERIOD_TO'), minWidth: 80 },
  { id: 'status', label: i18n.t('FIELDS.FILE_RETURN_CODES'), minWidth: 100 }
];

const UploadZV = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data, isFetching: loading, refetch } = useUploadZVforAKOQuery(params);
  const uploading = useUploadDkoFileMutation({ fixedCacheKey: 'uploadFiles' });
  const exportFileLog = useExportFileLog(UPLOAD_ZV_LOG_TAGS);
  const onPaginateLog = useViewCallbackLog();

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.result_uid, file?.file_name));
    exportFileLog();
  };

  const getStatusCell = (row) => (
    <TableCell data-marker={'status'} style={{ position: 'relative' }} align={'center'}>
      {row.status_info ? (
        <LightTooltip title={row.status_info} arrow disableTouchListener disableFocusListener>
          <WarningRounded
            data-marker={'error'}
            style={{
              color: '#f90000',
              fontSize: 22,
              cursor: 'pointer'
            }}
          />
        </LightTooltip>
      ) : (
        <CircleButton
          type={row.result_uid && row.status != 'IN_PROGRESS' ? 'download' : 'loading'}
          size={'small'}
          onClick={() => (row.result_uid && row.status != 'IN_PROGRESS' ? handleDownload(row) : refetch())}
          title={row.result_uid && row.status != 'IN_PROGRESS' ? t('CONTROLS.DOWNLOAD') : `${t('FILE_PROCESSING')}...`}
        />
      )}
    </TableCell>
  );

  const getData = (id, value, row) => {
    if (id === 'created_at') {
      return (
        <TableCell data-marker={id} key={'cell' + id}>
          {value && moment(value).format('DD.MM.yyyy • HH:mm')}
        </TableCell>
      );
    }
    if (id === 'status') {
      return getStatusCell(row);
    }
    return (
      <TableCell data-marker={id} key={'cell' + id}>
        {value || '-'}
      </TableCell>
    );
  };

  const onPaginate = (v) => {
    setParams({ ...params, ...v });
    onPaginateLog();
  };

  return (
    <Page
      pageName={t('PAGES.UPLOAD_ZV')}
      backRoute={'/processes/mms'}
      acceptPermisions={'PROCESSES.MMS.CONTROLS.UPLOAD_ZV'}
      acceptRoles={['АКО_Процеси']}
      loading={loading || uploading[1].isLoading}
      controls={<UploadDkoFileButton />}
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell key={id} style={{ minWidth }} className={'MuiTableCell-head'}>
                <p>{label}</p>
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data?.data?.map((row, index) => (
              <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
                {columns.map(({ id, value }) => getData(id, value ? row[value] : row[id], row))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={7} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} params={params} onPaginate={onPaginate} />
    </Page>
  );
};

export default UploadZV;
