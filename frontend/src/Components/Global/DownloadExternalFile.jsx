import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadPpkoExternalFileById } from '../../actions/ppkoActions';
import Loading from '../Loadings/Loading';
import { useTranslation } from 'react-i18next';

const DownloadExternalFile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.ppko.downloadingExternalFile);

  useEffect(() => {
    dispatch(
      downloadPpkoExternalFileById(
        id,
        `${t('FILENAMES.DATAHUB_COMMERCIAL_METERING_SERVICE', { date: moment().format('DD-MM-YYYY') })}.zip`,
        redirectToHome
      )
    );
  }, []);

  function redirectToHome() {
    navigate('/');
  }

  return <Loading loading={loading} />;
};

export default DownloadExternalFile;
