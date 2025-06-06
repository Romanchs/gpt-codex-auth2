import TableRow from '@mui/material/TableRow';
import { accordionRowStyles, consistencyAccordion } from './styles';
import { TableCell, Typography } from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import { setDetailsData } from './slice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AccordionRow = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleClick = () => {
    dispatch(setDetailsData({ group: data.group, name: data.name }));
    navigate(`/tech/consistency-monitoring/details`);
  };

  return (
    <TableRow sx={consistencyAccordion.lastTableRowStyles}>
      <TableCell sx={accordionRowStyles.nameCell}>{data.name}</TableCell>
      <TableCell width={300} align="left">
        <Typography component={'span'}>{getStatus()}</Typography>
      </TableCell>
      <TableCell width={55}>
        <IconButton sx={{ p: 0 }} onClick={handleClick}>
          <NavigateNextRoundedIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default AccordionRow;
