import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getDirectoryList } from '../../../actions/directoriesActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    '&>*': {
      lineHeight: '32px',
      borderBottom: '1px solid #E9EDF6'
    }
  }
}));

export const DIRECTORIES_ACCEPT_ROLES = ['АКО...', 'АТКО', 'ГарПок', 'СВБ', 'ОДКО', 'ОЗКО', 'ОМ'];

const Directories = () => {
  const { t, i18n } = useTranslation();
  const isUA = i18n.language === 'ua';
  const dispatch = useDispatch();
  const { directoriesList, loading } = useSelector((s) => s.directories);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkPermissions('DIRECTORIES.ACCESS', DIRECTORIES_ACCEPT_ROLES)) {
      dispatch(getDirectoryList());
    } else {
      navigate('/');
    }
  }, [dispatch, navigate]);

  const handleClick = (directory) => {
    const codes = {
      '001-01': 'suppliers',
      '001-02': 'gridAccessProvider',
      '001-03': 'companies',
      Z_BINDING: 'z-binding',
      '106-80': 'bsusAggregatedGroup',
      '202-11': `specialMeteringGridArea?uid=${directory?.uid}`,
    };
    navigate(`/directories/${codes[directory.code] || directory?.uid}`);
  };

  return (
    <Page
      pageName={t('PAGES.DIRECTORIES')}
      acceptPermisions={'DIRECTORIES.ACCESS'}
      acceptRoles={DIRECTORIES_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__DIRECTORIES'}
      backRoute={'/'}
      loading={loading}
    >
      {directoriesList.map((group) => (
        <Accordion key={group?.uid}>
          <AccordionSummary
            aria-controls={`directoriesGroup${group?.uid}-content`}
            id={`directoriesGroup${group?.uid}-header`}
          >
            <span>{isUA ? `${group?.name_ua} / ${group?.name_en}` : group?.name_en}</span>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List id={`directories-group-list-${group?.uid}`} component="nav" className={classes.list} data-marker={isUA ? `${group?.name_ua} / ${group?.name_en}` : group?.name_en}>
              {group?.types?.length === 0 ? (
                <ListItem button>{t('NO_DIRECTORIES_BY_TYPE')}</ListItem>
              ) : (
                group?.types.map((directoryItem) => (
                  <ListItem button key={directoryItem?.uid} onClick={() => handleClick(directoryItem)}>
                    {isUA
                      ? `${directoryItem?.code} ${directoryItem?.name_ua} / ${directoryItem?.name_en}`
                      : `${directoryItem?.code} ${directoryItem?.name_en}`}
                  </ListItem>
                ))
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Page>
  );
};

export default Directories;
