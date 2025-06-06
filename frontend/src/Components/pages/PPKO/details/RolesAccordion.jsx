import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import { getDate } from './utils';

export const RolesAccordion = ({ roles }) => {
  const { t } = useTranslation();

  return (
    <Accordion>
      <AccordionSummary aria-controls={`panel-roles-ppko-content`} id={`panel-roles-ppko-header`}>
        {t('ROLES_SECTION')}
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={styles.roles}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={styles.tableHeader}>
                  <TableCell colSpan={5}>{t('PPKO_ROLES')}:</TableCell>
                  <TableCell colSpan={3}>{t('METER_OPERATOR_FUNCTIONS.FUNCTIONS')}:</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell colSpan={2}>{t('VALIDITY_PERIOD_Of_PPKO_ROLES')}:</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={40}>{t('ROLES.METERING_POINT_ADMINISTRATOR')}</TableCell>
                  <TableCell width={40}>{t('ROLES.METERED_DATA_COLLECTOR')}</TableCell>
                  <TableCell width={40}>{t('ROLES.METERED_DATA_RESPONSIBLE')}</TableCell>
                  <TableCell width={40}>{t('ROLES.METER_OPERATOR')}</TableCell>
                  <TableCell width={40}>
                    <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.DESIGN')} placement="top" arrow>
                      <span>{t('METER_OPERATOR_FUNCTIONS.DESIGN_SHORT')}</span>
                    </LightTooltip>
                  </TableCell>
                  <TableCell width={40}>
                    <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.COMMISSIONING')} placement="top" arrow>
                      <span>{t('METER_OPERATOR_FUNCTIONS.COMMISSIONING_SHORT')}</span>
                    </LightTooltip>
                  </TableCell>
                  <TableCell width={40}>
                    <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.CALIBRATION')} placement="top" arrow>
                      <span>{t('METER_OPERATOR_FUNCTIONS.CALIBRATION_SHORT')}</span>
                    </LightTooltip>
                  </TableCell>
                  <TableCell width={40}>
                    <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.REPAIR')} placement="top" arrow>
                      <span>{t('METER_OPERATOR_FUNCTIONS.REPAIR_SHORT')}</span>
                    </LightTooltip>
                  </TableCell>
                  <TableCell width={{ minWidth: 100 }}>{t('DOMAIN')}:</TableCell>
                  <TableCell style={{ minWidth: 100 }}>{t('FIELDS.STARTED_DATE')}:</TableCell>
                  <TableCell style={{ minWidth: 100 }}>{t('FIELDS.END_DATE')}:</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role, index) => (
                  <TableRow key={'roles' + index}>
                    <TableCell data-marker={'meter_point_admin-code'}>{role.meter_point_admin.code}</TableCell>
                    <TableCell data-marker={'meter_data_collector-code'}>{role.meter_data_collector.code}</TableCell>
                    <TableCell data-marker={'meter_data_responsible-code'}>
                      {role.meter_data_responsible.code}
                    </TableCell>
                    <TableCell data-marker={'meter_operator-code'}>{role.meter_operator.code}</TableCell>
                    <TableCell data-marker={'meter_design-code'}>
                      {role.meter_operator_funcs ? role.meter_operator_funcs[0]?.design?.code.toString() : '0'}
                    </TableCell>
                    <TableCell data-marker={'meter_commissioning-code'}>
                      {role.meter_operator_funcs ? role.meter_operator_funcs[0]?.commissioning?.code.toString() : '0'}
                    </TableCell>
                    <TableCell data-marker={'meter_calibration-code'}>
                      {role.meter_operator_funcs ? role.meter_operator_funcs[0]?.calibration?.code.toString() : '0'}
                    </TableCell>
                    <TableCell data-marker={'meter_repair-code'}>
                      {role.meter_operator_funcs ? role.meter_operator_funcs[0]?.repair?.code.toString() : '0'}
                    </TableCell>
                    <TableCell data-marker={'domain'}>{role.domain}</TableCell>
                    <TableCell data-marker={'start_date_roles'}>{getDate(role.start_date_roles)}</TableCell>
                    <TableCell data-marker={'end_date_roles'}>{getDate(role.end_date_roles)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const styles = {
  roles: {
    '&>h4': {
      color: '#4A5B7A',
      fontSize: 17,
      fontWeight: 'bold',
      marginTop: 3,
      marginLeft: 2,
      marginBottom: 1
    },
    '&>.MuiTableContainer-root': {
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: 8,
      padding: '0 8px',

      '& .MuiTableCell-root': {
        padding: 1.5,
        color: '#567691',
        fontSize: 14
      }
    }
  },
  tableHeader: {
    '&>.MuiTableCell-root': {
      borderBottom: 'none',
      fontWeight: 600,
      fontSize: '15px !important',
      color: '#4A5B7A',
      paddingBottom: '0px !important'
    }
  }
};
