import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { RolesAccordion } from './RolesAccordion';
import { useLazyDownloadPpkoByIdQuery, usePpkoByIdQuery, usePpkoConstantsQuery } from './api';
import { getAccordionLong, getAccordionShort, getDate } from './utils';
import { CONTACTS_PPKO_TAGS } from '../../../../services/actionsLog/constants';

const PpkoDetail = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [accordion, setAccordion] = useState([]);
  const { data: selectedPpko, isFetching: loading } = usePpkoByIdQuery(id, { skip: !id });
  const { data: CONSTANTS } = usePpkoConstantsQuery(undefined, { skip: !selectedPpko });
  const [downloadPpkoById, { isFetching: downloading }] = useLazyDownloadPpkoByIdQuery();
  const exportFileLog = useExportFileLog(CONTACTS_PPKO_TAGS);

  const prepareAccordion = useCallback(() => {
    const sections = selectedPpko.full_form
      ? getAccordionLong(selectedPpko.data, CONSTANTS)
      : getAccordionShort(selectedPpko.data, CONSTANTS);

    return sections;
  }, [selectedPpko, CONSTANTS]);

  useEffect(() => {
    if (!selectedPpko || !CONSTANTS) return;

    const accordion = prepareAccordion();
    setAccordion(accordion);
  }, [CONSTANTS, prepareAccordion, selectedPpko]);

  const handleDownload = () => {
    if (!selectedPpko?.data) return;
    const name = `DATAHUB-ППКО-${
      selectedPpko?.data?.ra_reference_book?.short_name || selectedPpko?.data?.short_name || ''
    }-${moment().format('DD-MM-YYYY')}`;
    downloadPpkoById({ id, name }).then(() => exportFileLog());
  };

  const handleReplaceDocument = () => {
    navigate(`/ppko/documentation/${id}`);
  };

  // const handleReplaceCheck = () => {
  //   if (selectedPpko?.data?.ra_check?.id) {
  //     navigate(`/ppko/check/${selectedPpko?.data?.ra_check?.id}#${id}`);
  //   } else {
  //     navigate(`/ppko/check/${id}#`);
  //   }
  // };

  const handleEdit = () => {
    navigate(`/ppko/edit/${id}`);
  };

  const getAccordionItems = (items) =>
    items?.map((item, index) => {
      return (
        <Grid item xs={12} sm={item.full ? 12 : 6} md={item.full ? 12 : 4} key={index}>
          <Box sx={styles.contentItem}>
            <Box component="span" sx={styles.key}>
              {t(item.key)}:
            </Box>
            <Box component="span" sx={styles.value}>
              {item.link && item.data ? (
                <a href={item.value} target={'_blank'} rel="noreferrer">
                  {item.value}
                </a>
              ) : item.value && i18n.exists(item.value.toString()) ? (
                t(item.value.toString())
              ) : (
                item.value || '---'
              )}
            </Box>
          </Box>
        </Grid>
      );
    });

  const getAccordionTable = (columns, data) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map(({ label, id, width }, index) => (
              <TableCell key={'head-cell' + index} data-marker={'head--' + id} style={{ width }} sx={styles.head}>
                {t(label)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(data) &&
            data?.map((d, i) => (
              <TableRow key={i} sx={styles.body}>
                {columns.map(({ id, translationKey }, index) => (
                  <TableCell key={'cell' + index} data-marker={'cell--' + id}>
                    {id === 'date_start'
                      ? getDate(d?.[id])
                      : translationKey
                      ? t(`${translationKey}.${d?.[id]}`)
                      : d?.[id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Page
      pageName={t('PAGES.CONTACTS_PPKO')}
      backRoute={'/ppko'}
      loading={loading}
      acceptPermisions={'PPKO.ACCESS'}
      rejectRoles={['АКО_Суперечки', 'АКО_Перевірки', 'ГарПок']}
      faqKey={'INFORMATION_BASE__PPKO_CONTACTS'}
      controls={
        <>
          <CircleButton
            onClick={handleDownload}
            type={'download'}
            title={t('CONTROLS.DOWNLOAD')}
            disabled={downloading || loading}
          />
          {checkPermissions('PPKO.DETAIL.CONTROLS.DOCUMENTATION', 'АКО_ППКО') && (
            <CircleButton
              type={'document'}
              title={t('CONTROLS.DOCUMENTATION')}
              onClick={handleReplaceDocument}
              disabled={downloading || loading}
            />
          )}
          {checkPermissions('PPKO.DETAIL.CONTROLS.EDIT', 'АКО_ППКО') && (
            <CircleButton
              type={'edit'}
              color={'green'}
              title={t('CONTROLS.EDIT')}
              onClick={handleEdit}
              disabled={downloading || loading}
            />
          )}
          {checkPermissions('PPKO.DETAIL.CONTROLS.HISTORY', 'АКО_ППКО') && (
            <CircleButton
              title={t('PAGES.HISTORY')}
              color={'blue'}
              icon={<AssignmentRounded />}
              onClick={() => navigate(`/ppko/history/${id}`)}
              dataMarker={'to-journal'}
            />
          )}
        </>
      }
    >
      {accordion.map(
        (section, sectionIndex) =>
          !section?.hidden && (
            <Accordion key={'ppko-detail' + sectionIndex}>
              <AccordionSummary
                aria-controls={`panel${sectionIndex}-ppko-content`}
                id={`panel${sectionIndex}-ppko-header`}
              >
                <Typography>{t(section.title)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  {section.content.map((content, contentIndex) => (
                    <Box className={'content'} style={{ width: '100%' }} data-marker={t(section.title)} key={'ppko-detail-content' + contentIndex}>
                      <Grid container>
                        {content.header && (
                          <Grid item xs={12} key={`subHeader-${contentIndex}`}>
                            <Box sx={styles.subHeader}>{t(content.header)}</Box>
                          </Grid>
                        )}
                        {content.items && getAccordionItems(content.items)}
                        {content.columns && getAccordionTable(content.columns, content.data)}
                      </Grid>
                    </Box>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )
      )}
      {selectedPpko?.data?.ra_roles?.length > 0 && <RolesAccordion roles={selectedPpko?.data?.ra_roles} />}
    </Page>
  );
};

export default PpkoDetail;

const styles = {
  head: {
    fontWeight: 600,
    fontSize: '15px !important',
    borderBottom: '1px solid #567691 !important',
    padding: '10px !important',
    color: '#567691'
  },
  body: {
    '& > *': {
      color: '#567691 !important',
      fontSize: 14,
      fontWeight: 400,
      padding: '10px'
    }
  },
  contentItem: {
    display: 'flex',
    padding: '12px 16px 12px 0'
  },
  key: {
    fontSize: 13,
    fontWeight: 300,
    width: 150,
    minWidth: 150
  },
  value: {
    fontSize: 13,
    fontWeight: 500,
    marginLeft: 1,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& > a': {
      display: 'block',
      maxWidth: '150px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  subHeader: {
    fontSize: 15,
    color: '#567691',
    fontWeight: 600,
    padding: '10px 0'
  }
};
