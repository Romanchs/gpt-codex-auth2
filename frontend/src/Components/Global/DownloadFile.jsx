import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loadings/Loading';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import moment from 'moment';

const DownloadFile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fetch] = useLazyMsFilesDownloadQuery();

  useEffect(() => {
    fetch({ id, name: `DH ${moment().format('DD-MM-YYYY hh:mm:ss')}` })
      .finally(() => navigate('/'));
  }, [id, fetch]);

  return <Loading loading={true} />;
};

export default DownloadFile;
