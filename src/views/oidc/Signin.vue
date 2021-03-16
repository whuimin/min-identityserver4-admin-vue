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
  name: 'Signin',
  mounted () {
    const oidcError = {
      name: 'oidcError',
      query: {
        title: this.$t('oidc.signin.error.title'),
        description: this.$t('oidc.signin.error.description'),
        buttonText: this.$t('oidc.signin.error.button-text')
      }
    }

    oidcUserManager
      .signinRedirectCallback()
      .then(user => {
        console.log('Oidc signinRedirectCallback.')
        const redirect = this.$store.getters.redirectUri
        if (redirect) {
          this.$router.push({ path: redirect })
        } else {
          this.$router.push({ name: 'index' })
        }
      })
      .catch(e => {
        console.error(e)
        this.$router.replace(oidcError)
      })
  }
}
</script>
