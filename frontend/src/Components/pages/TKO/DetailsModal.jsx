import React, { useState } from 'react';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { Divider, Grid, Stack } from '@mui/material';
import { useStyles } from './TkoAccordion';
import { useTranslation } from 'react-i18next';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import { useCompanyDetailQuery } from './api';
import { useCopyToClipboardWithSnackbar } from '../../../Hooks/useCopyToClipboard';

export const DeatilsModal = ({ id }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isFetching } = useCompanyDetailQuery(id, { skip: !isOpen });
  const { copy } = useCopyToClipboardWithSnackbar();

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const copyDataAsTable = () => {
    const dataTable = rows.map((row) => `${t(row.label)}\t${data?.[row.key] || t('NOT_SPECIFIED')}`).join('\n');
    copy(dataTable);
  };

  return (
    <>
      {/*<BlueButton onClick={toggleModal} startIcon={<RemoveRedEye />} disabled={isFetching}>*/}
      {/*  {isFetching ? `${t('LOADING')}...` : t('CONTROLS.LEARN_MORE')}*/}
      {/*</BlueButton>*/}
      <ModalWrapper
        open={isOpen && !isFetching}
        header={t('CHARACTERISTICS.ADDITIONAL_DATS_FROM_THE_UNIFIED_STATE_REGISTER')}
        onClose={toggleModal}
      >
        <Grid container>
          {rows.map((row) => (
            <Grid span={24} xs={24} item justifyContent={'space-between'} key={row.key}>
              <Grid className={classes.contentItem}>
                <span className={classes.key}>{t(row.label)}:</span>
                <span className={classes.detailIfoValue} title={data?.[row.key] || t('NOT_SPECIFIED')}>
                  {data?.[row.key] || t('NOT_SPECIFIED')}
                </span>
              </Grid>
              <Divider />
            </Grid>
          ))}
        </Grid>
        <Stack direction={'row'} justifyContent={'space-around'} spacing={1}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BlueButton onClick={copyDataAsTable} fullWidth>
                {t('CONTROLS.COPY_DATA')}
              </BlueButton>
            </Grid>
            <Grid item xs={6}>
              <GreenButton onClick={toggleModal} fullWidth>
                {t('CONTROLS.OK')}
              </GreenButton>
            </Grid>
          </Grid>
        </Stack>
      </ModalWrapper>
    </>
  );
};

const rows = [
  { label: 'LEGAL_CHARACTERISTICS_DATA.FULL_NAME', key: 'full_name' },
  { label: 'LEGAL_CHARACTERISTICS_DATA.SHORT_NAME', key: 'short_name' },
  { label: 'LEGAL_CHARACTERISTICS_DATA.CODE_USREOU', key: 'usreou' },
  { label: 'CONTACTS_DATA.ADDRESS', key: 'full_address' },
  { label: 'CONTACTS_DATA.MAIL', key: 'email' },
  { label: 'CONTACTS_DATA.PHONE', key: 'phone_number' },
  { label: 'CONTACTS_DATA.WEB_SITE', key: 'web_page' }
];
