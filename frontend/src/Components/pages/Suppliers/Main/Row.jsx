import { Checkbox, makeStyles, Table } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import InfoIcon from '@mui/icons-material/Info';
import RestoreRounded from '@mui/icons-material/RestoreRounded';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { handleSelect } from '../../../../actions/suppliersActions';
import { checkPermissions } from '../../../../util/verifyRole';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import Status from './Status';
import { useTranslation } from 'react-i18next';
import { CAUSES, CAUSES_EXIT, DEPT_TYPES } from './models';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';

const Row = ({
  status,
  usreou,
  eic,
  full_name,
  uid,
  default_info = [],
  pre_default_info = [],
  selected = false,
  can_select = true,
  have_history = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useRowStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        {checkPermissions('SUPPLIERS.LIST.CONTROLS.CHANGE_STATUS', ['АР', 'АКО_Користувачі']) && (
          <TableCell data-marker={'checkbox-cell'}>
            <Checkbox
              data-marker={'checkbox'}
              checked={selected}
              onChange={() => dispatch(handleSelect({ uid, status, full_name, usreou }))}
              color={'secondary'}
              disabled={!can_select}
            />
          </TableCell>
        )}
        <TableCell data-marker={'status'}>
          <Status status={status} />
        </TableCell>
        <TableCell data-marker={'usreou'}>{usreou}</TableCell>
        <TableCell data-marker={'eic'}>{eic}</TableCell>
        <TableCell data-marker={'full_name'}>{full_name}</TableCell>
        <TableCell align={'right'} style={{ padding: '10px 16px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={classes.expand}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${uid}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              {pre_default_info?.length === 0 && default_info?.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    margin: 12
                  }}
                >
                  {t('SUPPLIERS.SUPPLIER_HAS_NO_STATUSES')}
                </div>
              )}
              {pre_default_info?.length > 0 && (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow className={classes.head}>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_ENTRY_INTO_PRE_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_ENTRY_INTO_PRE_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.TYPE_OF_DEBT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.PLANNED_DATE_ENTRY_INTO_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_EXIT_FROM_PRE_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_EXIT_FROM_PRE_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_SET_STATUS')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pre_default_info.map((data, index) => (
                      <TableRow key={'cell' + index} className={classes.body}>
                        <TableCell data-marker={'datetime_entry'}>
                          {data?.datetime_entry ? moment(data?.datetime_entry).format('DD.MM.YYYY') : '---'}
                        </TableCell>
                        <TableCell data-marker={'cause_entry'}>
                          {data?.cause_entry ? t(CAUSES[data.cause_entry]) : '---'}
                        </TableCell>
                        <TableCell data-marker={'debt_type'}>
                          {data?.debt_type ? t(DEPT_TYPES[data.debt_type]) : '---'}
                        </TableCell>
                        <TableCell data-marker={'planned_default_entry_datetime'}>
                          {data?.planned_default_entry_datetime
                            ? moment(data?.planned_default_entry_datetime).format('DD.MM.YYYY')
                            : '---'}
                        </TableCell>
                        <TableCell data-marker={'datetime_exit'}>
                          {data?.datetime_exit ? moment(data?.datetime_exit).format('DD.MM.YYYY') : '---'}
                        </TableCell>
                        <TableCell data-marker={'cause_exit'}>
                          {data?.cause_exit ? t(CAUSES_EXIT[data.cause_exit]) : '---'}
                        </TableCell>
                        <TableCell data-marker={'updated_by'}>{data?.updated_by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {default_info?.length > 0 && (
                <Table size="small" aria-label="purchases" style={{ marginTop: 24 }}>
                  <TableHead>
                    <TableRow className={classes.head}>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_ENTRY_INTO_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_MOVE_INTO_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_EXIT_FROM_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_EXIT_FROM_DEFAULT')}</TableCell>
                      <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_SET_STATUS')}</TableCell>
                      <TableCell style={{ width: 20 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {default_info.map((data, index) => (
                      <TableRow key={'cell_def_' + index} className={classes.body}>
                        <TableCell>
                          {data?.datetime_entry ? moment(data?.datetime_entry).format('DD.MM.YYYY') : '---'}
                        </TableCell>
                        <TableCell>{data?.cause_entry ? t(CAUSES[data.cause_entry]) : '---'}</TableCell>
                        <TableCell>
                          {data?.datetime_exit ? moment(data?.datetime_exit).format('DD.MM.YYYY') : '---'}
                        </TableCell>
                        <TableCell>{data?.cause_exit ? t(CAUSES_EXIT[data.cause_exit]) : '---'}</TableCell>
                        <TableCell>{data?.updated_by}</TableCell>
                        <TableCell>
                          {data?.comment && (
                          <LightTooltip title={data?.comment} arrow disableTouchListener disableFocusListener data-marker={'tooltip'}>
                            <InfoIcon sx={{ color: '#008C0C', fontSize: 25, padding: 0 }} />
                          </LightTooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {have_history &&
                checkPermissions('SUPPLIERS.LIST.FUNCTIONS.HISTORY', ['АР (перегляд розширено)', 'АР', 'АКО_Користувачі']) && (
                  <div className={classes.controls}>
                    <GreenButton onClick={() => navigate(`/suppliers/history/${uid}`)}>
                      <RestoreRounded />
                      {t('SUPPLIERS.HISTORY')}
                    </GreenButton>
                  </div>
                )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      padding: '4px 10px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rootOpen: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: '10px 10px 0 0',
    '& > *': {
      padding: '4px 10px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  expand: {
    border: '1px solid #F28C60',

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
    backgroundColor: '#fff',
    margin: 0,
    padding: '8px 16px 16px',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '10px !important',
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 10,
      fontWeight: 400,
      padding: 10
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16
  }
});
