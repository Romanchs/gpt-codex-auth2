import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';

import CircleButton from '../../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { useParams } from 'react-router-dom';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

export const UploadedFilesTable = ({ files, handleDownload, handleUpdateList, tags }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const exportFileLog = useExportFileLog(tags);
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const onDownload =
    handleDownload ||
    ((file) => {
      downloadFile({ id: file.file_id, name: file.file_name });
      if (uid) exportFileLog(uid);
    });

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          <TableCell style={{ minWidth: 130 }} className={'MuiTableCell-head'}>
            {t('FIELDS.USER_FULL_NAME')}
          </TableCell>
          <TableCell style={{ minWidth: 122 }} className={'MuiTableCell-head'}>
            {t('FIELDS.DOWNLOAD_DATETIME')}
          </TableCell>
          <TableCell style={{ minWidth: 100 }} className={'MuiTableCell-head'}>
            {t('FIELDS.FILENAME')}
          </TableCell>
          <TableCell style={{ minWidth: 410 }} colSpan={4} className={'MuiTableCell-head'}>
            {t('FIELDS.FILE_RETURN_CODES')}
          </TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {files.length === 0 ? (
          <NotResultRow text={t('FILES_ARE_MISSING')} span={7} small />
        ) : (
          files.map((file, index) => (
            <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
              <TableCell data-marker={'created_by'}>{file?.created_by || '-'}</TableCell>
              <TableCell data-marker={'created_at'}>
                {file?.created_at ? moment(file?.created_at).format('DD.MM.yyyy • HH:mm') : '-'}
              </TableCell>
              <TableCell data-marker={'file_name'}>{file?.file_name || ''}</TableCell>
              <TableCell data-marker={'all_tko_count'} style={{ width: 120 }}>
                {t('IN_TOTAL')}: {file?.all_tko_count || file?.success + file?.failed || 0}
              </TableCell>
              <TableCell data-marker={'success'} style={{ width: 200 }}>
                {!file?.is_system && (
                  <span className={'success'}>
                    {t('FILE_PROCESSING_STATUSES.DONE')}: {file?.success || 0}
                  </span>
                )}
              </TableCell>
              <TableCell data-marker={'failed'} style={{ width: 170 }}>
                {!file?.is_system && (
                  <span className={'danger'}>
                    {t('NOT_DOWNLOADED')}: {file?.failed || 0}
                  </span>
                )}
              </TableCell>
              <TableCell data-marker={'action'} style={{ position: 'relative' }} align={'center'}>
                {(file?.status === 'FAILED' || file?.status === 'BAD_FILE_STRUCTURE') && (
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
                )}
                {file?.file_name && (file?.status === 'IN_PROCESS' || file?.status === 'NEW') && (
                  <CircleButton
                    type={'loading'}
                    size={'small'}
                    onClick={handleUpdateList}
                    title={`${t('FILE_PROCESSING')}...`}
                  />
                )}
                {(file?.file_id || file?.file_processed_id) && file?.status === 'DONE' && (
                  <CircleButton
                    type={'download'}
                    size={'small'}
                    onClick={() => onDownload(file)}
                    title={t('DOWNLOAD_RESULT')}
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};
