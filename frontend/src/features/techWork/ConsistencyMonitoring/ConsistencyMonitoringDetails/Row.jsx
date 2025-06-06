import { TableCell, TableRow, Typography } from '@mui/material';
import { accordionRowStyles, rowStyles } from '../styles';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import moment from 'moment';
import { useLazyDownloadReportQuery } from '../../api';
import { useTranslation } from 'react-i18next';

const Row = ({ data, fileName }) => {
  const [download] = useLazyDownloadReportQuery();
  const { t } = useTranslation();

  const getStatus = () => {
    const statusMap = {
      DONE: {
        text: t('TECH_WORKS.STATUSES.CHECK_SUCCESS'),
        style: accordionRowStyles.statusCellOk
      },
      IN_PROGRESS: {
        text: t('TECH_WORKS.STATUSES.CHECK_IN_PROGRESS'),
        style: accordionRowStyles.statusCellWarning
      },
      FAILED: {
        text: `${t('TECH_WORKS.STATUSES.CHECK_FAILED')} – ${data.failures}`,
        style: accordionRowStyles.statusCellError
      }
    };

    const { text, style } = statusMap[data.status] || statusMap.DONE;

    return <Typography sx={[accordionRowStyles.statusCell, style]}>{text}</Typography>;
  };

  const handleDownload = () => {
    download({
      name: `${fileName.replaceAll(' ', '_')}.xlsx`,
      file_uid: data.file_uid
    });
  };

  return (
    <>
      <TableRow sx={rowStyles.root} data-marker={'table-row'}>
        <TableCell>{fileName.replaceAll(' ', '_')}.xlsx</TableCell>
        <TableCell>{data.finished_at ? moment(data.finished_at).format('DD.MM.YYYY') : '---'}</TableCell>
        <TableCell width={200} align="center">
          {getStatus()}
        </TableCell>
        <TableCell width={55} align="right">
          {data.status === 'FAILED' && <CircleButton size="small" type={'download'} onClick={handleDownload} />}
        </TableCell>
      </TableRow>
      <TableRow style={{ height: 8 }} />
    </>
  );
};

export default Row;
