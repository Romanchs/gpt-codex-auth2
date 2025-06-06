import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import {useTranslation} from "react-i18next";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import InfoIcon from '@mui/icons-material/Info';

const SuppliersAccordion = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const { data } = useSelector(({ suppliers }) => suppliers);

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary>
          {t('SUPPLIERS.INFO_ON_PRE_DEFAULTS')}
        </AccordionSummary>
        <AccordionDetails sx={{p: 0}}>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_ENTRY_INTO_PRE_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_ENTRY_INTO_PRE_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.TYPE_OF_DEBT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_EXIT_FROM_PRE_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_EXIT_FROM_PRE_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_SET_PRE_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_REMOVED_FROM_PRE_DEFAULT')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.pre_default_info?.length > 0 ? (
                data?.pre_default_info.map((data, index) => (
                  <TableRow key={'cell' + index}>
                    <TableCell>
                      {data?.datetime_entry ? moment(data?.datetime_entry).format('DD.MM.YYYY') : '---'}
                    </TableCell>
                    <TableCell>{data?.cause_entry || '---'}</TableCell>
                    <TableCell>{data?.debt_type}</TableCell>
                    <TableCell>
                      {data?.datetime_exit ? moment(data?.datetime_exit).format('DD.MM.YYYY') : '---'}
                    </TableCell>
                    <TableCell>{data?.cause_exit || '---'}</TableCell>
                    <TableCell>{data?.entry_by || '---'}</TableCell>
                    <TableCell>{data?.exit_by || '---'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <NotResultRow text={t('SUPPLIERS.SUPPLIER_HAS_NOT_YET_PRE_DEFAULT')} small span={7} />
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>
         {t('SUPPLIERS.INFORMATION_ON_DEFAULTS')}
        </AccordionSummary>
        <AccordionDetails sx={{p: 0}}>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_ENTRY_INTO_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_ENTRY_INTO_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.DATE_OF_EXIT_FROM_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.REASON_EXIT_FROM_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_SET_DEFAULT')}</TableCell>
                <TableCell style={{ minWidth: 50 }}>{t('SUPPLIERS.USER_WHO_REMOVED_FROM_DEFAULT')}</TableCell>
                <TableCell style={{ width: 20 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.default_info?.length > 0 ? (
                data?.default_info.map((data, index) => (
                  <TableRow key={'cell_def' + index}>
                    <TableCell>
                      {data?.datetime_entry ? moment(data?.datetime_entry).format('DD.MM.YYYY') : '---'}
                    </TableCell>
                    <TableCell>{data?.cause_entry || '---'}</TableCell>
                    <TableCell>
                      {data?.datetime_exit ? moment(data?.datetime_exit).format('DD.MM.YYYY') : '---'}
                    </TableCell>
                    <TableCell>{data?.cause_exit || '---'}</TableCell>
                    <TableCell>{data?.entry_by || '---'}</TableCell>
                    <TableCell>{data?.exit_by || '---'}</TableCell>
                    <TableCell>
                      {data?.comment && (
                        <LightTooltip title={data?.comment} arrow disableTouchListener disableFocusListener data-marker={'tooltip'}>
                          <InfoIcon sx={{ color: '#008C0C', fontSize: 25, padding: 0 }} />
                        </LightTooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NotResultRow text={t('SUPPLIERS.SUPPLIER_HAS_NOT_YET_DEFAULT')} small span={6} />
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SuppliersAccordion;

const useStyles = makeStyles(() => ({
  heading: {
    fontSize: 15,
    fontWeight: 500
  }
}));
