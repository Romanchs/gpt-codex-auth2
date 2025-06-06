import { supplierStatuses } from './models';
import {useTranslation} from "react-i18next";

const Status = ({ status }) => {
  const {t} = useTranslation();

  const color = () => {
    switch (status) {
      case 'ACTIVE':
        return '#018C0D';
      case 'DEFAULT':
        return '#FF0000';
      case 'PRE_DEFAULT':
        return '#F28C60';
      default:
        return '#A5A2A3';
    }
  };
  return <span style={{ color: color(), fontWeight: 500, lineHeight: '20px' }}>{t(supplierStatuses[status]?.label)}</span>;
};

export default Status;
