import { TableBody, TableCell, TableRow } from '@mui/material';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { useUpdateApsHistoryQuery } from '../api';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

export const FilesTabDko = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { currentData, refetch } = useUpdateApsHistoryQuery(uid, { skip: !uid });
  const exportFileLog = useExportFileLog();
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const onDownload = (file) => {
    downloadFile({ id: file.file_id, name: file.file_name });
    if (uid) exportFileLog(uid);
  };

  const renderCell = (column, file) => {
    switch (column.key) {
      case 'created_at':
        return file[column.key] ? moment(file[column.key]).format('DD.MM.yyyy • HH:mm') : '-';
      case 'period_from':
      case 'period_to':
        return file[column.key] ? moment(file[column.key]).format('DD.MM.yyyy') : '-';
      case 'is_uploaded':
        return file[column.key] ? t('CONTROLS.YES') : t('CONTROLS.NO');
      case 'status':
        if (file?.status === 'FAILED' || file?.status === 'BAD_FILE_STRUCTURE') {
          return (
            <LightTooltip
              title={
                file?.status === 'BAD_FILE_STRUCTURE'
                  ? file?.description || t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                  : t('FILE_PROCESSING_STATUSES.FAILED')
              }
              arrow
              disableTouchListener
              disableFocusListener
            >
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
        } else if (file?.file_name && (file?.status === 'IN_PROCESS' || file?.status === 'NEW')) {
          return (
            <CircleButton type={'loading'} size={'small'} onClick={refetch} title={`${t('FILE_PROCESSING')}...`} />
          );
        } else if (file?.file_id || (file?.file_processed_id && file?.status === 'DONE')) {
          return (
            <CircleButton
              type={'download'}
              size={'small'}
              onClick={() => onDownload(file)}
              title={t('DOWNLOAD_RESULT')}
            />
          );
        }
        break;
      default:
        return file[column.key] || '-';
    }
  };

  const columns = [
    { key: 'created_by', label: 'FIELDS.USER_FULL_NAME', minWidth: 150 },
    { key: 'short_company_name', label: 'FIELDS.SHORT_NAME_OF_COMPANY', minWidth: 150 },
    { key: 'created_at', label: 'FIELDS.DOWNLOAD_DATETIME', minWidth: 150 },
    { key: 'file_name', label: 'FIELDS.FILENAME', minWidth: 150 },
    { key: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 150 },
    { key: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 150 },
    { key: 'is_uploaded', label: 'FIELDS.FILE_DOWNLOADED', minWidth: 150 },
    { key: 'status', label: 'FIELDS.FILE_RETURN_CODES', minWidth: 150 }
  ];

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key} style={{ minWidth: column.minWidth }} className="MuiTableCell-head">
              {t(column.label)}
            </TableCell>
          ))}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {!currentData.mdr_files || currentData.mdr_files.length === 0 ? (
          <NotResultRow text={t('FILES_ARE_MISSING')} span={columns.length} small />
        ) : (
          currentData.mdr_files.map((file, index) => (
            <TableRow key={`row-${index}`} className="body__table-row" data-marker={'table-row'}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={(column.key === 'status' && 'center') || ''}
                  data-marker={column.key}
                >
                  {renderCell(column, file)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};
