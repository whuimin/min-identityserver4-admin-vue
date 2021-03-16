import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  redirectUri: state => state.app.redirectUri,
  token: state => {
    if (process.env.VUE_APP_USE_IDS4) {
      let token = state.user.token
      if (!token) {
        token = storage.get(ACCESS_TOKEN)
      }

      if (!token) {
        return ''
      }

      if (token.ExpiresAt * 1000 < new Date().getTime()) {
        return ''
      }
      return token.AccessToken
    } else {
      return state.user.token
    }
  }
}

export default getters
