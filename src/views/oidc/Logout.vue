<template>
  <div class="first-loading-wrp">
    <div class="loading-wrp">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { REDIRECT_URI } from '@/store/mutation-types'
import oidcUserManager from '@/utils/oidcUserManager'

export default {
  name: 'Logout',
  mounted () {
    store.commit(REDIRECT_URI, this.$route.query.redirect)

    const oidcError = {
      name: 'oidcError',
      query: {
        title: this.$t('oidc.logout.error.title'),
        description: this.$t('oidc.logout.error.description'),
        buttonText: this.$t('oidc.logout.error.button-text')
      }
    }

    oidcUserManager
      .signoutRedirect()
      .then(() => {
        console.log('Oidc signoutRedirect.')
      })
      .catch(e => {
        console.error(e)
        this.$router.replace(oidcError)
      })
  }
}
</script>
