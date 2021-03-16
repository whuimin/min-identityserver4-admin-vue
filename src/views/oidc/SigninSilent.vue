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
  name: 'Logout',
  mounted () {
    oidcUserManager
      .signinSilentCallback()
      .then(() => {
        console.log('Oidc signinSilentCallback.')
      })
      .catch(e => {
        console.error(e)
      })
  }
}
</script>
