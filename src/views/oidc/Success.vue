<template>
  <a-card :bordered="false">
    <a-result status="success" :title="$route.query.title" :sub-title="$route.query.description">
      <template #extra>
        <a-button type="primary" @click="login">{{ $route.query.buttonText }}</a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
export default {
  name: 'Success',
  methods: {
    login () {
      const redirect = this.$store.getters.redirectUri
      if (redirect) {
        this.$router.push({ path: redirect })
      } else {
        this.$router.push({ name: 'index' })
      }
    }
  }
}
</script>
