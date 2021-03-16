<template>
  <div class="first-loading-wrp">
    <div class="loading-wrp">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
  </div>
</template>

<script>
import oidcUserManager from '@/utils/oidcUserManager'

export default {
  name: 'SignoutCallback',
  mounted () {
    const oidcError = {
      name: 'oidcError',
      query: {
        title: this.$t('oidc.signout-callback.error.title'),
        description: this.$t('oidc.signout-callback.error.description'),
        buttonText: this.$t('oidc.signout-callback.error.button-text')
      }
    }
    const oidcSuccess = {
      name: 'oidcSuccess',
      query: {
        title: this.$t('oidc.signout-callback.result.title'),
        description: this.$t('oidc.signout-callback.result.description'),
        buttonText: this.$t('oidc.signout-callback.result.button-text')
      }
    }

    this.$store.dispatch('Logout').then(() => {
      oidcUserManager
        .signoutRedirectCallback()
        .then(() => {
          console.log('Oidc signoutRedirectCallback')
          this.$router.replace(oidcSuccess)
        })
        .catch(e => {
          console.error(e)
          this.$router.replace(oidcError)
        })
    })
  }
}
</script>
