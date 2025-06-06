import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { checkPermissions } from '../../util/verifyRole';
import Page from '../../Components/Global/Page';
import { DISPUTE_ALLOWED_ROLES } from './constants';
import { DisputesTable } from './DisputesTable';
import { useDisputeListQuery } from './api';
import { useTranslation } from 'react-i18next';

export const Disputes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { searchParams } = useSelector(({ disputes }) => disputes);
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);

  const { data: disputeList, isFetching } = useDisputeListQuery(searchParams);

  useEffect(() => {
    if (!checkPermissions('DISPUTES.ACCESS', DISPUTE_ALLOWED_ROLES)) {
      navigate('/');
    }
  }, [navigate, searchParams, relation_id]);

  return (
    <Page
      pageName={t('PAGES.DISPUTES')}
      backRoute={'/'}
      faqKey={'INFORMATION_BASE__DISPUTES'}
      loading={isFetching}
      acceptPermisions={'DISPUTES.ACCESS'}
      acceptRoles={DISPUTE_ALLOWED_ROLES}
    >
      <DisputesTable disputeList={disputeList} searchParams={searchParams} loading={isFetching} />
    </Page>
  );
};
