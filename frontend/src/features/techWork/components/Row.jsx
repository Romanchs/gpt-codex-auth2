import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import moment from 'moment';
import { useState } from 'react';
import i18n from '../../../i18n/i18n';

const Row = ({ data, handleClick }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow sx={{ ...styles.row, ...(open && styles.rowOpened) }} data-marker={'table-row'}>
        <TableCell sx={{ width: 60 }}>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={() => setOpen(!open)}
            sx={{ ...styles.icon, ...(open && styles.iconExpand) }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: 80 }} data-marker="id">
          {data?.id}
        </TableCell>
        <TableCell align={'center'} data-marker="type">
          {data?.type === 'PLANNED'
            ? i18n.t('TECH_WORKS.TYPES_LIST.PLANNED')
            : i18n.t('TECH_WORKS.TYPES_LIST.UNPLANNED')}
        </TableCell>
        <TableCell data-marker="status">{getStatus(data?.status)}</TableCell>
        <TableCell align={'center'} data-marker="start_dt">
          {data?.start_dt ? moment(data.start_dt).format('DD.MM.YYYY • HH:mm') : '— • —'}
        </TableCell>
        <TableCell align={'center'} data-marker="planned_end_dt">
          {data?.planned_end_dt ? moment(data.planned_end_dt).format('DD.MM.YYYY • HH:mm') : '— • —'}
        </TableCell>
        <TableCell align="right" sx={{ width: 60 }}>
          <CircleButton
            type={'remove'}
            size={'small'}
            title={
              data?.status === 'ACTIVE' ? i18n.t('TECH_WORKS.CONTROLS.DONE') : i18n.t('TECH_WORKS.CONTROLS.CANCEL')
            }
            onClick={() => handleClick(data)}
            disabled={data?.status !== 'ACTIVE' && data?.status !== 'PLANNED'}
            dataMarker={data?.status === 'ACTIVE' ? 'done' : 'cancel'}
          />
        </TableCell>
      </TableRow>
      <TableRow sx={styles.detail} data-marker={'table-row--detail'}>
        <TableCell sx={{ pb: 1, pt: 0, pl: 0, pr: 0, border: 'none' }} colSpan={7}>
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box margin={1} sx={styles.detailContainer}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow sx={styles.head}>
                    <TableCell sx={{ width: 70 }} align={'center'} data-marker={'head--status'}>
                      {i18n.t('TECH_WORKS.TABLE.STATUS')}
                    </TableCell>
                    <TableCell data-marker={'head--name'}>{i18n.t('TECH_WORKS.TABLE.TODOLIST')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.todolist?.map((t, index) => {
                    const status =
                      data?.status === 'PLANNED' || data?.status === 'ACTIVE'
                        ? 'loading'
                        : t.is_completed
                        ? 'done'
                        : 'close';
                    return (
                      <TableRow data-marker={'body--row'} key={`body-row-${t.id}-${index}`} sx={styles.body}>
                        <TableCell align={'center'} data-marker={'body--status_' + index} data-status={status}>
                          {status === 'loading' ? (
                            <AutorenewRounded sx={{ fontSize: 24, fill: '#F28C60' }} />
                          ) : status === 'done' ? (
                            <CheckRounded sx={{ fontSize: 24, fill: '#008C0C' }} />
                          ) : (
                            <CloseRounded sx={{ fontSize: 24, fill: '#FF0000' }} />
                          )}
                        </TableCell>
                        <TableCell data-marker={'body--name_' + index}>{t.name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

const statusesList = {
  PLANNED: {
    text: i18n.t('TECH_WORKS.STATUSES.PLANNED'),
    color: '#F28C60'
  },
  ACTIVE: {
    text: i18n.t('TECH_WORKS.STATUSES.ACTIVE'),
    color: '#223B82'
  },
  CANCELED: {
    text: i18n.t('TECH_WORKS.STATUSES.CANCELED'),
    color: '#FF0000'
  },
  COMPLETED: {
    text: i18n.t('TECH_WORKS.STATUSES.COMPLETED'),
    color: '#008C0C'
  },
  PARTIALLY_COMPLETED: {
    text: i18n.t('TECH_WORKS.STATUSES.PARTIALLY_COMPLETED'),
    color: '#567691'
  }
};

const getStatus = (value) => (
  <Box
    sx={{
      width: '200px',
      height: '24px',
      lineHeight: '24px',
      borderRadius: '16px',
      color: '#FFFFFF',
      textTransform: 'uppercase',
      textAlign: 'center',
      backgroundColor: statusesList[value]?.color || '#000000'
    }}
  >
    {statusesList[value]?.text}
  </Box>
);

const styles = {
  row: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      p: '12px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-of-type': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3',
        paddingLeft: '16px'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rowOpened: {
    borderRadius: '10px 10px 0 0',
    '& > *': {
      backgroundColor: '#D1EDF3',
      '&:first-of-type': {
        borderRadius: '10px 0 0 0'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0'
      }
    }
  },
  icon: {
    p: '0.7px',
    border: '1px solid #223B82',
    backgroundColor: '#FFFFFF',
    '& svg': {
      color: '#223B82'
    }
  },
  iconExpand: {
    borderColor: '#F28C60',
    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },

  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    m: 0,
    position: 'relative',
    p: '8px 15px 0',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  head: {
    '&>.MuiTableCell-head': {
      color: '#567691',
      fontSize: 12,
      fontWeight: 700,
      p: '8px 1px 16px !important',
      borderBottom: '1px solid #4A5B7A !important'
    },
    '&>.MuiTableCell-head:last-child': {
      pl: '60px !important'
    }
  },
  body: {
    '&>.MuiTableCell-body': {
      color: '#567691',
      fontSize: 12,
      fontWeight: 400,
      p: '12px',
      borderBottom: '1px solid #D1EDF3'
    },
    '&>.MuiTableCell-body:last-child': {
      pl: '60px !important'
    },
    '&:last-child>.MuiTableCell-body': {
      border: 'none'
    }
  }
};
