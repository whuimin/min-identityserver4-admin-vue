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
  mounted () {
    oidcUserManager
      .signoutCallback()
      .then(() => {
        console.log('Oidc signoutCallback')
      })
      .catch(e => {
        console.error(e)
      })
  }
}
</script>
