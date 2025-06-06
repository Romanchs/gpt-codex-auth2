import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import moment from 'moment';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useReportGrexelInfoQuery } from './api';
import { useParams } from 'react-router-dom';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const Table = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { data, refetch } = useReportGrexelInfoQuery(uid);
  const [download] = useLazyMsFilesDownloadQuery();
  const files = data?.files || [];
  const exportFileLog = useExportFileLog(['Заявка на формування даних для Реєстру виробників (НКРЕКП)']);

  const columns = [
    { title: 'FIELDS.USER_INITIATOR', key: 'created_by' },
    { title: 'FIELDS.FORMED_AT', key: 'created_at' },
    { title: 'FIELDS.FILENAME', key: 'file_name' }
  ];

  const onDownload = (file) => {
    download({
      id: file?.file_id,
      name: file?.name
    });
    exportFileLog(uid);
  };

  return (
    <>
      <Typography variant={'h6'} color={'blue.light'} sx={{ mb: 1 }}>
        {t('GENERATED_REPORTS') + ':'}
      </Typography>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ key, title }) => (
              <TableCell key={key} className={'MuiTableCell-head'} width={'31%'}>
                {t(title)}
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'} width={'7%'}></TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {files.length === 0 && <NotResultRow text={t('FILES_ARE_MISSING')} span={columns.length + 1} small />}
          {files.map((file) => (
            <TableRow data-marker="table-row" className="body__table-row" key={file.uid}>
              {columns.map(({ key }) => (
                <TableCell key={key} data-marker={key}>
                  {key === 'created_at' ? file[key] && moment(file[key]).format('DD.MM.yyyy • HH:mm') : file[key]}
                </TableCell>
              ))}
              <TableCell align={'right'}>
                <CircleButton
                  type={file?.status === 'IN_PROCESS' || file?.status === 'NEW' ? 'loading' : 'download'}
                  size={'small'}
                  onClick={() => (file?.status === 'DONE' ? onDownload(file) : refetch())}
                  title={file?.status === 'DONE' ? t('DOWNLOAD_RESULT') : `${t('FILE_PROCESSING')}...`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};

export default Table;
