<template>
  <a-modal
    title="View Device Flow Code"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="Basics" :forceRender="true">
            <a-form-item label="ClientId">
              <a-input v-decorator="['clientId']" />
            </a-form-item>
            <a-form-item label="UserCode">
              <a-input v-decorator="['userCode']" />
            </a-form-item>
            <a-form-item label="DeviceCode">
              <a-input v-decorator="['deviceCode']" />
            </a-form-item>
            <a-form-item label="SubjectId">
              <a-input v-decorator="['subjectId']" />
            </a-form-item>
            <a-form-item label="SessionId">
              <a-input v-decorator="['sessionId']" />
            </a-form-item>
            <a-form-item label="Description">
              <a-input v-decorator="['description']" />
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <form-item-view
                  label="CreationTime"
                  :value="formatLocalDate(deviceFlowCode && deviceFlowCode.creationTime)"
                />
              </a-col>
              <a-col :span="12">
                <form-item-view
                  label="Expiration"
                  :value="formatLocalDate(deviceFlowCode && deviceFlowCode.expiration)"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Data" :forceRender="true">
            <a-form-item label="" v-bind="textareaLayout">
              <a-textarea v-decorator="['data']" :rows="30" />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FormItemView from '../../components/FormItemView'

// 表单字段
const fields = ['userCode', 'deviceCode', 'subjectId', 'sessionId', 'clientId', 'description', 'data']

export default {
  components: { FormItemView },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        sm: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 20 }
      }
    }
    this.textareaLayout = {
      labelCol: {
        sm: { span: 0 }
      },
      wrapperCol: {
        sm: { span: 24 }
      }
    }

    return {
      deviceFlowCode: null,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    formatLocalDate (value) {
      if (!value) {
        return null
      }

      return moment
        .utc(value)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
    },
    formatJson (value) {
      var valueObject = JSON.parse(value)
      return JSON.stringify(valueObject, null, 2)
    },
    handleCancel () {
      this.$emit('cancel')
    }
  },
  created () {
    console.log('custom modal created')

    fields.forEach(v => this.form.getFieldDecorator(v))

    this.$watch('model', () => {
      this.editing = false
      this.deviceFlowCode = this.model.data
      this.deviceFlowCode.data = this.formatJson(this.deviceFlowCode.data)

      this.form.setFieldsValue(pick(this.deviceFlowCode, fields))
    })
  }
}
</script>
