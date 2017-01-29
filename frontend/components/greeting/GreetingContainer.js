import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { toggleDrawer } from '../../actions/AppActions';
import Greeting from './Greeting';

const mapStateToProps = ({ session }) => ({
  currentUser: session.currentUser
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  toggleDrawer: () => dispatch(toggleDrawer()),
  logoutRefresh: () => {
    dispatch(logout());
    window.setTimeout(window.location.reload, 2000);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Greeting);
