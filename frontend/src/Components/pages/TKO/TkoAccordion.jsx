import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Accordion, AccordionDetails, AccordionSummary, Box, styled, Typography } from '@mui/material';
import propTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeatilsModal } from './DetailsModal';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { useMemo } from 'react';
import moment from 'moment';
import InfoIcon from '@mui/icons-material/Info';
import { LightTooltip } from '../../Theme/Components/LightTooltip';

export const useStyles = makeStyles(() => ({
  detail: {
    padding: 16,
    display: 'block'
  },
  contentItem: {
    display: 'flex',
    gap: 12,
    padding: '12px 16px 12px 0'
  },
  subHeader: {
    fontSize: 15,
    color: '#567691',
    fontWeight: 600,
    padding: '10px 0'
  },
  key: {
    flex: 1,
    fontSize: 13,
    fontWeight: 300
  },
  value: {
    flex: 1,
    fontSize: 13,
    fontWeight: 500,
    marginLeft: 8,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  detailIfoValue: {
    display: 'flex',
    justifyContent: 'end',
    flex: 2.5,
    fontSize: 13,
    fontWeight: 500,
    marginLeft: 8,
    maxWidth: '100%',
    overflow: 'hidden',
    textAlign: 'end'
  }
}));

const KeyText = styled('span')({
  flex: 1,
  fontSize: 13,
  fontWeight: 300,
  color: '#567691',
});

const Item = ({ item, index }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const value = (item.mapLabel ? item.mapLabel(item.obj[item.field]) : item.obj[item.field]) || t('NOT_SPECIFIED');
  const formatedValue = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(value)
    ? moment(value).unix() > 9000000000
      ? t('UNLIMITED')
      : moment(value).format(item.type === 'datetime' ? 'DD-MM-YYYY HH:mm' : 'DD-MM-YYYY')
    : Array.isArray(value)
    ? value.join(', ')
    : value;

  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Box className={classes.contentItem}>
        <KeyText>
          {
            item?.is_inherited &&
            <LightTooltip
              title={t('CHARACTERISTICS.IS_INHERITED')}
              disableTouchListener
              disableFocusListener
              arrow
              sx={{maxWidth: 170, textAlign: 'center'}}
            >
              <InfoIcon sx={{fontSize: 13, mr: 0.5, verticalAlign: 'text-top'}} data-marker={'IS_INHERITED'} />
            </LightTooltip>
          }
          {t(item.title)}:
        </KeyText>
        <Typography
          component={'span'}
          className={classes.value}
          title={formatedValue}
          onClick={item.action}
          sx={
            item.action && {
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.7
              }
            }
          }
        >
          {formatedValue}
        </Typography>
      </Box>
    </Grid>
  );
};

const TkoAccordion = ({ section, sectionIndex }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hasValidField = (content) => {
    return content.some((item) => {
      if (item?.items) {
        return item.items.some((i) => i.obj && i.field in i.obj);
      }
      if (item?.content) {
        return hasValidField(item.content);
      }
      return false;
    });
  };

  const showSection = useMemo(() => {
    return section.content ? hasValidField(section.content) : false;
  }, [section]);

  return (
    showSection && (
      <Accordion>
        <AccordionSummary aria-controls={`panel${sectionIndex}a-content`} id={`panel${sectionIndex}a-header`}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div>{section.titleEic?.eicCode ? section.titleEic.eicCode : t(section.title)}</div>
            <div>
              {section.titleEic?.uid && (
                <CircleButton
                  type={'link'}
                  size={'small'}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tko/${section.titleEic.uid}`, { state: { from: { pathname } } });
                  }}
                />
              )}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {section.content.map((content, contentIndex) => {
            if (content.accordion) {
              return (
                <TkoAccordion
                  key={`subSection-${contentIndex}`}
                  section={content}
                  sectionIndex={`-subSection-${contentIndex}`}
                />
              );
            }
            return (
              <div
                className={'content'}
                style={{ width: '100%' }}
                key={`subSection-${contentIndex}`}
                data-marker={t(section.title)}
              >
                <Grid container>
                  {content.header && content.items.some((i) => i.obj && i.field in i.obj) && (
                    <Grid item xs={12} key={`subHeader-${contentIndex}`}>
                      <div className={classes.subHeader}>{t(content.header)}</div>
                    </Grid>
                  )}
                  {content.items.map(
                    (item, index) =>
                      item.obj && item.field in item.obj && <Item item={item} index={index} key={index} />
                  )}
                </Grid>
                {content.getDetailInfoParameter && (
                  <Box display={'flex'} justifyContent={'end'}>
                    <DeatilsModal id={content.getDetailInfoParameter} />
                  </Box>
                )}
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    )
  );
};

TkoAccordion.propTypes = {
  section: propTypes.shape({
    title: propTypes.string.isRequired,
    visible: propTypes.bool,
    content: propTypes.array.isRequired
  }).isRequired,
  sectionIndex: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired
};

export default TkoAccordion;
