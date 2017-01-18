import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { toggleDrawer } from '../../actions/AppActions';
import Greeting from './greeting';

const mapStateToProps = ({ session }) => ({
  currentUser: session.currentUser
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  toggleDrawer: () => dispatch(toggleDrawer())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Greeting);
