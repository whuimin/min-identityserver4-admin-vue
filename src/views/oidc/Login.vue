<template>
  <div class="first-loading-wrp">
    <div class="loading-wrp">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
  </div>
</template>

<script>
import { REDIRECT_URI } from '@/store/mutation-types'
import oidcUserManager from '@/utils/oidcUserManager'

export default {
  name: 'Login',
  mounted () {
    this.$store.commit(REDIRECT_URI, this.$route.query.redirect)

    const oidcError = {
      name: 'oidcError',
      query: {
        title: this.$t('oidc.login.error.title'),
        description: this.$t('oidc.login.error.description'),
        buttonText: this.$t('oidc.login.error.button-text')
      }
    }

    oidcUserManager
      .signinRedirect()
      .then(() => {
        console.log('Oidc signinRedirect.')
      })
      .catch(e => {
        console.error(e)
        this.$router.replace(oidcError)
      })
  }
}
</script>
