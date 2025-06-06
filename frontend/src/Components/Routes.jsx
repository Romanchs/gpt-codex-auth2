import { connect } from 'react-redux';
import propTypes from 'prop-types';

import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalLoading } from './Loadings/GlobalLoading';
import AppRouter from './AppRouter';

const Routes = ({ loading }) => {
  return (
    <div className={'app-wrapper'}>
      <Router>
        <GlobalLoading loading={loading} />
        <AppRouter />
      </Router>
    </div>
  );
};

Routes.propTypes = {
  loading: propTypes.bool
};

const mapStateToProps = ({ user }) => {
  return {
    loading: user.loading
  };
};
export default connect(mapStateToProps)(Routes);
