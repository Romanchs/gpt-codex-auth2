import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select/Select';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import FirstPageRounded from '@mui/icons-material/FirstPageRounded';
import LastPageRounded from '@mui/icons-material/LastPageRounded';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  footer: {
    backgroundColor: '#fff',
    height: 60,
    width: '100vw',
    position: 'fixed',
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #D1EDF3',
    zIndex: 3
  },
  size: {
    display: 'flex',
    alignItems: 'center',
    '&>p': {
      color: '#0D244D',
      fontSize: 14
    }
  },
  select: {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        padding: '1px 19px 0 5px',
        fontSize: 14,
        minHeight: 14,
        color: '#0D244D',
        '&>input.MuiSelect-nativeInput': {
          border: '0px solid transparent'
        }
      },

      '& .MuiOutlinedInput-notchedOutline': {
        display: 'none'
      },

      '& .MuiSelect-iconOutlined': {
        right: 0,
        top: -2,
        fontSize: 20,
        color: '#0D244D'
      },

      '& .MuiSelect-select:focus': {
        backgroundColor: 'transparent'
      }
    }
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',

    '&>input': {
      marginRight: 12,
      marginLeft: 12,
      width: 60,
      outline: 'none',
      border: '2px solid #567691',
      borderRadius: 3,
      backgroundColor: 'transparent',
      fontSize: 14,
      fontWeight: 500,
      textAlign: 'center',
      padding: 2,
      color: '#567691'
    },
    '&>button': {
      marginLeft: 4,
      marginRight: 4,
      color: '#567691',
      outline: 'none',

      '&:disabled': {
        color: '#aaa'
      },

      '& svg': {
        fontSize: 19
      }
    }
  }
}));

export const Pagination = ({
  current_page,
  next_page,
  data,
  previous_page,
  total,
  params,
  loading,
  onPaginate,
  elementsName,
  children,
  sizeSteps = [10, 25, 50],
  ignoreChangeRelation = false,
  renderPagesSum = null
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [pageInput, setPageInput] = useState(params.page);
  const role = useSelector(({ user }) => user.activeRoles[0].relation_id);
  const [prevRole, setPrevRole] = useState('');

  useEffect(() => {
    setPrevRole(role);
    if (prevRole && role !== prevRole && !ignoreChangeRelation) {
      onPaginate({ page: 1 });
    }
  }, [role, onPaginate, params.page]);

  useEffect(() => {
    if (params.page !== Number(pageInput)) {
      setPageInput(params.page);
    }
  }, [params]);

  const onSelectPage = (e) => {
    if (e.keyCode === 13 || e.type === 'blur') {
      if (Number(pageInput) < 1) {
        setPageInput(params.page);
        return;
      }
      if (Number(pageInput) === Number(params.page)) {
        return;
      }
      if (Number(pageInput) > (total > 0 ? Math.ceil(total / params.size) : 1)) {
        onPaginate({ page: total > 0 ? Math.ceil(total / params.size) : 1 });
        setPageInput(total > 0 ? Math.ceil(total / params.size) : 1);
      } else {
        onPaginate({ page: Number(pageInput) });
      }
    }
  };

  return (
    <div className={classes.footer}>
      <Container maxWidth={'xl'}>
        <Grid container justifyContent={children ? 'space-between' : 'flex-end'} alignItems={'center'} spacing={0}>
          {children && (
            <Grid item xs={'auto'}>
              {children}
            </Grid>
          )}
          <Grid item xs={children ? 'auto' : 12}>
            <Grid container justifyContent={'flex-end'} alignItems={'center'} spacing={3}>
              {!isMobile && (
                <Grid item xs={'auto'}>
                  <div className={classes.size}>
                    <p className={classes.select_title} data-marker={'size-name'}>{`${t('VERIFY_MSG.MAX_NUMBER_EL', {
                      elements: elementsName || t('PAGINATION.ELEMENTS')
                    })}:`}</p>
                    <FormControl className={classes.select}>
                      <Select
                        labelId="demo-customized-select-label"
                        MenuProps={{
                          disableScrollLock: true
                        }}
                        data-marker={'items-per-page'}
                        id="demo-customized-select"
                        variant="outlined"
                        value={Number(params.size)}
                        onChange={({ target }) => onPaginate({ size: target.value, page: 1 })}
                      >
                        {sizeSteps.map((size) => (
                          <MenuItem value={size} key={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              )}
              {!isMobile && (
                <Grid item xs={'auto'}>
                  <div className={classes.size} data-marker="sum-pages">
                    {renderPagesSum ? (
                      renderPagesSum({ data, current_page, next_page, previous_page, total })
                    ) : (
                      <p>
                        {data?.length > 0 ? (current_page - 1) * params.size + 1 : 0} -{' '}
                        {(current_page - 1) * params.size + data?.length || 0} з {total || 0}{' '}
                        {elementsName || t('PAGINATION.ELEMENTS')}
                      </p>
                    )}
                  </div>
                </Grid>
              )}
              <Grid item xs={'auto'}>
                <div className={classes.pagination}>
                  {!isMobile && (
                    <IconButton
                      size={'small'}
                      onClick={() => onPaginate({ page: 1 })}
                      disabled={loading || !previous_page}
                      data-marker={'first-page'}
                    >
                      <FirstPageRounded />
                    </IconButton>
                  )}
                  <IconButton
                    size={'small'}
                    onClick={() => onPaginate({ page: current_page - 1 })}
                    disabled={loading || !previous_page}
                    data-marker={'prev-page'}
                  >
                    <ChevronLeftRounded />
                  </IconButton>
                  <input
                    value={pageInput}
                    data-marker={'page-number'}
                    onChange={({ target: { value } }) =>
                      (/^\d+$/.test(value) || !value) && value.length < 7 && setPageInput(value)
                    }
                    onKeyDown={(e) => onSelectPage(e)}
                    onBlur={(e) => onSelectPage(e)}
                  />
                  <IconButton
                    size={'small'}
                    onClick={() => onPaginate({ page: current_page + 1 })}
                    disabled={loading || !next_page}
                    data-marker={'next-page'}
                  >
                    <ChevronRightRounded />
                  </IconButton>
                  {!isMobile && (
                    <IconButton
                      size={'small'}
                      onClick={() => onPaginate({ page: total > 0 ? Math.ceil(total / params.size) : 1 })}
                      disabled={loading || !next_page}
                      data-marker={'last-page'}
                    >
                      <LastPageRounded />
                    </IconButton>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

Pagination.propTypes = {
  loading: propTypes.bool.isRequired,
  onPaginate: propTypes.func.isRequired,
  params: propTypes.object.isRequired,
  elementsName: propTypes.string,
  renderPagesSum: propTypes.oneOfType([propTypes.func, propTypes.oneOf([null])])
};
