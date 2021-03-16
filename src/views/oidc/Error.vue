<template>
  <a-card :bordered="false">
    <a-result status="error" :title="$route.query.title" :sub-title="$route.query.description">
      <template #extra>
        <a-button type="primary" @click="retry">{{ $route.query.buttonText }}</a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
export default {
  name: 'Error',
  methods: {
    retry () {
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
