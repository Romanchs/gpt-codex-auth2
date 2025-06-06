import { checkPermissions } from '../../util/verifyRole';

export const ADMIN_PERMISSION = 'FAQ.ADMIN';
export const ADMIN_ROLES = ['АКО_Довідники'];

export const useIsFaqAdmin = () => {
  return checkPermissions(ADMIN_PERMISSION, ADMIN_ROLES);
};

export const accessToFaq = () => checkPermissions('FAQ.ACCESS', [], true);
