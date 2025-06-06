import { ReactComponent as Logo } from '../../images/logo_bg.svg';

export const GlobalLoading = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className={`page-loader${loading ? ' loading' : ''}`}>
      <Logo
        className={'pulse'}
        width={'115px'}
        data-marker={'Loader_mask--logo-global'}
        data-status={loading ? 'active' : 'inactive'}
      />
    </div>
  );
};
