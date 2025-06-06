import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import { useChangePPKOFilesQuery, useLazyChangePPKOQuery } from '../api';
import InnerDataTable from '../InnerDataTable';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const defaultColumns = [
  { id: 'created_by', label: 'FIELDS.USER_FULL_NAME', minWidth: 120 },
  { id: 'organization_name', label: 'FIELDS.ORGANIZATION', minWidth: 120 },
  {
    id: 'created_at',
    label: 'FIELDS.DOWNLOAD_DATETIME',
    minWidth: 120,
    renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
  },
  { id: 'file_name', label: 'FIELDS.FILENAME', minWidth: 120 }
];

const FilesTab = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const params = useSelector((store) => store.changePPKO.params);

  const { currentData, isFetching, refetch } = useChangePPKOFilesQuery({ uid, params }, { skip: !uid });
  const [refetchDetails] = useLazyChangePPKOQuery();
  const [downloadFile] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Заявка на зміну ППКО']);

  const handleDownload = (id, name) => {
    downloadFile({ id, name })
    exportFileLog(uid);
  }

  const columns = [
    ...defaultColumns,
    {
      id: 'result',
      label: 'FIELDS.FILE_RETURN_CODES',
      minWidth: 410,
      colSpan: 4,
      renderBody: ({
        all_tko_count = 0,
        success = 0,
        failed = 0,
        status,
        description,
        file_name,
        file_processed_id
      }) => (
        <>
          <TableCell data-marker={'all_tko_count'}>{t('IN_TOTAL')}: {all_tko_count || 0}</TableCell>
          <TableCell data-marker={'success'}>
            <Box component={'span'} className={'success'}>
              {t('FILE_PROCESSING_STATUSES.DONE')}: {success || 0}
            </Box>
          </TableCell>
          <TableCell data-marker={'failed'}>
            <Box component={'span'} className={'danger'}>
              {t('NOT_DOWNLOADED')}: {failed || 0}
            </Box>
          </TableCell>
          <TableCell style={{ position: 'relative' }} data-marker={'status'}>
            {(status === 'FAILED' || status === 'BAD_FILE_STRUCTURE') && (
              <LightTooltip
                title={
                  status === 'BAD_FILE_STRUCTURE'
                    ? description || t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                    : t('FILE_PROCESSING_STATUSES.FAILED')
                }
                arrow
                disableTouchListener
                disableFocusListener
              >
                <WarningRounded
                  data-marker={`error: ${status}`}
                  style={{ color: '#f90000', fontSize: 22, cursor: 'pointer' }}
                />
              </LightTooltip>
            )}
            {file_name && status !== 'FAILED' && status !== 'BAD_FILE_STRUCTURE' && (
              <CircleButton
                type={status === 'IN_PROCESS' || status === 'NEW' ? 'loading' : 'download'}
                size={'small'}
                onClick={
                  status === 'DONE' || status === 'FAILED'
                    ? () => handleDownload(file_processed_id, file_name)
                    : () => {
                        refetch();
                        refetchDetails({ uid, params });
                      }
                }
                title={status === 'DONE' || status === 'FAILED' ? t('DOWNLOAD_RESULT') : `${t('FILE_PROCESSING')}...`}
              />
            )}
          </TableCell>
        </>
      )
    }
  ];

  const renderRow = (row, index) => (
    <TableRow key={row?.uid} data-marker={'table-row'} className={'body__table-row'} tabIndex={index}>
      {columns.map(({ id, renderBody }, i) =>
        id === 'result' ? (
          <React.Fragment key={id + i}>{renderBody(row)}</React.Fragment>
        ) : (
          <TableCell key={id + i} data-marker={id} align={'left'}>
            {renderBody ? renderBody(row[id], row) : row[id]}
          </TableCell>
        )
      )}
    </TableRow>
  );

  return (
    <InnerDataTable
      columns={columns}
      currentData={currentData?.uploaded_files}
      loading={isFetching}
      BodyRow={renderRow}
      isPagination={false}
      emptyResult={t('FILES_NOT_FOUND')}
      ignoreI18={false}
    />
  );
};

export default FilesTab;
