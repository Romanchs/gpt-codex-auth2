import moment from 'moment';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import WarningRounded from '@mui/icons-material/WarningRounded';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

export const Table = ({ files, handleDownload, handleUpdateList }) => {
  const { t } = useTranslation();

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
          <TableCell style={{ minWidth: 410 }} colSpan={2} className={'MuiTableCell-head'}>
            {t('FIELDS.FILE_RETURN_CODES')}
          </TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {files.length === 0 ? (
          <NotResultRow text={t('FILES_ARE_MISSING')} span={5} small />
        ) : (
          files.map((file, index) => (
            <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
              <TableCell data-marker={'created_by'}>{file?.created_by || '-'}</TableCell>
              <TableCell data-marker={'created_at'}>
                {file?.created_at ? moment(file?.created_at).format('DD.MM.yyyy • HH:mm') : '-'}
              </TableCell>
              <TableCell data-marker={'file_name'}>{file?.file_name || ''}</TableCell>
              <TableCell data-marker={file?.status === 'DONE' ? 'success' : 'failed'}>
                {(file?.status === 'DONE' || file?.status === 'FAILED' || file?.status === 'BAD_FILE_STRUCTURE') &&
                  (file?.status === 'DONE' ? (
                    <span className={'success'}>{t('SUCCESSFULLY')}</span>
                  ) : (
                    <span className={'danger'}>{t('UNSUCCESS')}</span>
                  ))}
              </TableCell>
              <TableCell data-marker={'action'} style={{ position: 'relative' }} align={'right'}>
                {file?.status === 'BAD_FILE_STRUCTURE' && (
                  <LightTooltip
                    title={file?.description || t('FILE_PROCESSING_STATUSES.FAILED')}
                    disableTouchListener
                    disableFocusListener
                    arrow
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
                {file?.file_name && file?.status !== 'BAD_FILE_STRUCTURE' && (
                  <CircleButton
                    type={file?.status === 'IN_PROCESS' || file?.status === 'NEW' ? 'loading' : 'download'}
                    size={'small'}
                    onClick={() =>
                      file?.status === 'DONE' || file?.status === 'FAILED' ? handleDownload(file) : handleUpdateList()
                    }
                    title={
                      file?.status === 'DONE' || file?.status === 'FAILED'
                        ? t('DOWNLOAD_RESULT')
                        : `${t('FILE_PROCESSING')}...`
                    }
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
