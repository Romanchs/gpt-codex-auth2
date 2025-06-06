import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { mainApi } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import { defaultParams, setParams } from '../../slice';

const Row = ({ data, columns, innerColumns }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const cellSx = { ...styles.cell, ...(open && styles.cellHighlight) };
  const allCells = columns.length + 2;
  const halfCells = Math.floor(allCells / 2);
  const checks = Object.entries(data.checks)
    .map((b) => b[1].map((i) => [[b[0], Object.values(i)[0]]]))
    .flat(2);

  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZ.useQueryState();

  const getData = (id, value) => {
    if (id === 'mga_eic') {
      value = value.join(', ');
      return (
        <LightTooltip
          arrow
          PopperProps={{
            sx: styles.tooltipPopper
          }}
          title={
            <Box component="p" sx={styles.eicTooltipe}>
              {value}
            </Box>
          }
        >
          <Box component="p" sx={styles.eicText} >
            {value}
          </Box>
        </LightTooltip>
      );
    }
    if (id === 'ap_group') {
      return value
        ? settings?.fields?.find((i) => i.key === 'group')?.values?.find((i) => i.value === value)?.label
        : value;
    }
    if (id === 'finished_at') return value && moment(value).format('DD.MM.yyyy • HH:mm');
    if (id === 'source') {
      return value
        ? settings?.fields?.find((i) => i.key === 'source')?.values?.find((i) => i.value === value)?.label
        : value;
    }
    return value;
  };

  const handleToDetails = (uid) => () => {
    navigate('details/' + uid);
    dispatch(setParams(defaultParams));
  };

  return (
    <>
      <TableRow sx={{ ...styles.row, ...(open && styles.rowOpened) }} data-marker={'table-row'}>
        <TableCell sx={cellSx}>
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
        {columns.map(({ id, sx }) => (
          <TableCell key={id + data.uid} sx={{ ...cellSx, ...sx }} data-marker={id}>
            {getData(id, data[id])}
          </TableCell>
        ))}
        <TableCell sx={cellSx} align={'center'} data-marker={'cell-link'}>
          <CircleButton
            type={'link'}
            size={'small'}
            title={t('PAGES.MONITORING_DKO__DETAILS')}
            onClick={handleToDetails(data.uid)}
          />
        </TableCell>
      </TableRow>
      <TableRow sx={styles.detailRow} data-marker={'table-row--detail'}>
        <TableCell sx={styles.detailCell} colSpan={allCells}>
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box sx={styles.detailBox}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow>
                    {innerColumns.map(({ label, id }) => (
                      <TableCell
                        key={`head-cell-${id}-${data.uid}`}
                        sx={{ ...styles.innerCell, fontWeight: 700 }}
                        data-marker={'head--' + id}
                        colSpan={halfCells}
                      >
                        {t(label)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checks.map((item, index) => (
                    <TableRow key={`inner-row-${index}-${data.uid}`} sx={styles.body}>
                      <TableCell data-marker={`body--checks-${index}`} sx={styles.innerCell} colSpan={halfCells}>
                        {item[1]}
                      </TableCell>
                      <TableCell
                        data-marker={`body--block_of_checks-${index}`}
                        sx={styles.innerCell}
                        colSpan={halfCells}
                      >
                        {item[0]}
                      </TableCell>
                    </TableRow>
                  ))}
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

const styles = {
  eicTooltipe: {
    fontWeight: 400,
    color: '#567691',
    textAlign: 'center',
    p: 1
  },
  eicText: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontSize: 12,
    color: 'blue.main'
  },
  row: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10
  },
  rowOpened: {
    borderRadius: '10px 10px 0 0'
  },
  cell: {
    p: '12px',
    borderBottom: '1px solid #D1EDF3',
    borderTop: '1px solid #D1EDF3',
    bgcolor: 'blue.contrastText',
    fontSize: 12,
    color: '#567691',
    '&:first-of-type': {
      borderRadius: '10px 0 0 10px',
      borderLeft: '1px solid #D1EDF3',
      paddingLeft: '16px'
    },
    '&:last-child': {
      borderRadius: '0 10px 10px 0',
      borderRight: '1px solid #D1EDF3'
    },
    '&:nth-of-type(10n+4)': {
      fontWeight: 500
    }
  },
  cellHighlight: {
    bgcolor: '#D1EDF3',
    '&:first-of-type': {
      borderRadius: '10px 0 0 0',
      borderLeft: '1px solid #D1EDF3',
      paddingLeft: '16px'
    },
    '&:last-child': {
      borderRadius: '0 10px 0 0',
      borderRight: '1px solid #D1EDF3'
    }
  },
  icon: {
    p: '0.7px',
    border: '1px solid #223B82',
    bgcolor: 'blue.contrastText',
    '& svg': {
      color: 'blue.main'
    }
  },
  iconExpand: {
    borderColor: '#F28C60',
    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },

  detailRow: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailCell: {
    pb: 1,
    pt: 0,
    pl: 0,
    pr: 0,
    border: 'none'
  },
  detailBox: {
    pl: 2,
    pr: 2,
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    bgcolor: 'blue.contrastText'
  },
  body: {
    '&:last-child>.MuiTableCell-body': {
      border: 'none !important'
    }
  },
  innerCell: {
    width: '50%',
    color: '#567691',
    fontSize: 12,
    p: '16px 0 !important',
    borderBottom: '1px solid #4A5B7A !important'
  },
  tooltipPopper: {
    '&[data-popper-reference-hidden]': {
      visibility: 'hidden',
      pointerEvents: 'none'
    }
  }
};
