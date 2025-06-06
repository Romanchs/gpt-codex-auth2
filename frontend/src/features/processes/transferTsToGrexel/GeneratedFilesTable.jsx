import React from 'react';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import moment from 'moment';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import WarningRounded from '@mui/icons-material/WarningRounded';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

export const GeneratedFilesTable = ({ files, periodFrom, periodTo, version, refetch }) => {
  const { t } = useTranslation();
  const [download] = useLazyMsFilesDownloadQuery();

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          <TableCell className={'MuiTableCell-head'}>{t('FIELDS.FORMED_DATE_TIME')}</TableCell>
          <TableCell className={'MuiTableCell-head'}>{t('FIELDS.PERIOD')}</TableCell>
          <TableCell className={'MuiTableCell-head'}>{t('FIELDS.VERSION')}</TableCell>
          <TableCell className={'MuiTableCell-head'}></TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {files?.map((file) => (
          <TableRow data-marker={'table-row'} className={'body__table-row'} key={file.uid}>
            <TableCell data-marker={'created_at'}>
              {file.created_at ? moment(file.created_at).format('DD.MM.yyyy • HH:mm') : ''}
            </TableCell>
            <TableCell data-marker={'period'}>
              {moment(periodFrom).format('DD.MM.YYYY')} - {moment(periodTo).format('DD.MM.YYYY')}
            </TableCell>
            <TableCell data-marker={'version'}>{version || ''}</TableCell>
            <TableCell data-marker={'download-cell'} align="right" sx={{ position: 'relative', width: 80 }}>
              {file?.status === 'BAD_FILE_STRUCTURE' ? (
                <LightTooltip
                  title={file?.description || t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')}
                  arrow
                  disableTouchListener
                  disableFocusListener
                >
                  <WarningRounded
                    sx={{
                      color: '#f90000',
                      fontSize: 22,
                      cursor: 'pointer',
                      my: -0.5
                    }}
                  />
                </LightTooltip>
              ) : (
                <CircleButton
                  type={file.status === 'IN_PROCESS' || file.status === 'NEW' ? 'loading' : 'download'}
                  size={'small'}
                  onClick={() =>
                    file.status === 'DONE' || file.status === 'FAILED'
                      ? download({ id: file.file_processed_id, name: file.file_name })
                      : refetch()
                  }
                  title={
                    file.status === 'DONE' || file.status === 'FAILED'
                      ? t('DOWNLOAD_RESULT')
                      : `${t('FILE_PROCESSING')}...`
                  }
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};
