import { makeStyles, TableBody } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import { useState } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';

import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from './data';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';
import ReasonModal from '../../../Modal/ReasonModal';
import CancelModal from '../../../Modal/CancelModal';
import { verifyRole } from '../../../../util/verifyRole';

const columns = [
  { title: 'CURRENT_SUPPLIER', minWidth: 300 },
  { title: 'FIELDS.EIC_CODE_TYPE_Z', minWidth: 100 },
  { title: 'FIELDS.ESTIMATED_DISTRIBUTION_VOLUMES', minWidth: 100 },
  { title: 'FIELDS.CONFIRMED', minWidth: 100 },
  { title: 'FIELDS.DROPPED_OUT_OF_PROCESS', minWidth: 100 },
  { title: 'FIELDS.CONNECTION_STATUS', minWidth: 100 },
  { title: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 100 },
  { title: 'FIELDS.CITY', minWidth: 100 }
];

export const TkosTable = ({ data, handleDelete, can_delete_tko }) => {
  const { t } = useTranslation();
  const [deleteTko, setDeleteTko] = useState(null);

  const handleDeleteTko = () => {
    handleDelete({ ap_uid: deleteTko?.uid });
    setDeleteTko(null);
  };

  const handleDeleteTkoWithComment = (comment) => {
    const body = { ap_uid: deleteTko?.uid, comment };
    handleDelete(body);
    setDeleteTko(null);
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ title, minWidth }, index) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={'head' + index}>
                {t(title)}
              </TableCell>
            ))}
            <TableCell style={{ minWidth: 40 }} className={'MuiTableCell-head'}></TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data.length === 0 ? (
            <NotResultRow text={t('NO_DATA')} span={9} small />
          ) : (
            data.map((tko, index) => (
              <Row
                key={`row-${index}`}
                data={tko}
                columns={[
                  'balance_supplier',
                  'eic',
                  'predicted_volumes_of_distribution',
                  'confirmed',
                  'dropped_out',
                  'connection_status',
                  'customer',
                  'city'
                ]}
                innerColumns={[
                  { label: t('FIELDS.SUPPLY_TYPE'), value: 'supply_type', minWidth: 150 },
                  { label: t('FIELDS.PAYMENT_TYPE'), value: 'payment_type', minWidth: 150 }
                ]}
                canDelete={can_delete_tko}
                setDelete={setDeleteTko}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
      {verifyRole('СВБ') && (
        <CancelModal
          text={t('CONFIRM_DELETE_AP', { eic: deleteTko?.eic })}
          open={Boolean(deleteTko)}
          onClose={() => setDeleteTko(null)}
          onSubmit={handleDeleteTko}
        />
      )}
      {verifyRole('АКО_Процеси') && (
        <ReasonModal
          text={t('CHANGE_SUPPLIER_REASON_MODAL_TITLE')}
          open={Boolean(deleteTko)}
          onClose={() => setDeleteTko(null)}
          onSubmit={handleDeleteTkoWithComment}
          applyText={'CONTROLS.APPROVE'}
          errorMessage={'VERIFY_MSG.REQUIRED_FIELD_COMMENT_MIN_10_MAX_100_SYMBOLS'}
        />
      )}
    </>
  );
};

const Row = ({ data, columns, innerColumns, canDelete, setDelete }) => {
  const { t, i18n } = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);

  const getValue = (data, key) => {
    switch (key) {
      case 'connection_status':
        return i18n.exists(CONNECTION_STATUSES[data[key]]) && t(CONNECTION_STATUSES[data[key]]);
      case 'confirmed':
      case 'dropped_out':
        return i18n.exists(`CONTROLS.${data[key]}`) ? t(`CONTROLS.${data[key]}`) : data[key];
      default:
        return data[key];
    }
  };

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        {columns.map((key, index) =>
          key === 'predicted_volumes_of_distribution' ? (
            <TableCell key={'cell-' + index} data-marker={key}>
              <LightTooltip
                arrow
                disableTouchListener
                disableFocusListener
                title={data?.predicted_volumes_label || t('CONSUMPTION_GENERATION')}
              >
                <span>{data?.predicted_volumes_of_distribution}</span>
              </LightTooltip>
            </TableCell>
          ) : key === 'dropped_out' ? (
            <TableCell key={'cell-' + index} data-marker={key} sx={{ color: 'red' }}>
              {data?.dropped_out !== 'NO' ? (
                <>
                  {data?.removed_by && data?.removed_at && data?.removed_comment ? (
                    <LightTooltip
                      arrow
                      disableTouchListener
                      disableFocusListener
                      title={
                        <>
                          <Typography component={'p'} variant={'helper'} align={'center'}>
                            {t('FIELDS.HANDLED')}: {data?.removed_by}
                          </Typography>
                          <Typography component={'p'} variant={'helper'} align={'center'}>
                            {t('FIELDS.DATE_TIME')}: {data?.removed_at}
                          </Typography>
                          <Typography component={'p'} variant={'helper'} align={'center'}>
                            {t('FIELDS.COMMENT')}: {data?.removed_comment}
                          </Typography>
                        </>
                      }
                    >
                      <span className={clsx(classes.chip)}>{t('CONTROLS.YES')}</span>
                    </LightTooltip>
                  ) : (
                    <>{data?.dropped_out}</>
                  )}
                </>
              ) : (
                t('CONTROLS.NO')
              )}
            </TableCell>
          ) : (
            <TableCell key={'cell-' + index} data-marker={key}>
              {getValue(data, key)}
            </TableCell>
          )
        )}

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={open ? classes.expand : classes.collapse}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${data?.uid}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={`${classes.head} ${classes.splitter}`}>
                    {innerColumns.map(({ label, value, minWidth }, index) => (
                      <TableCell
                        key={'head-cell' + index}
                        data-marker={'head--' + value}
                        style={{ minWidth: minWidth || 100 }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={`${classes.body} ${classes.splitter} ${classes.innerTableRow}`}>
                    {innerColumns.map(({ value }, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + value}>
                        {data[value + '_' + i18n.language]}
                      </TableCell>
                    ))}
                  </TableRow>
                  {canDelete && (
                    <TableRow className={`${classes.body} ${classes.innerTableRow}`}>
                      <TableCell data-marker={'delete-btn'} align={'right'} colSpan={columns.length + 1}>
                        {data?.dropped_out === 'NO' && (
                          <Button
                            variant={'contained'}
                            className={classes.deleteButton}
                            startIcon={<DeleteRounded />}
                            data-marker={'delete'}
                            onClick={() => setDelete(data)}
                            disabled={!canDelete}
                          >
                            {t('CONTROLS.DELETE')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const useRowStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      padding: '12px 8px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#567691',
      '&:first-child': {
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
  rootOpen: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: '10px 10px 0 0',
    // '&:hover': {
    //   backgroundColor: 'rgba(0, 0, 0, 0.04)',
    //   '& > *': {
    //     backgroundColor: '#C4E0E6',
    //     cursor: 'pointer'
    //   }
    // },
    '& > *': {
      padding: '12px 8px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#567691',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3',
        paddingLeft: '16px'
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
  collapse: {
    border: '1px solid #223B82',

    '& svg': {
      color: '#223B82',
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
    padding: '8px 15px 0',
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
      fontWeight: 700,
      padding: '8px 1px 16px !important',
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
      padding: 12,
      border: 'none'
    }
  },
  splitter: {
    borderBottom: '1px solid #567691 !important'
  },
  innerTableRow: {
    '& > td': {
      padding: '16px 1px'
    }
  },
  deleteButton: {
    width: 128,
    height: 32,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
    borderRadius: 4,
    backgroundColor: '#FF4850',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: '#ff2934',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 11
      },
      '& svg': {
        fontSize: 12
      }
    }
  },
  chip: {
    display: 'inline-block',
    minWidth: 120,
    borderRadius: 20,
    padding: '5px 12px',
    color: '#ffff',
    fontSize: 12,
    lineHeight: 1.1,
    textAlign: 'center',
    backgroundColor: '#F28C60',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      minWidth: 50,
      padding: '4px 12px',
      fontSize: 10
    }
  }
}));
