import Grid from '@material-ui/core/Grid';
import InfoRounded from '@mui/icons-material/InfoRounded';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Form from '../../../Forms/Form';
import { clearForm } from '../../../Forms/formActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { Card } from '../../../Components/Theme/Components/Card';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { DISPUTE_STATUSES } from '../constants';
import { disputesActions } from '../disputes.slice';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { noop } from 'lodash';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { ImportModal } from '../components/Modals/ImportModal';
import { DisputesEntityDkoFiles } from './DisputesEntityDkoFiles';
import StyledInputPhone from '../../../Components/Theme/Fields/StyledInputPhone';
import { trimPhoneNumber } from '../../../util/trimPhoneNumber';
import { useTranslation } from 'react-i18next';

export const CreateDisputeDko = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const methods = useForm();
  const { reset, getValues, watch } = methods;

  const { loading, uploading, disputeEntity, error } = useSelector(({ disputes }) => disputes);
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);

  useEffect(() => {
    if (checkPermissions('GTS.VIEW_DKO.CONTROLS.INIT_DISPUTE', ['ОМ', 'СВБ', 'АКО_Суперечки'])) {
      dispatch(disputesActions.getEntityDko({ uid }))
        .unwrap()
        .then((data) => {
          if (data?.data_type !== DISPUTE_STATUSES.DRAFT) {
            navigate(`/disputes/dko/${data?.uid}`);
          }
          reset({
            description: data?.description,
            initiator_email: data?.initiator_email,
            initiator_phone: data?.initiator_phone,
            initiator_position: data?.initiator_position,
            ...data?.dko
          });
        })
        .catch(() => navigate(-1));
    } else {
      navigate('/');
    }

    return () => dispatch(disputesActions.clearError());
  }, [dispatch, reset, uid, navigate, relation_id]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'energy_type' || name === 'period_begin' || name === 'period_end') {
        dispatch(
          disputesActions.updateEntityDko({
            uid,
            params: {
              status: DISPUTE_STATUSES.DRAFT,
              ...getValues(),
              initiator_phone: trimPhoneNumber(getValues('initiator_phone'))
            }
          })
        )
          .unwrap()
          .then((data) => {
            reset({
              description: data?.description,
              initiator_email: data?.initiator_email,
              initiator_phone: data?.initiator_phone,
              initiator_position: data?.initiator_position,
              ...data?.dko
            });
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [uid, watch, dispatch, getValues, reset]);

  const handleCreateDispute = (data) => {
    dispatch(
      disputesActions.updateEntityDko({
        uid,
        params: {
          status: DISPUTE_STATUSES.NEW,
          ...data,
          initiator_phone: trimPhoneNumber(data?.initiator_phone)
        }
      })
    )
      .unwrap()
      .then(({ uid }) => {
        navigate(`/disputes/dko/${uid}`);
        clearForms();
      })
      .catch((err) => console.log(err));
  };

  const handleImport = () => {
    dispatch(
      disputesActions.updateEntityDko({
        uid,
        params: {
          status: DISPUTE_STATUSES.DRAFT,
          ...getValues(),
          initiator_phone: trimPhoneNumber(getValues('initiator_phone'))
        }
      })
    )
      .unwrap()
      .then(() => setOpenDialog(true));
  };

  const handleDownload = () => {
    dispatch(
      disputesActions.updateEntityDko({
        uid,
        params: {
          status: DISPUTE_STATUSES.DRAFT,
          ...getValues(),
          initiator_phone: trimPhoneNumber(getValues('initiator_phone'))
        }
      })
    )
      .unwrap()
      .then(() => {
        dispatch(disputesActions.doActionDko({ uid, action: 'DOWNLOAD' }))
          .unwrap()
          .then(() => {
            dispatch(
              enqueueSnackbar({
                message: t('FILES_HAVE_STARTED_TO_FORM'),
                options: {
                  key: new Date().getTime() + Math.random(),
                  variant: 'success',
                  autoHideDuration: 5000
                }
              })
            );
          });
      });
  };

  const clearForms = () => {
    dispatch(clearForm('disputeProperties'));
    dispatch(clearForm('disputeAdditionalInfo'));
  };

  return (
    <Page
      pageName={t('PAGES.CREATE_DISPUTE_DKO')}
      backRoute={() => navigate(-1)}
      loading={loading}
      controls={
        <Actions
          activeActions={disputeEntity?.actions}
          handleCancelDispute={() => {
            navigate(-1);
            clearForms();
          }}
          handleImportFile={handleImport}
          handleExportDko={handleDownload}
          handleCreateDispute={methods.handleSubmit(handleCreateDispute)}
        />
      }
    >
      <FormProvider {...methods}>
        <DisputesInfo properties={disputeEntity?.dko} errors={error} />
        <AdditionalInfo errors={error} />
      </FormProvider>
      <DisputesEntityDkoFiles data={disputeEntity?.files__dko_proposition} />

      <ImportModal
        open={openDialog}
        loading={uploading}
        error={error}
        onClose={() => setOpenDialog(false)}
        title={t('DOWNLOAD_DISPUTE_FILES')}
        maxNumberFiles={5}
        onUpload={(data) =>
          dispatch(
            disputesActions.uploadFileDko({
              uid,
              data
            })
          ).then(() => {
            setOpenDialog(false);
          })
        }
        types={null}
      />
    </Page>
  );
};

const DisputesInfo = ({ errors, properties }) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  const periodBegin = watch('period_begin');
  const periodEnd = watch('period_end');

  return (
    <Card title={t('DISPUTE_DETAILS')}>
      <Form name={'disputeProperties'} errors={errors}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg>
            <Controller
              name="energy_type"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('FIELDS.ENERGY_TYPE')}
                  data={
                    properties?.energy_type_options?.map((property) => ({
                      value: property,
                      label: property
                    })) || []
                  }
                  disabled={!properties?.energy_type_options?.length}
                  onChange={noop}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg>
            <Controller
              name="period_begin"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('FIELDS.START_PERIOD_DATE')}
                  error={errors?.period_begin}
                  outFormat={'yyyy-MM-DDTHH:mm:ss'}
                  maxDate={periodEnd}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg>
            <Controller
              name="period_end"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('FIELDS.END_PERIOD_DATE')}
                  error={errors?.period_end}
                  outFormat={'yyyy-MM-DDTHH:mm:ss'}
                  minDate={periodBegin}
                  maxDate={new Date('9999-12-31')}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg>
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('FIELDS.VERSION')}
                  data={
                    properties?.version_options?.map((property) => ({
                      value: property,
                      label: property
                    })) || []
                  }
                  disabled={!properties?.version_options?.length}
                  onChange={noop}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg>
            <Controller
              name="release"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('FIELDS.RELEASE')}
                  data={
                    properties?.release_options?.map((property) => ({
                      value: property.toString(),
                      label: property.toString()
                    })) || []
                  }
                  disabled={!properties?.release_options?.length}
                  onChange={noop}
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};

const AdditionalInfo = ({ errors }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Card title={t('ADDITIONAL_INFO')}>
      <Form name={'disputeAdditionalInfo'} errors={errors}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <StyledInput label={t('DISPUTE_DESCRIPTION')} error={errors?.description} required {...field} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="initiator_phone"
              control={control}
              render={({ field }) => (
                <StyledInputPhone
                  label={t('FIELDS.INITIATOR_PHONE')}
                  error={errors?.initiator_phone}
                  required
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="initiator_email"
              control={control}
              render={({ field }) => (
                <StyledInput label={t('FIELDS.INITIATOR_EMAIL')} error={errors?.initiator_email} required {...field} />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="initiator_position"
              control={control}
              render={({ field }) => (
                <StyledInput
                  label={t('FIELDS.INITIATOR_POSITION')}
                  error={errors?.initiator_position}
                  required
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item container alignItems={'center'} justifyContent={'flex-start'}>
            <Grid item style={{ marginRight: 8 }}>
              <InfoRounded style={{ color: '#008C0C' }} />
            </Grid>
            <Grid item>
              <b>{t('CONSENT_TO_PROCESSING_PERSONAL_DATA')}</b>
            </Grid>
          </Grid>
          <Grid item>{t('CONSENT_TO_PROCESSING_PERSONAL_DATA_IN_CREATE_DISPUTE')}</Grid>
        </Grid>
      </Form>
    </Card>
  );
};

const Actions = ({ activeActions, handleCancelDispute, handleCreateDispute, handleExportDko, handleImportFile }) => {
  const { t } = useTranslation();
  return (
    <>
      {activeActions?.includes('CANCEL') && (
        <CircleButton
          type={'remove'}
          title={t('CONTROLS.CANCEL')}
          dataMarker={'dko-dispute-cancel'}
          onClick={handleCancelDispute}
        />
      )}

      {activeActions?.includes('UPLOAD') && (
        <CircleButton
          type={'upload'}
          title={t('CONTROLS.IMPORT')}
          onClick={handleImportFile}
          dataMarker={'dko-dispute-upload-file'}
        />
      )}

      {activeActions?.includes('DOWNLOAD') && (
        <CircleButton
          type={'download'}
          title={t('CONTROLS.EXPORT_OF_STATEMENTS_AND_OFFERS')}
          onClick={handleExportDko}
          dataMarker={'dko-dispute-download-file'}
        />
      )}

      {activeActions?.includes('APPROVE') && (
        <CircleButton
          type={'forward'}
          title={t('CONTROLS.NEXT')}
          dataMarker={'dko-dispute-create'}
          onClick={handleCreateDispute}
        />
      )}
    </>
  );
};
