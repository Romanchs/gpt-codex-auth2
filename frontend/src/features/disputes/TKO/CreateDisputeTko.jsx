import Grid from '@material-ui/core/Grid';
import InfoRounded from '@mui/icons-material/InfoRounded';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { Card, CardNoResult } from '../../../Components/Theme/Components/Card';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { DISPUTE_STATUSES, PROPERTIES_TYPE } from '../constants';
import { disputesActions } from '../disputes.slice';
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { noop } from 'lodash';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { trimPhoneNumber } from '../../../util/trimPhoneNumber';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { ImportModal } from '../components/Modals/ImportModal';
import { DisputesEntityTkoFiles } from './DisputesEntityTkoFiles';
import { useTranslation } from 'react-i18next';

export const CreateDisputeTko = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  const { loading, uploading, disputeEntity, error } = useSelector(({ disputes }) => disputes);
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const {
    properties,
    initiator_email,
    initiator_phone,
    initiator_position,
    description,
    files,
    period_begin,
    period_end
  } = disputeEntity;

  const methods = useForm({
    defaultValues: {
      tko_properties: []
    }
  });
  const {
    reset,
    getValues,
    formState: { isValid }
  } = methods;

  useEffect(() => {
    if (checkPermissions('TKO.TKO_DETAIL.CONTROLS.INIT_DISPUTE', ['СВБ', 'АКО_Суперечки', 'АТКО'])) {
      dispatch(disputesActions.getEntity({ uid }));
    } else {
      navigate('/');
    }

    return () => dispatch(disputesActions.clearError());
  }, [dispatch, uid, navigate, relation_id]);

  const getTkoProperties = (properties) =>
    properties.reduce((acc, property) => {
      acc[property?.property_code] = property.by_initiator || '';

      return acc;
    }, {});

  useEffect(() => {
    reset({
      initiator_email,
      initiator_phone,
      initiator_position,
      description,
      period_begin,
      period_end,
      tko_properties: properties
    });
  }, [initiator_email, initiator_phone, initiator_position, description, properties, period_begin, period_end, reset]);

  const handleImport = () => {
    dispatch(
      disputesActions.updateEntity({
        uid,
        params: {
          status: DISPUTE_STATUSES.DRAFT,
          ...getValues(),
          initiator_phone: trimPhoneNumber(getValues('initiator_phone')),
          tko_properties: getTkoProperties(getValues()?.tko_properties)
        }
      })
    )
      .unwrap()
      .then(() => setOpenDialog(true));
  };

  const handleDownload = () => {
    dispatch(
      disputesActions.updateEntity({
        uid,
        params: {
          status: DISPUTE_STATUSES.DRAFT,
          ...getValues(),
          initiator_phone: trimPhoneNumber(getValues('initiator_phone')),
          tko_properties: getTkoProperties(getValues()?.tko_properties)
        }
      })
    )
      .unwrap()
      .then(() => {
        dispatch(disputesActions.doAction({ uid, action: 'DOWNLOAD' }))
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

  const handleDeleteProperty = (property_code) => {
    dispatch(
      disputesActions.updateEntity({
        uid,
        params: {
          status: DISPUTE_STATUSES.DRAFT,
          ...getValues(),
          tko_properties: getTkoProperties(
            getValues()?.tko_properties.filter((property) => property.property_code !== property_code)
          )
        }
      })
    );
  };

  const handleCreateDispute = () => {
    dispatch(
      disputesActions.updateEntity({
        uid,
        params: {
          status: DISPUTE_STATUSES.NEW,
          ...getValues(),
          tko_properties: getTkoProperties(getValues()?.tko_properties)
        }
      })
    )
      .unwrap()
      .then(({ uid }) => {
        navigate(`/disputes/tko/${uid}`);
      });
  };

  return (
    <Page
      pageName={t('PAGES.DISPUTE_TKO')}
      backRoute={() => navigate(-1)}
      loading={loading}
      controls={
        <Actions
          disabledCreate={!isValid}
          disabledUpload={files?.length > 7}
          handleCancelDispute={() => navigate(-1)}
          handleDownloadFile={handleImport}
          handleExport={handleDownload}
          handleCreateDispute={handleCreateDispute}
        />
      }
    >
      <FormProvider {...methods}>
        <SpecificationTko properties={properties} errors={error} handleDelete={handleDeleteProperty} />
        <AdditionalInfo errors={error} />
      </FormProvider>
      <DisputesEntityTkoFiles files={files} />

      <ImportModal
        open={openDialog}
        text={t('DISPUTE_TKO_IMPORT_FILES_MODAL_TITLE')}
        loading={uploading}
        error={error}
        onClose={() => setOpenDialog(false)}
        title={t('DOWNLOAD_DISPUTE_FILES')}
        maxNumberFiles={7}
        onUpload={(data) =>
          dispatch(
            disputesActions.uploadFile({
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

const SpecificationTko = ({ properties, errors, handleDelete }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'tko_properties'
  });

  return (
    <Card
      title={
        <Grid container>
          <Grid item xs>
            {t('CONFLICTS_CHARACTERISTICS')}
          </Grid>
          <Grid item xs>
            {t('TKO_FEATURES_OFFERED')}
          </Grid>
        </Grid>
      }
    >
      {!properties?.length && <CardNoResult span={6} text={t('NO_CHARACTERISTICS')} small />}

      {fields.map(({ property, id, property_code, current, property_data_type, property_data_list }, index) => {
        return (
          <Grid container spacing={3} key={id}>
            <Grid item xs={6}>
              <StyledInput
                label={property}
                dataMarker={`${property_code}_current`}
                readOnly
                value={
                  property_data_type === PROPERTIES_TYPE.DATE && current && current !== 'N/A'
                    ? moment(current).format('DD.MM.YYYY')
                    : current
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Grid container spacing={2} alignItems={'flex-start'}>
                <Grid item xs={11}>
                  {property_data_type === PROPERTIES_TYPE.STR && (
                    <Controller
                      control={control}
                      name={`tko_properties.${index}.by_initiator`}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <StyledInput
                          label={property}
                          dataMarker={`${property_code}_propose`}
                          required
                          error={errors?.[property_code]}
                          {...field}
                        />
                      )}
                    />
                  )}

                  {property_data_type === PROPERTIES_TYPE.DATE && (
                    <Controller
                      name={`tko_properties.${index}.by_initiator`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          label={property}
                          outFormat={'yyyy-MM-DDTHH:mm:ss'}
                          maxDate={new Date('9999-12-31')}
                          dataMarker={`${property_code}_propose`}
                          error={errors?.[property_code]}
                          required
                          {...field}
                        />
                      )}
                    />
                  )}

                  {property_data_type === PROPERTIES_TYPE.LIST && (
                    <Controller
                      name={`tko_properties.${index}.by_initiator`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <SelectField
                          label={property}
                          data={property_data_list.map((property) => ({
                            value: property,
                            label: property
                          }))}
                          dataMarker={`${property_code}_propose`}
                          onChange={noop}
                          error={errors?.[property_code]}
                          required
                          {...field}
                        />
                      )}
                    />
                  )}
                </Grid>
                <Grid item xs={1} style={{ paddingTop: 18, textAlign: 'right' }}>
                  <CircleButton
                    type={'delete'}
                    title={t('CONTROLS.DELETE_AP_CHARACTERISTIC')}
                    dataMarker={'tko-dispute-char-cancel'}
                    size={'small'}
                    onClick={() => handleDelete(property_code)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Card>
  );
};

const AdditionalInfo = ({ errors }) => {
  const { control, watch } = useFormContext();
  const { t } = useTranslation();

  const periodBegin = watch('period_begin');
  const periodEnd = watch('period_end');

  return (
    <Card title={t('ADDITIONAL_INFO')}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <StyledInput label={t('DISPUTE_DESCRIPTION')} error={errors?.description} {...field} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="initiator_phone"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <StyledInput label={t('FIELDS.INITIATOR_PHONE')} error={errors?.initiator_phone} required {...field} />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Controller
            name="initiator_email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <StyledInput label={t('FIELDS.INITIATOR_EMAIL')} error={errors?.initiator_email} required {...field} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <Controller
            name="initiator_position"
            control={control}
            rules={{ required: true, minLength: 5, maxLength: 200 }}
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

        <Grid item xs={12} md={4} lg={4}>
          <Controller
            name="period_begin"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                label={t('FIELDS.START_PERIOD_DATE')}
                error={errors?.period_begin}
                outFormat={'yyyy-MM-DDTHH:mm:ss'}
                maxDate={periodEnd}
                required
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
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
    </Card>
  );
};

const Actions = ({
  disabledCreate,
  disabledUpload,
  handleCancelDispute,
  handleCreateDispute,
  handleDownloadFile,
  handleExport
}) => {
  const { t } = useTranslation();
  return (
    <>
      <CircleButton
        type={'remove'}
        title={t('CONTROLS.CANCEL')}
        dataMarker={'tko-dispute-cancel'}
        onClick={handleCancelDispute}
      />

      <CircleButton
        type={'upload'}
        title={t('CONTROLS.DOWNLOAD_FILE')}
        onClick={handleDownloadFile}
        disabled={disabledUpload || disabledCreate}
        dataMarker={'tko-dispute-upload-file'}
      />

      <CircleButton
        type={'download'}
        title={t('CONTROLS.EXPORT_OF_STATEMENTS_AND_OFFERS')}
        disabled={disabledCreate}
        onClick={handleExport}
        dataMarker={'tko-dispute-download-file'}
      />

      <CircleButton
        type={'forward'}
        title={t('CONTROLS.NEXT')}
        dataMarker={'tko-dispute-create'}
        onClick={handleCreateDispute}
        disabled={disabledCreate}
      />
    </>
  );
};
