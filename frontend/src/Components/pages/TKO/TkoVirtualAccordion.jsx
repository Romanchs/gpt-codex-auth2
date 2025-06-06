import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack } from '@mui/material';
import propTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../Theme/Buttons/CircleButton';

export const useStyles = makeStyles(() => ({
  detail: {
    padding: 16,
    display: 'block'
  },
  contentItem: {
    display: 'flex',
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

const RelatedItem = ({ lengthItems, contentIndex, item, index }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={12} md={12} key={index}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: '100%',
          padding: lengthItems === 1 ? 0 : '15px 0',
          borderBottom: lengthItems - 1 === contentIndex ? 'none' : '1px solid #ededed'
        }}
      >
        <Typography
          component={'span'}
          className={classes.value}
          sx={{ flexGrow: 1, color: '#4A5B7A' }}
          title={item.value || t('NOT_SPECIFIED')}
        >
          {item.value}
        </Typography>
        <CircleButton
          type={'link'}
          size={'small'}
          onClick={() => {
            navigate(`/tko/${item.uid}`, { state: { from: { pathname } } });
          }}
        />
      </Stack>
    </Grid>
  );
};

const TkoVirtualAccordion = ({ section, sectionIndex }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!section.visible) return null;
  return (
    <Accordion>
      <AccordionSummary aria-controls={`panel${sectionIndex}a-content`} id={`panel${sectionIndex}a-header`}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div>{section.titleEic?.eicCode ? section.titleEic.eicCode : section.title}</div>
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
      <AccordionDetails sx={{ padding: section.content.length > 1 ? '5px 16px' : '16px' }}>
        {section.content.map((content, contentIndex) => {
          if (content.accordion) {
            return (
              <TkoVirtualAccordion
                key={`subSection-${contentIndex}`}
                section={content}
                sectionIndex={`-subSection-${contentIndex}`}
              />
            );
          }
          return (
            <div className={'content'} style={{ width: '100%' }} key={contentIndex}>
              <Grid container>
                {content.items.map(
                  ({ visible = true, ...item }, index) =>
                    visible !== false && (
                      <RelatedItem
                        key={index}
                        item={item}
                        contentIndex={contentIndex}
                        index={index}
                        lengthItems={section.content.length}
                      />
                    )
                )}
              </Grid>
            </div>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

TkoVirtualAccordion.propTypes = {
  section: propTypes.shape({
    title: propTypes.string.isRequired,
    visible: propTypes.bool.isRequired,
    content: propTypes.array.isRequired
  }).isRequired,
  sectionIndex: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired
};

export default TkoVirtualAccordion;
