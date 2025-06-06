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
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import moment from 'moment';
import { useState } from 'react';
import { useRowStyles } from '../filterStyles';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import { useUpdateBlockedSendingDkoMutation } from './api';
import { ZV_TYPES } from './BlockedSendingDkoTab';
import { Typography } from '@mui/material';

const Row = ({ data, columns, innerColumns, isSelect, handleSelect }) => {
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [update] = useUpdateBlockedSendingDkoMutation({ fixedCacheKey: 'BlockedSendingDko_update' });
  const { t } = useTranslation();

  const getData = (id) => {
    if ((id === 'period_from' || id === 'period_to') && data[id]) {
      return moment(data[id]).format('DD.MM.yyyy');
    }
    if (id === 'zv_type') {
      return t(ZV_TYPES?.find((t) => t.value === data[id])?.label);
    }
    if (id === 'locked') {
      return data[id] ? t('CONTROLS.NO') : t('CONTROLS.YES');
    }
    return data[id];
  };

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell>
          <IconButton
            aria-label={'select row'}
            size={'small'}
            onClick={() => handleSelect(data.zv_eic)}
            sx={{ my: -1 }}
            className={`${open ? classes.expand : classes.collapse} ${classes.selectIcon}`}
            data-marker={isSelect ? 'selected' : 'not-selected'}
          >
            {isSelect ? <CheckCircleOutlineRounded /> : <RadioButtonUncheckedRounded />}
          </IconButton>
        </TableCell>
        {columns.map(({ id }, index) => (
          <TableCell key={'cell-' + index} data-marker={id} sx={{ color: '#4a5b7a', fontSize: 12 }}>
            {getData(id)}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={() => setOpen(!open)}
            className={open ? classes.expand : classes.collapse}
            sx={{ p: '3px', border: `1px solid ${open ? '#F28C60' : '#223B82'}`, my: -1 }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={'table-row--detail'}>
        <TableCell sx={{ pb: 1, pt: 0, pl: 0, pr: 0, border: 'none' }} colSpan={columns.length + 2}>
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box className={classes.detailContainer} sx={{ pb: 1.5 }}>
              {data?.locks?.length > 0 ? (
                <Table size={'small'} aria-label={'purchases'}>
                  <TableHead>
                    <TableRow className={`${classes.head} ${classes.splitter}`}>
                      {innerColumns.map(({ label, id, align, width }, index) => (
                        <TableCell
                          key={'head-cell' + index}
                          style={{ width }}
                          align={align}
                          data-marker={'head--' + id}
                        >
                          <Box component={'pre'} sx={{ font: 'inherit', m: 0, fontSize: 12 }}>
                            {label}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.locks?.map((l) => (
                      <TableRow key={l.uid} className={`${classes.body} ${classes.innerTableRow}`}>
                        {innerColumns.map(
                          ({ id }, index) =>
                            id !== 'cancel_button' && (
                              <TableCell
                                key={'cell' + index}
                                data-marker={'body--' + id}
                                sx={{ color: '#567691', fontSize: 12 }}
                              >
                                {l[id] && moment(l[id]).format('DD.MM.YYYY')}
                              </TableCell>
                            )
                        )}
                        <TableCell
                          data-marker={'body--cancel_button'}
                          style={{ width: 70, padding: 0 }}
                          align={'center'}
                        >
                          <CircleButton
                            type={'remove'}
                            size={'small'}
                            title={t('CONTROLS.CANCEL_BLOCKIND')}
                            onClick={() => update({ type: l?.uid, method: 'DELETE' })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography align={'center'} variant={'body1'} sx={{ fontSize: 12, color: '#567691', my: 1 }}>
                  {t('NO_DATA') + '...'}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
