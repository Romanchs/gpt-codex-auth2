import { useRowStyles } from '../../pm/filterStyles';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import TableRow from '@mui/material/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import moment from 'moment';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import { METER_READING_LOG_TAGS } from '../../../services/actionsLog/constants';

const UploadsTableRow = ({ data }) => {
  const classes = useRowStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [onDownload] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(METER_READING_LOG_TAGS);

  const handleDownload = () => {
    onDownload({ id: data?.file_id, name: data?.file_original_name });
    exportFileLog();
  };

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={() => setOpen(!open)}
            sx={{
              ml: 0.25,
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
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
        <TableCell align={'center'} data-marker={'download'}>
          {data.status === 'DONE' ? (
            <CheckCircleRoundedIcon color={'success'} style={{ fontSize: 24, verticalAlign: 'bottom' }} />
          ) : (
            <WarningRoundedIcon color={'error'} style={{ fontSize: 24, verticalAlign: 'bottom' }} />
          )}
        </TableCell>
        <TableCell>
          <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD')} size={'small'} onClick={handleDownload} />
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
          colSpan={9}
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

export default UploadsTableRow;
