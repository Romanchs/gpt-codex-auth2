import Grid from '@material-ui/core/Grid';
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getNamesCheckDocs,
  getPpkoConstants,
  getPpkoJSONById,
  getPpkoLists,
  savePpko
} from '../../../actions/ppkoActions';
import { getWorkdaysReceivingDkoActual } from '../../../actions/processesActions';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import Autocomplete from '../../Theme/Fields/Autocomplete';
import DatePicker from '../../Theme/Fields/DatePicker';
import SelectField from '../../Theme/Fields/SelectField';
import StyledInput from '../../Theme/Fields/StyledInput';
import PpkoAddressSection from './layouts/PpkoAddressSection';
import PpkoContactsSection from './layouts/PpkoContactsSection';
import PpkoRolesSection from './layouts/PpkoRolesSection';
import { useTranslation } from 'react-i18next';

const PpkoEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, namesCheckDocs, loadingNameCheckDock } = useSelector(({ ppko }) => ppko);
  const { loading: workdaysLoading } = useSelector(({ processes }) => processes);
  const error = useSelector(({ ppko }) => ppko?.error?.response?.data);

  const [result, setResult] = useState({});
  const [selectsData, setSelectsData] = useState({
    ROLE_TYPE: [],
    TEST_RESULT_STATUSES: [],
    REGISTRATION_STATUSES: [],
    BUSINESS_PROCESS_STATUSES: [],
    PUBLICATION_STATUSES: [],
    ADDRESS_TYPES: [],
    CHOICES_COMMENT: []
  });
  const [addressesSelects, setAddressesSelects] = useState({
    REGION: [],
    SETTLEMENT_TYPES: [],
    STREET_TYPES: [],
    ROOM_TYPES: []
  });
  const [visualData, setVisualData] = useState({});
  const [timeOut, setTimeOut] = useState(null);
  const [loadingAllData, setLoadingAllData] = useState(false);

  useEffect(() => {
    setLoadingAllData(true);
    Promise.all([
      new Promise((resolve) => dispatch(getPpkoConstants(resolve))),
      new Promise((resolve) => dispatch(getPpkoLists(resolve))),
      new Promise((resolve) => dispatch(getPpkoJSONById(id, resolve)))
    ]).then(([selectsDefaultData, addressesSelectsDefaultData, currentProcess]) => {
      setSelectsData(
        Object.fromEntries(
          Object.entries(selectsDefaultData).map(([key, list]) => [
            key,
            Object.keys(list).map((k) => ({
              value: k,
              label: `PPKO_CONSTANTS.${key}.${k}`
            }))
          ])
        )
      );
      setAddressesSelects(
        Object.fromEntries(
          Object.entries(addressesSelectsDefaultData).map(([key, list]) => [
            key,
            list.map((label) => ({ value: label, label }))
          ])
        )
      );
      setVisualData({
        full_name_responsible_people_for_check_doc: currentProcess.full_name_responsible_people_for_check_doc
      });
      setResult(currentProcess);
      setLoadingAllData(false);
    });
  }, [dispatch, id]);

  const handleSave = () => {
    setVisualData({
      ...visualData,
      full_name_responsible_people_for_check_doc: result.full_name_responsible_people_for_check_doc
    });
    dispatch(savePpko(id, result));
  };

  const handleChange = (v) => {
    setVisualData({ ...visualData, full_name_responsible_people_for_check_doc: v });
    setResult({ ...result, full_name_responsible_people_for_check_doc: v });
  };

  const handleSearch = (v) => {
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(getNamesCheckDocs(v));
      }, 1000)
    );
    setVisualData({ ...visualData, full_name_responsible_people_for_check_doc: v });
  };

  /*const handleReplaceDocument = () => {
		if (result.ra_contract) {
			// dispatch(uploadPpkoDocument(result.ra_contract));
		}
		navigate(`/ppko/edit/documentation`);
	};
	const validate = () => {
		const {current_registration_status, ra_reference_book} = result;
		return !(!ra_reference_book?.eic && current_registration_status === 501);
	};*/

  const handleInputChange =
    (prop, isValueSimple = false) =>
    (v) => {
      let piece;
      let value = isValueSimple ? v : v.target.value;
      if (
        (prop === 'automated_system_data.main_tech_characteristic' ||
          prop === 'additional_data.other_tech_info' ||
          prop === 'additional_data.tech_info_for_mms') &&
        !value
      ) {
        value = null;
      }

      if (prop.indexOf('.') === -1) {
        piece = { [prop]: value };
      } else {
        prop = prop.split('.');
        piece = { [prop[0]]: JSON.parse(JSON.stringify(result[prop[0]] || {})) };
        let temp = piece;

        let i;
        for (i = 1; i < prop.length - 1; i++) {
          temp = temp[prop[i]];
        }
        temp[prop[0]][prop[i]] = value;
      }
      setResult({ ...result, ...piece });
    };

  const handleTestingStartChange = (startDate) => {
    const newResult = {
      ...result,
      testing_data_as: {
        ...result.testing_data_as,
        test_start_date: startDate === null || moment(startDate).isValid() ? startDate : 'invalid date'
      }
    };
    if (!result?.testing_data_as?.test_end_date && moment(startDate, moment.ISO_8601).isValid()) {
      dispatch(
        getWorkdaysReceivingDkoActual(
          {
            date: moment(startDate).format('YYYY-MM-DD'),
            days: 10
          },
          (date) =>
            setResult((prev) => ({ ...prev, testing_data_as: { ...prev.testing_data_as, test_end_date: date } }))
        )
      );
    }
    setResult(newResult);
  };

  const handleChangeDateRegistrationRa = (date) => {
    const startDate = date && moment(date).isValid() ? date : null;
    const registrationDate = date === null || moment(date).isValid() ? date : 'invalid date';
    const cancellationDate = moment(date).isValid() ? moment(date).add(10, 'years').add(1, 'days') : null;

    setResult({
      ...result,
      date_registration_ra: registrationDate,
      date_cancellation_of_registration_ra: result.date_cancellation_of_registration_ra
        ? result.date_cancellation_of_registration_ra
        : cancellationDate,
      additional_data: {
        ...result.additional_data,
        start_date_tech_info: result.additional_data?.start_date_tech_info
          ? result.additional_data?.start_date_tech_info
          : startDate,
        end_date_tech_info: result.additional_data?.end_date_tech_info
          ? result.additional_data?.end_date_tech_info
          : cancellationDate
      }
    });
  };

  return (
    <Page
      acceptPermisions={'PPKO.DETAIL.CONTROLS.EDIT'}
      acceptRoles={['АКО_ППКО']}
      pageName={t('PAGES.EDIT_PPKO')}
      backRoute={`/ppko/${id}`}
      loading={loading || loadingAllData}
      controls={
        <>
          <CircleButton type={'create'} title={t('CONTROLS.SAVE')} onClick={handleSave} />
          {/* {verifyRole('АКО_ППКО') && (
            <CircleButton
              type={'document'}
              title={'Документація'}
              onClick={handleReplaceDocument}
              disabled={loading || !validate()}
            />
          )} */}
        </>
      }
    >
      {result?.ra_reference_book?.eic === undefined ? (
        <div></div>
      ) : (
        <div className={'ppko-form'}>
          <section>
            <h4>{t('REGISTRATION_DATA')}</h4>
            <div className={'form-section'}>
              <div>
                <Grid container spacing={3}>
                  <Grid item sm={12} md={6} lg={4}>
                    <StyledInput
                      label={t('PPKO_REGISTRATION_DATA.EIC_CODE_TYPE_X_PPKO')}
                      value={result?.ra_reference_book?.eic}
                      error={error?.ra_reference_book?.eic}
                      onChange={({ target: { value } }) =>
                        setResult({ ...result, ra_reference_book: { ...result.ra_reference_book, eic: value } })
                      }
                      // required={result?.current_registration_status === 501 || result?.current_registration_status === 506}
                      // disabled={true}
                      // data-status={'disabled'}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <SelectField
                      label={t('PPKO_REGISTRATION_DATA.REGISTRATION_STATUS_PPKO')}
                      value={result?.current_registration_status}
                      data={selectsData.REGISTRATION_STATUSES}
                      error={error?.current_registration_status}
                      onChange={(v) => setResult({ ...result, current_registration_status: +v })}
                      required
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.DATE_RECEIVE_DOCUMENT')}
                      value={result?.date_receive_document}
                      error={error?.date_receive_document}
                      minDate={new Date('01.01.1925')}
                      maxDate={moment()}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          date_receive_document: date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={8}>
                    <Autocomplete
                      label={t('PPKO_REGISTRATION_DATA.NAME_RESPONSIBLE_PEOPLE_POR_CHECK_DOC')}
                      value={visualData.full_name_responsible_people_for_check_doc || ''}
                      list={namesCheckDocs.map((i) => ({
                        label: i.full_name_responsible_people_for_check_doc,
                        value: i.uid
                      }))}
                      loading={loadingNameCheckDock}
                      onChange={(v) => handleChange(v?.label || null)}
                      onInput={(...args) => args[1].length > 2 && handleSearch(args[1])}
                      filterOptions={(options) => options}
                      error={error?.full_name_responsible_people_for_check_doc}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <SelectField
                      label={t('AUTOMATED_SYSTEM_DATA.AVAILABILITY_COMMENTS')}
                      value={result.availability_comments_to_document}
                      data={selectsData.CHOICES_COMMENT}
                      error={error?.availability_comments_to_document}
                      onChange={(v) =>
                        setResult({
                          ...result,
                          availability_comments_to_document: v
                        })
                      }
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.DATE_SUBMISSIONS_COMMENTS')}
                      value={result?.date_submissions_of_comment_for_doc}
                      error={error?.date_submissions_of_comment_for_doc}
                      minDate={new Date('01.01.1925')}
                      maxDate={moment()}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          date_submissions_of_comment_for_doc:
                            date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.DATE_ELIMINATION_OF_COMMENT')}
                      value={result.date_elimination_of_comment_for_doc}
                      error={error?.date_elimination_of_comment_for_doc}
                      minDate={new Date('01.01.1925')}
                      maxDate={moment()}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          date_elimination_of_comment_for_doc:
                            date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.DATE_REGISTRATION_RA')}
                      value={result.date_registration_ra}
                      minDate={new Date('01.01.1925')}
                      maxDate={moment()}
                      error={error?.date_registration_ra}
                      onChange={handleChangeDateRegistrationRa}
                      required={
                        result?.current_registration_status === 501 ||
                        result?.current_registration_status === 506 ||
                        result?.current_registration_status === 508
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledInput
                      label={t('PPKO_REGISTRATION_DATA.NOTE')}
                      value={result.note}
                      max={500}
                      error={error?.note}
                      onChange={handleInputChange('note')}
                      multiline
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={8}>
                    <StyledInput
                      label={t('PPKO_REGISTRATION_DATA.REFERENCE_TO_STORAGE_APP_WITH_EDS')}
                      value={result.reference_to_storage_application_with_eds}
                      error={error?.reference_to_storage_application_with_eds}
                      onChange={handleInputChange('reference_to_storage_application_with_eds')}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.DATE_CANCELLATION_OF_REGISTRATION_RA')}
                      value={result.date_cancellation_of_registration_ra}
                      error={error?.date_cancellation_of_registration_ra}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) => {
                        setResult({
                          ...result,
                          date_cancellation_of_registration_ra:
                            date === null || moment(date).isValid() ? date : 'invalid date',
                          additional_data: {
                            ...result.additional_data,
                            end_date_tech_info: result.additional_data?.end_date_tech_info
                              ? result.additional_data?.end_date_tech_info
                              : moment(date, moment.ISO_8601).isValid()
                              ? date
                              : null
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.DATE_SENDING_DATA_FOR_RECEIVING_EIC')}
                      value={result.date_sending_data_for_receiving_eic}
                      error={error?.date_sending_data_for_receiving_eic}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          date_sending_data_for_receiving_eic:
                            date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <DatePicker
                      label={t('PPKO_REGISTRATION_DATA.RE_REGISTRATION_DATE')}
                      value={result.re_registration_date}
                      error={error?.re_registration_date}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          re_registration_date: date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </section>
          <section>
            <h4>{t('LEGAL_CHARACTERISTICS')}</h4>
            <div className={'form-section'}>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledInput
                      label={t('LEGAL_CHARACTERISTICS_DATA.FULL_NAME')}
                      value={result.ra_reference_book?.full_name}
                      error={error?.ra_reference_book?.full_name}
                      onChange={handleInputChange('ra_reference_book.full_name')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={5}>
                    <StyledInput
                      label={t('LEGAL_CHARACTERISTICS_DATA.SHORT_NAME')}
                      value={result.ra_reference_book?.short_name}
                      error={error?.ra_reference_book?.short_name}
                      onChange={handleInputChange('ra_reference_book.short_name')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <StyledInput
                      label={t('LEGAL_CHARACTERISTICS_DATA.CODE_USREOU')}
                      value={result.ra_reference_book?.code_usreou}
                      // error={error?.ra_reference_book?.code_usreou}
                      // number
                      // max={12}
                      // onChange={(v) => setResult({...result, ra_reference_book: {...result.ra_reference_book, code_usreou: v}})}
                      // required
                      disabled={true}
                      data-status={'disabled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <SelectField
                      label={t('LEGAL_CHARACTERISTICS_DATA.PUBLICATION_STATUS')}
                      value={result.publication_status}
                      data={selectsData.PUBLICATION_STATUSES}
                      error={error?.publication_status}
                      onChange={(v) => setResult({ ...result, publication_status: v })}
                      required
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.LEGAL_ADDRESS')}</h5>
                <PpkoAddressSection
                  initialData={result?.contacts?.legal_address}
                  selectsData={addressesSelects}
                  errors={error?.contacts?.legal_address}
                  onChange={handleInputChange('contacts.legal_address', true)}
                />
              </div>
              <div>
                <h5 style={{ marginTop: 16 }}>{t('LEGAL_CHARACTERISTICS_DATA.VALIDITY_PERIOD')}</h5>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label={t('LEGAL_CHARACTERISTICS_DATA.START_DATE')}
                      value={result.start_date_quantity_ap}
                      error={error?.start_date_quantity_ap}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          start_date_quantity_ap: date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label={t('LEGAL_CHARACTERISTICS_DATA.END_DATE')}
                      value={result?.end_date_quantity_ap}
                      error={error?.end_date_quantity_ap}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          end_date_quantity_ap: date === null || moment(date).isValid() ? date : 'invalid date'
                        })
                      }
                      required
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </section>
          <PpkoContactsSection
            data={result?.contacts}
            selectsData={addressesSelects}
            errors={error?.contacts}
            onChange={handleInputChange('contacts', true)}
          />
          <section>
            <h4>{t('DATA_ABOUT_AUTOMATED_SYSTEM')}</h4>
            <div className={'form-section'}>
              <div>
                <h5>{t('AUTOMATED_SYSTEM_DATA.AS_PPKO')}</h5>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.NAME')}
                      value={result.automated_system_data?.name}
                      error={error?.automated_system_data?.name}
                      onChange={handleInputChange('automated_system_data.name')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.PRODUCER')}
                      value={result.automated_system_data?.producer}
                      error={error?.automated_system_data?.producer}
                      onChange={handleInputChange('automated_system_data.producer')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.OWNER')}
                      value={result.automated_system_data?.owner}
                      error={error?.automated_system_data?.owner}
                      onChange={handleInputChange('automated_system_data.owner')}
                      required
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <h5 style={{ marginTop: 16 }}>{t('AUTOMATED_SYSTEM_DATA.INTRODUCTION_INTO_INDUSTRIAL_OPPERATION')}</h5>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.NUMBER_ACT_OF_COMMISSIONING')}
                      value={result.automated_system_data?.number_act_of_commissioning}
                      error={error?.automated_system_data?.number_act_of_commissioning}
                      onChange={handleInputChange('automated_system_data.number_act_of_commissioning')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.DATA_OF_COMMISSIONING')}
                      value={result.automated_system_data?.data_of_commissioning}
                      error={error?.automated_system_data?.data_of_commissioning}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          automated_system_data: {
                            ...result.automated_system_data,
                            data_of_commissioning: date === null || moment(date).isValid() ? date : 'invalid date'
                          }
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.MAIN_TECH_CHARACTERISTIC')}
                      value={result.automated_system_data?.main_tech_characteristic}
                      error={error?.automated_system_data?.main_tech_characteristic}
                      onChange={handleInputChange('automated_system_data.main_tech_characteristic')}
                      required
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <h5 style={{ marginTop: 16 }}>{t('REGISTRATION_DATA')}</h5>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <SelectField
                      label={t('AUTOMATED_SYSTEM_DATA.TEST_RESULT_AS')}
                      value={result?.testing_data_as?.test_result_as}
                      data={selectsData.TEST_RESULT_STATUSES}
                      error={error?.testing_data_as?.test_result_as}
                      onChange={(v) =>
                        setResult({
                          ...result,
                          testing_data_as: {
                            ...result.testing_data_as,
                            test_result_as: v
                          }
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.TEST_START_DATE')}
                      value={result.testing_data_as?.test_start_date}
                      minDate={
                        result.date_elimination_of_comment_for_doc
                          ? moment(result.date_elimination_of_comment_for_doc)
                          : false
                      }
                      maxDate={new Date('01.01.2200')}
                      error={error?.testing_data_as?.test_start_date}
                      onChange={handleTestingStartChange}
                      disabled={workdaysLoading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.TEST_END_DATE')}
                      value={result?.testing_data_as?.test_end_date}
                      error={error?.testing_data_as?.test_end_date}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(v) =>
                        setResult({
                          ...result,
                          testing_data_as: {
                            ...result.testing_data_as,
                            test_end_date: v === null || moment(v).isValid() ? v : 'invalid date'
                          }
                        })
                      }
                      disabled={workdaysLoading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <StyledInput
                      label={t('AUTOMATED_SYSTEM_DATA.EIS_TESTING_MMS')}
                      value={result.eis_testing_mms}
                      error={error?.eis_testing_mms}
                      onChange={handleInputChange('eis_testing_mms')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <SelectField
                      label={t('AUTOMATED_SYSTEM_DATA.AVAILABILITY_COMMENTS')}
                      value={result.testing_data_as?.availability_comments}
                      data={selectsData.CHOICES_COMMENT}
                      error={error?.testing_data_as?.availability_comments}
                      onChange={(v) =>
                        setResult({
                          ...result,
                          testing_data_as: {
                            ...result.testing_data_as,
                            availability_comments: v
                          }
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.DATE_SUBMISSIONS_COMMENTS')}
                      value={result.testing_data_as?.date_submissions_comments}
                      maxDate={moment()}
                      minDate={
                        result?.testing_data_as?.test_start_date
                          ? moment(result.testing_data_as?.test_start_date)
                          : false
                      }
                      error={error?.testing_data_as?.date_submissions_comments}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          testing_data_as: {
                            ...result.testing_data_as,
                            date_submissions_comments: date === null || moment(date).isValid() ? date : 'invalid date'
                          }
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('AUTOMATED_SYSTEM_DATA.DATE_ELIMINATION_COMMENTS')}
                      value={result.testing_data_as?.date_elimination_comments}
                      maxDate={moment()}
                      minDate={
                        result?.testing_data_as?.date_submissions_comments
                          ? moment(result.testing_data_as?.date_submissions_comments)
                          : false
                      }
                      error={error?.testing_data_as?.date_elimination_comments}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          testing_data_as: {
                            ...result.testing_data_as,
                            date_elimination_comments: date === null || moment(date).isValid() ? date : 'invalid date'
                          }
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </section>
          <section>
            <h4>{t('ADDITIONAL_INFO')}</h4>
            <div className={'form-section'}>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledInput
                      label={t('ADDITIONAL_INFO_DATA.TECH_INFO_FOR_MMS')}
                      value={result.additional_data?.tech_info_for_mms}
                      error={error?.additional_data?.tech_info_for_mms}
                      onChange={handleInputChange('additional_data.tech_info_for_mms')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledInput
                      label={t('ADDITIONAL_INFO_DATA.OTHER_TECH_INFO')}
                      value={result.additional_data?.other_tech_info}
                      error={error?.additional_data?.other_tech_info}
                      onChange={handleInputChange('additional_data.other_tech_info')}
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <h5 style={{ marginTop: 16 }}>{t('ADDITIONAL_INFO_DATA.VALIDITY_PERIOD')}</h5>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('ADDITIONAL_INFO_DATA.START_DATE')}
                      value={result.additional_data?.start_date_tech_info}
                      error={error?.additional_data?.start_date_tech_info}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          additional_data: {
                            ...result.additional_data,
                            start_date_tech_info: date === null || moment(date).isValid() ? date : 'invalid date'
                          }
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <DatePicker
                      label={t('ADDITIONAL_INFO_DATA.END_DATE')}
                      value={result.additional_data?.end_date_tech_info}
                      error={error?.additional_data?.end_date_tech_info}
                      minDate={new Date('01.01.1925')}
                      maxDate={new Date('01.01.2200')}
                      onChange={(date) =>
                        setResult({
                          ...result,
                          additional_data: {
                            ...result.additional_data,
                            end_date_tech_info: date === null || moment(date).isValid() ? date : 'invalid date'
                          }
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </section>
          <PpkoRolesSection
            ra_roles={result?.ra_roles}
            error={error?.ra_roles}
            setResult={setResult}
            current_registration_status={result?.current_registration_status}
          />
        </div>
      )}
    </Page>
  );
};

export default PpkoEdit;
