import Page from '../../Components/Global/Page';
import { useParams } from 'react-router-dom';
import { useMeterReadingInformingQuery } from './api';
import Statuses from '../../Components/Theme/Components/Statuses';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import moment from 'moment';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import { FILE_PROCESSING_STATUSES } from '../../util/directories';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const columns = [
  { title: 'FIELDS.USER_LOGIN', key: 'created_by' },
  { title: 'FIELDS.DOWNLOAD_DATETIME', key: 'created_at' },
  { title: 'FIELDS.FILENAME', key: 'file_name' },
  { title: 'FIELDS.FILE_RETURN_CODES', key: 'status' }
];

export const INFORMING_METER_READING_TRANSFER_PPKO_ACCEPT_ROLES = ['ОЗД'];

const InformingSubProcess = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { currentData: data, isFetching } = useMeterReadingInformingQuery(uid);
  const exportFileLog = useExportFileLog(['Інформування передачі показів від ППКО']);
  const [onDownload] = useLazyMsFilesDownloadQuery();

  const handleDownload = (file) => () => {
    onDownload({ id: file?.file_id, name: file?.file_name });
    exportFileLog(uid);
  };

  return (
    <Page
      pageName={data?.id ? t('PAGES.METER_READING_ID', { id: data?.id }) : t('PROCESSES.METER_READING')}
      backRoute={'/processes'}
      acceptPermisions={'PROCESSES.METER_READING.SUBPROCESS.ACCESS'}
      acceptRoles={INFORMING_METER_READING_TRANSFER_PPKO_ACCEPT_ROLES}
      faqKey={'PROCESSES__INFORMING_METER_READING_TRANSFER_PPKO'}
      loading={isFetching}
    >
      <Statuses statuses={['NEW', 'DONE']} currentStatus={data?.status ?? 'NEW'} />
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2.5 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={data?.initiator?.username} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATE_REQUEST_DATE')}
              disabled
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.DATE_OF_REQUEST_EXECUTION')}
              disabled
              value={data?.completed_at && moment(data?.completed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_TYPE_X_OF_INITIATOR')}
              disabled
              value={data?.initiator_company?.eic}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={data?.initiator_company?.usreou} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.DATE_OF_METER_READING')}
              disabled
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.REQUEST_IS_INITIATED_FROM_THE_PROCESS')}
              disabled
              value={t('PROCESSES.METER_READING')}
            />
          </Grid>
        </Grid>
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontSize: 15,
          fontWeight: 'normal',
          color: '#0D244D',
          lineHeight: 1.2,
          pb: 2
        }}
      >
        {t('LIST_OF_DOWNLOADED_FILES_BY_REQUEST')}:
      </Typography>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ title, key }) => (
              <TableCell datamarker={'head--' + key} key={key} className={'MuiTableCell-head'}>
                {t(title)}
              </TableCell>
            ))}
            <TableCell sx={{ width: 56 }} className={'MuiTableCell-head'} />
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.files?.length === 0 && <NotResultRow text={t('FILES_ARE_MISSING')} span={columns.length} small />}
          {data?.files?.map((item, index) => (
            <TableRow key={index} className="body__table-row">
              <TableCell data-marker={'created_by'}>{item?.created_by || ''}</TableCell>
              <TableCell data-marker={'created_at'}>
                {item?.created_at ? moment(item?.created_at).format('DD.MM.yyyy • HH:mm') : ''}
              </TableCell>
              <TableCell data-marker={'file_name'}>{item?.file_name || ''}</TableCell>
              <TableCell data-marker={'status'}>
                <span style={{ color: item?.status === 'DONE' ? '#008C0C' : 'inherit' }}>
                  {item?.status && t(FILE_PROCESSING_STATUSES[item.status])}
                </span>
              </TableCell>
              <TableCell align={'center'} data-marker={'download'}>
                <CircleButton
                  type={'download'}
                  size={'small'}
                  onClick={handleDownload(item)}
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </Page>
  );
};

export default InformingSubProcess;
