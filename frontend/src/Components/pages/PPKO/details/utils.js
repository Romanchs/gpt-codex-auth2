import moment from 'moment';
import { checkPermissions } from '../../../../util/verifyRole';

export const getDate = (date) => {
  if (!date) return date;
  if (!moment(date, moment.ISO_8601).isValid()) {
    date = date.slice(0, -3);
  }
  return moment(date).format('DD.MM.yyyy');
};

export const getAccordionLong = (data, CONSTANTS) => {
  return [
    {
      title: 'REGISTRATION_DATA',
      content: [
        {
          header: false,
          items: [
            { key: 'PPKO_REGISTRATION_DATA.EIC_CODE_TYPE_X_PPKO', value: data.ra_reference_book?.eic },
            {
              key: 'PPKO_REGISTRATION_DATA.REGISTRATION_STATUS_PPKO',
              value: `PPKO_CONSTANTS.REGISTRATION_STATUSES.${data.current_registration_status?.code}`
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_RECEIVE_DOCUMENT',
              value: getDate(data.date_receive_document)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.NAME_RESPONSIBLE_PEOPLE_POR_CHECK_DOC',
              value: data.full_name_responsible_people_for_check_doc
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.AVAILABILITY_COMMENTS',
              value: data.availability_comments_to_document
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.DATE_SUBMISSIONS_COMMENTS',
              value: getDate(data.date_submissions_of_comment_for_doc)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_ELIMINATION_OF_COMMENT',
              value: getDate(data.date_elimination_of_comment_for_doc)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_REGISTRATION_RA',
              value: getDate(data.date_registration_ra)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_CANCELLATION_OF_REGISTRATION_RA',
              value: getDate(data.date_cancellation_of_registration_ra)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.REFERENCE_TO_STORAGE_APP_WITH_EDS',
              value: data.reference_to_storage_application_with_eds,
              link: true
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_SENDING_DATA_FOR_RECEIVING_EIC',
              value: getDate(data?.date_sending_data_for_receiving_eic)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.RE_REGISTRATION_DATE',
              value: getDate(data?.re_registration_date)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.NOTE',
              value: data.note,
              full: true
            }
          ]
        }
      ]
    },
    data?.contacts
      ? getJuridicalData(data)
      : {
        title: 'LEGAL_CHARACTERISTICS',
        content: [
          {
            header: false,
            items: [
              { key: 'LEGAL_CHARACTERISTICS_DATA.FULL_NAME', value: data.ra_reference_book?.full_name },
              { key: 'LEGAL_CHARACTERISTICS_DATA.SHORT_NAME', value: data.ra_reference_book?.short_name },
              { key: 'LEGAL_CHARACTERISTICS_DATA.CODE_USREOU', value: data.ra_reference_book?.code_usreou },
              { key: 'LEGAL_CHARACTERISTICS_DATA.PUBLICATION_STATUS', value: data?.publication_status?.name }
            ]
          },
          {
            header: 'CONTACTS_DATA.LEGAL_ADDRESS',
            items: [
              { key: 'FIELDS.CITY', value: data.ra_address?.find((i) => i.address_type === 401)?.city },
              { key: 'CONTACTS_DATA.ADDRESS', value: data.ra_address?.find((i) => i.address_type === 401)?.address }
            ]
          },
          {
            header: 'LEGAL_CHARACTERISTICS_DATA.VALIDITY_PERIOD',
            items: [
              {
                key: 'CONTACTS_DATA.START_DATE',
                value: getDate(data.ra_address?.find((i) => i.address_type === 401)?.start_date_legal_characteristic)
              },
              {
                key: 'CONTACTS_DATA.END_DATE',
                value: getDate(data.ra_address?.find((i) => i.address_type === 401)?.end_date_legal_characteristic)
              }
            ]
          }
        ]
      },
    data?.contacts && data?.contacts?.postal_address
      ? getLongContactsData(data.contacts)
      : {
        title: 'CONTACTS',
        content: [
          {
            header: 'CONTACTS_DATA.ADDRESS',
            items: [
              {
                key: 'CONTACTS_DATA.MAILING_ADDRESS',
                value: data.ra_address?.find((i) => i.address_type === 402)?.address
              },
              {
                key: 'CONTACTS_DATA.ACTUAL_ADDRESS',
                value: data.ra_address?.find((i) => i.address_type === 403)?.address
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.OFFICE',
            items: [
              {
                key: 'CONTACTS_DATA.PHONE_NUMBER',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.phone
              },
              {
                key: 'CONTACTS_DATA.WORKING_HOURS',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.working_hours
              },
              {
                key: 'CONTACTS_DATA.WEB_SITE',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.web_site_url
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.email
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.HEAD',
            items: [
              {
                key: 'CONTACTS_DATA.FULL_NAME',
                value: data.ra_contact_data?.find((i) => i.position === 'director_initials')?.full_name
              },
              {
                key: 'CONTACTS_DATA.PHONE_NUMBER',
                value: data.ra_contact_data?.find((i) => i.position === 'director_initials')?.phone
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find((i) => i.position === 'director_initials')?.email
              },
              {
                key: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_AUTOMATE_USER',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.full_name
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.TECHNICAL_SUPPORT',
            items: [
              {
                key: 'CONTACTS_DATA.PHONE_NUMBER',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.phone
              },
              {
                key: 'CONTACTS_DATA.WORKING_HOURS',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.working_hours
              },
              {
                key: 'CONTACTS_DATA.WEB_SITE',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.web_site_url
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.email
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_REGISTR_USER',
            items: [
              {
                key: 'CONTACTS_DATA.FULL_NAME',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_registr_user_initials'
                )?.full_name
              },
              {
                key: 'CONTACTS_DATA.PHONE',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_registr_user_initials'
                )?.phone
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_registr_user_initials'
                )?.email
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_FUNC_USER',
            items: [
              {
                key: 'CONTACTS_DATA.FULL_NAME',
                value: data.ra_contact_data?.find((i) => i.position === 'Reconciliation_Accountable_func_user_initials')
                  ?.full_name
              },
              {
                key: 'CONTACTS_DATA.PHONE',
                value: data.ra_contact_data?.find((i) => i.position === 'Reconciliation_Accountable_func_user_initials')
                  ?.phone
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find((i) => i.position === 'Reconciliation_Accountable_func_user_initials')
                  ?.email
              }
            ]
          },
          {
            header: 'VALIDITY_PERIOD_OF_CONTACT_DATA',
            items: [
              {
                key: 'CONTACTS_DATA.START_DATE',
                value: getDate(
                  data.ra_contact_data?.find((i) => i.position === 'Reconciliation_Accountable_automate_user_initials')
                    ?.start_date_contact_data
                )
              },
              {
                key: 'CONTACTS_DATA.END_DATE',
                value: getDate(
                  data.ra_contact_data?.find((i) => i.position === 'Reconciliation_Accountable_automate_user_initials')
                    ?.end_date_contact_data
                )
              }
            ]
          }
        ]
      },
    {
      title: 'DATA_ABOUT_AUTOMATED_SYSTEM',
      content: [
        {
          header: 'AUTOMATED_SYSTEM_DATA.AS_PPKO',
          items: [
            { key: 'AUTOMATED_SYSTEM_DATA.NAME', value: data.automated_system_data?.name },
            { key: 'AUTOMATED_SYSTEM_DATA.PRODUCER', value: data.automated_system_data?.producer },
            { key: 'AUTOMATED_SYSTEM_DATA.OWNER', value: data.automated_system_data?.owner }
          ]
        },
        {
          header: 'AUTOMATED_SYSTEM_DATA.INTRODUCTION_INTO_INDUSTRIAL_OPPERATION',
          items: [
            {
              key: 'AUTOMATED_SYSTEM_DATA.NUMBER_ACT_OF_COMMISSIONING',
              value: data.automated_system_data?.number_act_of_commissioning
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.DATA_OF_COMMISSIONING',
              value: getDate(data.automated_system_data?.data_of_commissioning)
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.MAIN_TECH_CHARACTERISTIC',
              value: data.automated_system_data?.main_tech_characteristic
            }
          ]
        },
        {
          header: 'REGISTRATION_DATA',
          items: [
            {
              key: 'AUTOMATED_SYSTEM_DATA.TEST_RESULT_AS',
              value:
                typeof data.testing_data_as?.test_result_as === 'object'
                  ? data.testing_data_as?.test_result_as?.test_result
                  : CONSTANTS.TEST_RESULT_STATUSES[data.testing_data_as?.test_result_as]
            },
            { key: 'AUTOMATED_SYSTEM_DATA.TEST_START_DATE', value: getDate(data.testing_data_as?.test_start_date) },
            { key: 'AUTOMATED_SYSTEM_DATA.TEST_END_DATE', value: getDate(data.testing_data_as?.test_end_date) },
            { key: 'AUTOMATED_SYSTEM_DATA.EIS_TESTING_MMS', value: data.eis_testing_mms },
            {
              key: 'AUTOMATED_SYSTEM_DATA.AVAILABILITY_COMMENTS',
              value: CONSTANTS.CHOICES_COMMENT[data.testing_data_as?.availability_comments]
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.DATE_SUBMISSIONS_COMMENTS',
              value: getDate(data.testing_data_as?.date_submissions_comments)
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.DATE_ELIMINATION_COMMENTS',
              value: getDate(data.testing_data_as?.date_elimination_comments)
            }
          ]
        }
      ]
    },
    {
      title: 'PPKO_CHECK_RESULT',
      content: [
        {
          header: false,
          columns: [
            { label: 'PPKO_CHECK_RESULT_DATA.LAST_CHECK_DATE', id: 'date_start' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK_TYPE', id: 'audit_type', translationKey: 'AUDIT_TYPES' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK', id: 'notice', translationKey: 'CONTROLS' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK_STATUS', id: 'completion', translationKey: 'AUDIT_COMPLETION' }
          ],
          data: data?.ra_check
        }
      ]
    },
    {
      title: 'ADDITIONAL_INFO',
      hidden: !checkPermissions('PPKO.DETAIL.FUNCTIONS.SHOW_ADDITIONAL_INFO', 'АКО_ППКО'),
      content: [
        {
          header: false,
          items: [
            {
              key: 'ADDITIONAL_INFO_DATA.TECH_INFO_FOR_MMS',
              value: data.additional_data?.tech_info_for_mms
            },
            {
              key: 'ADDITIONAL_INFO_DATA.OTHER_TECH_INFO',
              value: data.additional_data?.other_tech_info
            }
          ]
        },
        {
          header: 'ADDITIONAL_INFO_DATA.VALIDITY_PERIOD',
          items: [
            {
              key: 'ADDITIONAL_INFO_DATA.START_DATE',
              value: getDate(data.additional_data?.start_date_tech_info)
            },
            {
              key: 'ADDITIONAL_INFO_DATA.END_DATE',
              value: getDate(data.additional_data?.end_date_tech_info)
            }
          ]
        }
      ]
    }
  ];
};

export const getAccordionShort = (data, CONSTANTS) => {
  return [
    {
      title: 'REGISTRATION_DATA',
      content: [
        {
          header: false,
          items: [
            { key: 'PPKO_REGISTRATION_DATA.FULL_NAME', value: data.full_name },
            {
              key: 'LEGAL_CHARACTERISTICS_DATA.SHORT_NAME',
              value: data.short_name
            },
            { key: 'LEGAL_CHARACTERISTICS_DATA.CODE_USREOU', value: data.code_usreou },
            { key: 'PPKO_REGISTRATION_DATA.EIC_CODE_TYPE_X_PPKO', value: data.eic },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_REGISTRATION_RA',
              value: getDate(data.date_registration_ra)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.DATE_CANCELLATION_OF_REGISTRATION_RA',
              value: getDate(data.date_cancellation_of_registration_ra)
            },
            {
              key: 'PPKO_REGISTRATION_DATA.REGISTRATION_STATUS_PPKO',
              value: `PPKO_CONSTANTS.REGISTRATION_STATUSES.${data.current_registration_status?.code}`
            },
            {
              key: 'PPKO_REGISTRATION_DATA.RE_REGISTRATION_DATE',
              value: getDate(data?.re_registration_date)
            }
          ]
        }
      ]
    },
    data?.contacts && data?.contacts?.legal_address
      ? getShortContactsData(data.contacts)
      : {
        title: 'CONTACTS',
        content: [
          {
            header: 'CONTACTS_DATA.RA_ADDRESS',
            items: [
              {
                key: 'FIELDS.CITY',
                value: data?.ra_address?.city
              },
              {
                key: 'CONTACTS_DATA.LEGAL_ADDRESS',
                value: data?.ra_address?.address
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.OFFICE_CONTACTS',
            items: [
              {
                key: 'CONTACTS_DATA.PHONE_NUMBER',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.phone
              },
              {
                key: 'CONTACTS_DATA.WEB_SITE',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.web_site_url
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.email
              },
              {
                key: 'CONTACTS_DATA.WORKING_HOURS',
                value: data.ra_contact_data?.find((i) => i.position === 'office')?.working_hours
              }
            ]
          },
          {
            header: 'CONTACTS_DATA.TECHICAL_SUPPORT',
            items: [
              {
                key: 'CONTACTS_DATA.PHONE_NUMBER',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.phone
              },
              {
                key: 'CONTACTS_DATA.WEB_SITE',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.web_site_url
              },
              {
                key: 'CONTACTS_DATA.EMAIL',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.email
              },
              {
                key: 'CONTACTS_DATA.WORKING_HOURS',
                value: data.ra_contact_data?.find(
                  (i) => i.position === 'Reconciliation_Accountable_automate_user_initials'
                )?.working_hours
              }
            ]
          }
        ]
      },
    {
      title: 'DATA_ABOUT_AUTOMATED_SYSTEM',
      content: [
        {
          header: 'AUTOMATED_SYSTEM_DATA.AS_PPKO',
          items: [
            { key: 'AUTOMATED_SYSTEM_DATA.NAME', value: data.automated_system_data?.name },
            { key: 'AUTOMATED_SYSTEM_DATA.PRODUCER', value: data.automated_system_data?.producer },
            { key: 'AUTOMATED_SYSTEM_DATA.OWNER', value: data.automated_system_data?.owner }
          ]
        },
        {
          header: 'AUTOMATED_SYSTEM_DATA.INTRODUCTION_INTO_INDUSTRIAL_OPPERATION',
          items: [
            {
              key: 'AUTOMATED_SYSTEM_DATA.NUMBER_ACT_OF_COMMISSIONING',
              value: data.automated_system_data?.number_act_of_commissioning
            }
          ]
        },
        {
          header: 'REGISTRATION_DATA',
          items: [
            {
              key: 'AUTOMATED_SYSTEM_DATA.TEST_RESULT_AS',
              value:
                typeof data.testing_data_as?.test_result_as === 'object'
                  ? data.testing_data_as?.test_result_as?.test_result
                  : CONSTANTS.TEST_RESULT_STATUSES[data.testing_data_as?.test_result_as]
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.TEST_START_DATE',
              value: getDate(data.testing_data_as?.test_start_date)
            },
            {
              key: 'AUTOMATED_SYSTEM_DATA.TEST_END_DATE',
              value: getDate(data.testing_data_as?.test_end_date)
            }
          ]
        }
      ]
    },
    {
      title: 'PPKO_CHECK_RESULT',
      content: [
        {
          header: false,
          columns: [
            { label: 'PPKO_CHECK_RESULT_DATA.LAST_CHECK_DATE', id: 'date_start' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK_TYPE', id: 'audit_type', translationKey: 'AUDIT_TYPES' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK', id: 'notice', translationKey: 'CONTROLS' },
            { label: 'PPKO_CHECK_RESULT_DATA.CHECK_STATUS', id: 'completion', translationKey: 'AUDIT_COMPLETION' }
          ],
          data: data?.ra_check
        }
      ]
    }
  ];
};

export const getLongContactsData = (data) => (
  {
    title: 'CONTACTS',
    content: [
      {
        header: 'CONTACTS_DATA.MAILING_ADDRESS',
        items: [
          {
            key: 'CONTACTS_DATA.ZIP_CODE',
            value: data?.postal_address?.zip_code
          },
          {
            key: 'CONTACTS_DATA.REGION',
            value: data?.postal_address?.region
          },
          {
            key: 'CONTACTS_DATA.DISTRICT',
            value: data?.postal_address?.district
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_TYPE',
            value: data?.postal_address?.settlement_type
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_NAME',
            value: data?.postal_address?.settlement_name
          },
          {
            key: 'CONTACTS_DATA.STREET_TYPE',
            value: data?.postal_address?.street_type
          },
          {
            key: 'CONTACTS_DATA.STREET_NAME',
            value: data?.postal_address?.street_name
          },
          {
            key: 'CONTACTS_DATA.BUILDING_NUMBER',
            value: data?.postal_address?.building_number
          },
          {
            key: 'CONTACTS_DATA.ROOM_TYPE',
            value: data?.postal_address?.room_type
          },
          {
            key: 'CONTACTS_DATA.ROOM_NUMBER',
            value: data?.postal_address?.room_number
          },
          {
            key: 'CONTACTS_DATA.NOTE',
            value: data?.postal_address?.note
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.ACTUAL_ADDRESS',
        items: [
          {
            key: 'CONTACTS_DATA.ZIP_CODE',
            value: data?.actual_address?.zip_code
          },
          {
            key: 'CONTACTS_DATA.REGION',
            value: data?.actual_address?.region
          },
          {
            key: 'CONTACTS_DATA.DISTRICT',
            value: data?.actual_address?.district
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_TYPE',
            value: data?.actual_address?.settlement_type
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_NAME',
            value: data?.actual_address?.settlement_name
          },
          {
            key: 'CONTACTS_DATA.STREET_TYPE',
            value: data?.actual_address?.street_type
          },
          {
            key: 'CONTACTS_DATA.STREET_NAME',
            value: data?.actual_address?.street_name
          },
          {
            key: 'CONTACTS_DATA.BUILDING_NUMBER',
            value: data?.actual_address?.building_number
          },
          {
            key: 'CONTACTS_DATA.ROOM_TYPE',
            value: data?.actual_address?.room_type
          },
          {
            key: 'CONTACTS_DATA.ROOM_NUMBER',
            value: data?.actual_address?.room_number
          },
          {
            key: 'CONTACTS_DATA.NOTE',
            value: data?.actual_address?.note
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.OFFICE',
        items: [
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.office?.phone
          },
          {
            key: 'CONTACTS_DATA.WORKING_HOURS',
            value: data?.office?.working_hours
          },
          {
            key: 'CONTACTS_DATA.WEB_SITE',
            value: data?.office?.web
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.office?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.office?.email_addl
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.HEAD',
        items: [
          {
            key: 'CONTACTS_DATA.FULL_NAME',
            value: data?.manager?.full_name
          },
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.manager?.phone
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.manager?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.manager?.email_addl
          }
        ]
      },
      {
        header: 'PERSON_AUTHORIZED_TO_REGISTER_PPKO',
        items: [
          {
            key: 'CONTACTS_DATA.FULL_NAME',
            value: data?.registrator?.full_name
          },
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.registrator?.phone
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.registrator?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.registrator?.email_addl
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_FUNC_USER',
        items: [
          {
            key: 'CONTACTS_DATA.FULL_NAME',
            value: data?.responsible?.full_name
          },
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.responsible?.phone
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.responsible?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.responsible?.email_addl
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.TECHNICAL_SUPPORT',
        items: [
          {
            key: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_AUTOMATE_USER',
            value: data?.support?.full_name
          },
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.support?.phone
          },
          {
            key: 'CONTACTS_DATA.WORKING_HOURS',
            value: data?.support?.working_hours
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.support?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.support?.email_addl
          }
        ]
      },
      {
        header: 'VALIDITY_PERIOD_OF_CONTACT_DATA',
        items: [
          {
            key: 'ADDITIONAL_INFO_DATA.START_DATE',
            value: getDate(data?.valid_from)
          },
          {
            key: 'ADDITIONAL_INFO_DATA.END_DATE',
            value: getDate(data?.valid_to)
          }
        ]
      }
    ]
  }
);

export const getShortContactsData = (data) => (
  {
    title: 'CONTACTS',
    content: [
      {
        header: 'CONTACTS_DATA.LEGAL_ADDRESS',
        items: [
          {
            key: 'CONTACTS_DATA.ZIP_CODE',
            value: data?.legal_address?.zip_code
          },
          {
            key: 'CONTACTS_DATA.REGION',
            value: data?.legal_address?.region
          },
          {
            key: 'CONTACTS_DATA.DISTRICT',
            value: data?.legal_address?.district
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_TYPE',
            value: data?.legal_address?.settlement_type
          },
          {
            key: 'CONTACTS_DATA.SETTLEMENT_NAME',
            value: data?.legal_address?.settlement_name
          },
          {
            key: 'CONTACTS_DATA.STREET_TYPE',
            value: data?.legal_address?.street_type
          },
          {
            key: 'CONTACTS_DATA.STREET_NAME',
            value: data?.legal_address?.street_name
          },
          {
            key: 'CONTACTS_DATA.BUILDING_NUMBER',
            value: data?.legal_address?.building_number
          },
          {
            key: 'CONTACTS_DATA.ROOM_TYPE',
            value: data?.legal_address?.room_type
          },
          {
            key: 'CONTACTS_DATA.ROOM_NUMBER',
            value: data?.legal_address?.room_number
          },
          {
            key: 'CONTACTS_DATA.NOTE',
            value: data?.legal_address?.note
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.OFFICE',
        items: [
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.office?.phone
          },
          {
            key: 'CONTACTS_DATA.WORKING_HOURS',
            value: data?.office?.working_hours
          },
          {
            key: 'CONTACTS_DATA.WEB_SITE',
            value: data?.office?.web
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.office?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.office?.email_addl
          }
        ]
      },
      {
        header: 'CONTACTS_DATA.TECHNICAL_SUPPORT',
        items: [
          {
            key: 'CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_AUTOMATE_USER',
            value: data?.support?.full_name
          },
          {
            key: 'CONTACTS_DATA.PHONE_NUMBER',
            value: data?.support?.phone
          },
          {
            key: 'CONTACTS_DATA.WORKING_HOURS',
            value: data?.support?.working_hours
          },
          {
            key: 'CONTACTS_DATA.EMAIL',
            value: data?.support?.email
          },
          {
            key: 'CONTACTS_DATA.ADDITIONAL_EMAIL',
            value: data?.support?.email_addl
          }
        ]
      }
    ]
  }
);

export const getJuridicalData = (data) => {
  return {
    title: 'LEGAL_CHARACTERISTICS',
    content: [
      {
        header: false,
        items: [
          { key: 'LEGAL_CHARACTERISTICS_DATA.FULL_NAME', value: data.ra_reference_book?.full_name },
          {
            key: 'LEGAL_CHARACTERISTICS_DATA.SHORT_NAME',
            value: data.ra_reference_book?.short_name
          },
          { key: 'LEGAL_CHARACTERISTICS_DATA.CODE_USREOU', value: data.ra_reference_book?.code_usreou },
          { key: 'LEGAL_CHARACTERISTICS_DATA.PUBLICATION_STATUS', value: data?.publication_status?.name }
        ]
      },
      data?.contacts?.legal_address
        ? {
          header: 'CONTACTS_DATA.LEGAL_ADDRESS',
          items: [
            {
              key: 'CONTACTS_DATA.ZIP_CODE',
              value: data?.contacts?.legal_address?.zip_code
            },
            {
              key: 'CONTACTS_DATA.REGION',
              value: data?.contacts?.legal_address?.region
            },
            {
              key: 'CONTACTS_DATA.DISTRICT',
              value: data?.contacts?.legal_address?.district
            },
            {
              key: 'CONTACTS_DATA.SETTLEMENT_TYPE',
              value: data?.contacts?.legal_address?.settlement_type
            },
            {
              key: 'CONTACTS_DATA.SETTLEMENT_NAME',
              value: data?.contacts?.legal_address?.settlement_name
            },
            {
              key: 'CONTACTS_DATA.STREET_TYPE',
              value: data?.contacts?.legal_address?.street_type
            },
            {
              key: 'CONTACTS_DATA.STREET_NAME',
              value: data?.contacts?.legal_address?.street_name
            },
            {
              key: 'CONTACTS_DATA.BUILDING_NUMBER',
              value: data?.contacts?.legal_address?.building_number
            },
            {
              key: 'CONTACTS_DATA.ROOM_TYPE',
              value: data?.contacts?.legal_address?.room_type
            },
            {
              key: 'CONTACTS_DATA.ROOM_NUMBER',
              value: data?.contacts?.legal_address?.room_number
            },
            {
              key: 'CONTACTS_DATA.NOTE',
              value: data?.contacts?.legal_address?.note
            }
          ]
        }
        : {
          header: 'CONTACTS_DATA.LEGAL_ADDRESS',
          items: [
            { key: 'FIELDS.CITY', value: data.ra_address?.find((i) => i.address_type === 401)?.city },
            { key: 'CONTACTS_DATA.ADDRESS', value: data.ra_address?.find((i) => i.address_type === 401)?.address }
          ]
        },
      {
        header: 'LEGAL_CHARACTERISTICS_DATA.VALIDITY_PERIOD',
        items: [
          {
            key: 'ADDITIONAL_INFO_DATA.START_DATE',
            value: getDate(data.start_date_quantity_ap)
          },
          {
            key: 'ADDITIONAL_INFO_DATA.END_DATE',
            value: getDate(data.end_date_quantity_ap)
          }
        ]
      }
    ]
  };
};