import { useRowStyles } from '../../pm/filterStyles';
import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import moment from 'moment/moment';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { useTranslation } from 'react-i18next';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from '../slice';

const ViewTableRow = ({ data }) => {
  const classes = useRowStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checked = useSelector((store) => store.meterReading.selected.includes(data.uid));
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell data-merker={'selected'} align={'center'} onClick={(e) => e.stopPropagation()}>
          <Checkbox
            sx={{ p: 0 }}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<TaskAltRoundedIcon color={'orange'} />}
            checked={checked}
            onChange={() => dispatch(setSelected(data))}
            data-marker={'checkbox'}
            data-status={checked ? 'active' : 'inactive'}
          />
        </TableCell>
        <TableCell data-marker={'company_from_eic'}>{data?.company_from?.eic}</TableCell>
        <TableCell data-marker={'company_from_short_name'}>{data?.company_from?.short_name}</TableCell>
        <TableCell data-marker={'ap_eic'}>{data?.ap_eic}</TableCell>
        <TableCell data-marker={'created_at'}>
          {data?.created_at && moment(data.created_at).format('DD.MM.yyyy • HH:mm')}
        </TableCell>
        <TableCell data-marker={'meter_reading_date'}>
          {data?.meter_reading_date && moment(data.meter_reading_date).format('DD.MM.yyyy')}
        </TableCell>
        <TableCell data-marker={'file_original_name'}>{data?.file_original_name}</TableCell>
        <TableCell>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={() => setOpen(!open)}
            sx={{
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow data-marker={'table-row--detail'}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            borderBottom: 'none'
          }}
          colSpan={8}
        >
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box className={classes.detailContainer}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow className={`${classes.head} ${classes.splitter}`}>
                    <TableCell data-marker={'head--company_to_eic'}>
                      {t('FIELDS.EIC_CODE_X_OF_THE_ADDRESSEE')}
                    </TableCell>
                    <TableCell data-marker={'head--company_to_short_name'}>
                      {t('FIELDS.RECIPIENT_COMPANY_NAME')}
                    </TableCell>
                    <TableCell data-marker={'head--balance_supplier_id'}>{t('FIELDS.BALANCE_SUPPLIER_ID')}</TableCell>
                    <TableCell data-marker={'head--balance_supplier_name'}>
                      {t('FIELDS.BALANCE_SUPPLIER_NAME')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={`${classes.body} ${classes.innerTableRow}`}>
                    <TableCell data-marker={'body--company_to_eic'}>{data?.company_to?.eic}</TableCell>
                    <TableCell data-marker={'body--company_to_short_name'}>{data?.company_to?.short_name}</TableCell>
                    <TableCell data-marker={'body--balance_supplier_id'}>{data?.balance_supplier_id}</TableCell>
                    <TableCell data-marker={'body--balance_supplier_name'}>{data?.balance_supplier_name}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ViewTableRow;
