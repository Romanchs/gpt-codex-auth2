import NoteAddRounded from '@mui/icons-material/NoteAddRounded';
import { Grid, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useState } from 'react';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import ReportsModal from './ReportsModal';
import { useCreateReportsMutation, useGetDataReportsQuery } from './api';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../services/actionsLog/useImportFileLog';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { BsusModal } from './BsusModal';

const ListReportsTab = ({ toFilesTab }) => {
  const { t } = useTranslation();
  const [createReport, { error }] = useCreateReportsMutation({ fixedCacheKey: 'reports_createReport' });
  const { data } = useGetDataReportsQuery({ tab: 'list' });
  const [openSettings, setOpenSettings] = useState(null);
  const [openBsusSettings, setOpenBsusSettings] = useState(null);
  const classes = useRowStyles();

  const importFileLog = useImportFileLog();

  const handleCreateReport = ({ code, params }) => {
    if (!params) {
      createReport({ code }).then(() => {
        importFileLog();
        toFilesTab();
      });
    } else {
      switch (code) {
        case 'aggregated-group-of-bsus-ap':
          setOpenBsusSettings({ code, params });
          return;
        default:
          setOpenSettings({ code, params });
      }
    }
  };

  const handleCreateReportByModal = async ({ code, params }) => {
    const { error } = await createReport({ code, params });
    if (!error) {
      importFileLog();
      toFilesTab();
    }
  };

  return (
    <>
      <Box>
        {data?.length === 0 && <Box className={classes.empty}>{t('THERE_ARE_NO_REPORTS_FOR_YOUR_ROLE')}...</Box>}
        {data?.map((data, index) => (
          <Row
            key={`row-${index}-${data?.reports[0]?.code}`}
            data={data}
            sectionIndex={index}
            handleCreateReport={handleCreateReport}
          />
        ))}
      </Box>
      <BsusModal
        title={t('REPORT_GENERATION_PARAMETERS')}
        openModal={Boolean(openBsusSettings)}
        setOpenModal={setOpenBsusSettings}
        handleSubmit={handleCreateReportByModal}
        reportSettings={openBsusSettings || {}}
        error={error}
      />
      <ReportsModal
        title={t('REPORT_GENERATION_PARAMETERS')}
        openModal={Boolean(openSettings)}
        setOpenModal={setOpenSettings}
        handleSubmit={handleCreateReportByModal}
        reportSettings={openSettings || {}}
        error={error}
      />
    </>
  );
};

const Row = ({ data, sectionIndex, handleCreateReport }) => {
  const { t, i18n } = useTranslation();
  const classes = useRowStyles();

  return (
    <Accordion>
      <AccordionSummary
        aria-controls={`panel${sectionIndex}a-content`}
        id={`panel${sectionIndex}a-header`}
        data-marker={'table-row'}
      >
        <span className={classes.heading}>{data?.[`name_${i18n.language}`]}</span>
      </AccordionSummary>
      <AccordionDetails data-marker={'table-details'}>
        <Box margin={1}>
          <Grid container data-marker={data?.[`name_${i18n.language}`]}>
            {data?.reports.map(({ code, params, aggregation_data, ...props }, index) => (
              <Grid container className={classes.body} key={`inner-row-${index}`}>
                <Grid item className={classes.detailName}>
                  <Grid item data-marker={aggregation_data ? 'status_pre_aggr' : 'status_aggr_after'}>
                    <ReportStatus status={aggregation_data} />
                  </Grid>
                  <Grid item data-marker={'name'}>
                    {props?.[`name_${i18n.language}`]}
                  </Grid>
                </Grid>
                <Grid item className={classes.createButton} data-marker={'create'}>
                  <CircleButton
                    icon={<NoteAddRounded />}
                    color={'green'}
                    size={'small'}
                    title={t('CONTROLS.CREATE_REPORT')}
                    onClick={() => handleCreateReport({ code, params })}
                    dataMarker={'create-report'}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const ReportStatus = ({ status }) => {
  const classes = useStatusStyles();
  return <div className={classes.circle + ' ' + classes[status ? 'circle--orange' : 'circle--green']}></div>;
};

export default ListReportsTab;

const useRowStyles = makeStyles(() => ({
  empty: {
    display: 'flex',
    justifyContent: 'center',
    color: '#777',
    padding: '4px 0'
  },
  body: {
    justifyContent: 'space-between',
    borderBottom: '1px solid #E5EAEE',
    '& > *': {
      color: '#567691',
      fontSize: 12,
      fontWeight: 400,
      padding: '8px 0'
    }
  },
  detail: {
    padding: 16,
    paddingTop: 0,
    display: 'block'
  },
  detailName: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '20px'
  },
  createButton: {
    textAlign: 'right',
    paddingRight: 24,
    '& > span > button': {
      width: 24,
      height: 24
    }
  }
}));

const useStatusStyles = makeStyles({
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#aaaaaa'
  },
  'circle--green': {
    backgroundColor: '#008C0C',
    boxShadow: '0px 0px 4px 2px rgba(0, 140, 12, 0.25)'
  },
  'circle--orange': {
    backgroundColor: '#F28C60',
    boxShadow: '0px 0px 4px 2px rgba(242, 140, 96, 0.25)'
  }
});
