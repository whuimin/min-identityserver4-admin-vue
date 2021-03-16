<template>
  <div class="ant-form-item">
    <div class="ant-col ant-col-sm-9 ant-form-item-label">
      <label>{{ label }}</label>
    </div>
    <div class="ant-col ant-col-sm-15 ant-form-item-control-wrapper">
      <div class="ant-form-item-control">
        <span class="ant-form-item-children">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormItemView',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: null
    }
  }
}
</script>
