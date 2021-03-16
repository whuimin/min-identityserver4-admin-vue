import login from './oidc/login'
import logout from './oidc/logout'
import signin from './oidc/signin'
import signoutCallback from './oidc/signoutCallback'
export default {
  ...login,
  ...logout,
  ...signin,
  ...signoutCallback
}
