import Oidc from 'oidc-client'

const config = {
  authority: process.env.VUE_APP_OIDC_AUTHORITY,
  client_id: process.env.VUE_APP_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin + process.env.VUE_APP_OIDC_REDIRECT_URI,
  silent_redirect_uri: window.location.origin + process.env.VUE_APP_OIDC_SILENT_REDIRECT_URI,
  response_type: process.env.VUE_APP_OIDC_RESPONSE_TYPE,
  scope: process.env.VUE_APP_OIDC_SCOPE,
  post_logout_redirect_uri: window.location.origin + process.env.VUE_APP_OIDC_POST_LOGOUT_REDIRECT_URI,
  automaticSilentRenew: true,
  revokeAccessTokenOnSignout: true
}

const oidcUserManager = new Oidc.UserManager(config)

export default oidcUserManager
