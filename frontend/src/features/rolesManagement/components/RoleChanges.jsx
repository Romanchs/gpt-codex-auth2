import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { ListItem } from '@material-ui/core';
import { Card } from '../../../Components/Theme/Components/Card';
import React, { useEffect, useState } from 'react';
import { useStyles } from '../styles';
import { getLabelFromPath } from '../utils';
import { NotResult } from '../../../Components/Theme/Components/NotResult';
import { useTranslation } from 'react-i18next';

export const RoleChanges = ({ data }) => {
  const {t} = useTranslation();
  const classes = useStyles();

  const [isNoChanges, setIsNoChange] = useState(true);

  useEffect(() => {
    Object.keys(data).forEach((key) => {
      if (data[key]?.added?.length > 0 || data[key]?.removed?.length > 0) {
        setIsNoChange(false);
      }
    });
  }, [data]);

  return (
    <Card
      title={
        <Grid container alignItems={'center'}>
          <Grid item xs={6}>
            {t('ADDED_RIGHTS_TO_THE_ROLE')}
          </Grid>
          <Grid item xs={6}>
            {t('EXCLUDED_RIGHTS_FROM_THE_ROLE')}
          </Grid>
        </Grid>
      }
    >
      <Grid container>
        {isNoChanges && (
          <Grid item xs={12}>
            <NotResult text={t('NO_CHANGES_FOUND')} />
          </Grid>
        )}

        <Grid item xs={6}>
          {Object.keys(data).map((key) => (
            <div className={classes.change} key={key}>
              {data[key]?.added?.length > 0 && (
                <div className={classes.module}>
                  <div className={classes.title}>{getLabelFromPath(key)}</div>

                  <div className={classes.title}>{t('FUNCTIONS')}:</div>

                  <List className={classes.list}>
                    {data[key].added?.map((item, index) => (
                      <ListItem key={index} className={classes.listItem}>
                        {item}
                      </ListItem>
                    ))}
                  </List>
                </div>
              )}
            </div>
          ))}
        </Grid>
        <Grid item xs={6}>
          {Object.keys(data).map((key) => (
            <div className={classes.change} key={key}>
              {data[key]?.removed?.length > 0 && (
                <>
                  <div className={classes.title}>{getLabelFromPath(key)}</div>

                  <div className={classes.title}>{t('FUNCTIONS')}:</div>

                  <List className={classes.list}>
                    {data[key].removed?.map((item, index) => (
                      <ListItem key={index} className={classes.listItem}>
                        {item}
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </div>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};
