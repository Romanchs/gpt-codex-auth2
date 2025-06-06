import React from 'react';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { Chip, TableBody, TableCell, TableRow } from '@material-ui/core';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { downloadFileById } from '../../../actions/massLoadActions';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { mainApi } from '../../../app/mainApi';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import { useParams } from 'react-router-dom';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'created_at', label: i18n.t('FIELDS.FORMED_DATE_TIME') },
  { id: 'period', label: i18n.t('FIELDS.PERIOD') },
  { id: 'version', label: i18n.t('FIELDS.VERSION') },
  { id: 'subversion', label: i18n.t('FIELDS.SUBVERSION') },
  { id: 'created_by', label: i18n.t('FIELDS.USER') },
  { id: 'correction_date', label: i18n.t('FIELDS.CORRECTION_DATA'), align: 'center' }
];

const SendedFilesTable = ({ files }) => {
  const { t } = useTranslation();

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
              {label}
            </TableCell>
          ))}
          <TableCell className={'MuiTableCell-head'} style={{ width: 50 }} />
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {files?.length < 1 ? (
          <NotResultRow span={7} text={t('NO_POINTS_FOUND')} />
        ) : (
          files?.map((row) => <Row key={row.uid} data={row} />)
        )}
      </TableBody>
    </StyledTable>
  );
};

export default SendedFilesTable;

const Row = ({ data }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const exportFileLog = useExportFileLog(['Заявка на отримання звіту для ЕРП']);

  const getData = (id) => {
    if (id === 'period') {
      return `${moment(data.additional_data.start_date).format('DD.MM.YYYY')} - ${moment(
        data.additional_data.end_date
      ).format('DD.MM.YYYY')}`;
    }
    if (id === 'created_at') {
      return moment(data['created_at']).format('DD.MM.YYYY • HH:mm');
    }
    if (id === 'version' || id === 'subversion') {
      return data.additional_data[id];
    }
    if (id === 'correction_date') {
      return data.additional_data.correction_date ? (
        <LightTooltip title={data.additional_data.correction_description}>
          <Chip
            label={moment(data.additional_data.correction_date).format('DD.MM.yyyy • HH:mm')}
            size="small"
            style={{ color: '#FC1F1F', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
          />
        </LightTooltip>
      ) : (
        <Chip
          label={t('CONTROLS.NO')}
          size="small"
          style={{ color: '#008C0C', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
        />
      );
    }
    return data[id];
  };

  const getFileStatus = () => (
    <>
      {(data?.status === 'FAILED' || data?.status === 'BAD_FILE_STRUCTURE') && (
        <LightTooltip
          title={
            data?.status === 'BAD_FILE_STRUCTURE'
              ? t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
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
      {data?.file_name && data?.status !== 'FAILED' && data?.status !== 'BAD_FILE_STRUCTURE' && (
        <CircleButton
          type={data?.status === 'IN_PROCESS' || data?.status === 'NEW' ? 'loading' : 'download'}
          size={'small'}
          onClick={() =>
            data?.status === 'DONE' || data?.status === 'FAILED'
              ? handleDownload(data.file_processed_id, data.file_name)
              : handleUpdateList()
          }
          title={
            data?.status === 'DONE' || data?.status === 'FAILED' ? t('DOWNLOAD_RESULT') : `${t('FILE_PROCESSING')}...`
          }
        />
      )}
    </>
  );

  const handleUpdateList = () => {
    dispatch(mainApi.util.invalidateTags(['ERP_REPORT']));
  };

  const handleDownload = (file_id, file_name) => {
    dispatch(downloadFileById(file_id, file_name));
    if (uid) exportFileLog(uid);
  };

  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map(({ id, align }) => (
          <TableCell key={id} align={align} data-marker={id}>
            {getData(id)}
          </TableCell>
        ))}
        <TableCell align={'center'}>{getFileStatus()}</TableCell>
      </TableRow>
    </>
  );
};
