<template>
  <a-modal
    :title="apiResource && apiResource.id > 0 ? 'Edit API Resource' : 'New API Resource'"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="Basics" :forceRender="true">
            <a-form-item v-show="false" label="ID">
              <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
            </a-form-item>
            <a-row>
              <a-col :span="17">
                <a-form-item label="Name">
                  <a-input size="small" v-decorator="['name', { rules: [{ required: true, min: 1, max: 200 }] }]" />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="Enabled" v-bind="switchLayout">
                  <a-switch v-decorator="['enabled', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="17">
                <a-form-item label="DisplayName">
                  <a-input size="small" v-decorator="['displayName', { rules: [{ max: 200 }] }]" />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="ShowInDiscoveryDocument" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['showInDiscoveryDocument', { initialValue: true, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="Description">
              <a-input size="small" v-decorator="['description', { rules: [{ max: 1000 }] }]" />
            </a-form-item>
            <a-form-item label="Scopes">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['scopes']">
                <a-select-option v-for="scope in allScopes" :key="scope">{{ scope }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="UserClaims">
              <a-select
                mode="tags"
                dropdownClassName="form-input-select"
                :token-separators="[',']"
                v-decorator="['userClaims']"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="AllowedAccessTokenSigningAlgorithms" v-bind="inputLayout1">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['allowedAccessTokenSigningAlgorithms']">
                <a-select-option value="HS256">HS256</a-select-option>
                <a-select-option value="HS384">HS384</a-select-option>
                <a-select-option value="HS512">HS512</a-select-option>
                <a-select-option value="PS256">PS256</a-select-option>
                <a-select-option value="PS384">PS384</a-select-option>
                <a-select-option value="PS512">PS512</a-select-option>
                <a-select-option value="RS256">RS256</a-select-option>
                <a-select-option value="RS384">RS384</a-select-option>
                <a-select-option value="RS512">RS512</a-select-option>
                <a-select-option value="ES256">ES256</a-select-option>
                <a-select-option value="ES256K">ES256K</a-select-option>
                <a-select-option value="ES384">ES384</a-select-option>
                <a-select-option value="ES512">ES512</a-select-option>
                <a-select-option value="EdDSA">EdDSA</a-select-option>
              </a-select>
            </a-form-item>
            <a-row>
              <a-col :span="8">
                <form-item-view label="Created" :value="formatLocalDate(apiResource && apiResource.created)" />
              </a-col>
              <a-col :span="8">
                <form-item-view label="Updated" :value="formatLocalDate(apiResource && apiResource.updated)" />
              </a-col>
              <a-col :span="8">
                <form-item-view
                  label="LastAccessed"
                  :value="formatLocalDate(apiResource && apiResource.lastAccessed)"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Secrets/Properties" :forceRender="true">
            <a-divider>Secrets</a-divider>
            <a-table
              ref="secretsTable"
              size="small"
              rowKey="rowKey"
              class="form-input-table"
              :columns="secretColumns"
              :data-source="apiSecrets"
              :scroll="{ x: 1100 }"
              :pagination="false"
              bordered
            >
              <template slot="type" slot-scope="text, record">
                <div>
                  <a-select
                    v-if="record.editable"
                    :default-value="text"
                    size="small"
                    @change="value => changeSecret(record.rowKey, 'type', value)"
                  >
                    <a-select-option value="SharedSecret">SharedSecret</a-select-option>
                    <a-select-option value="JWK">JWK</a-select-option>
                    <a-select-option value="X509Thumbprint">X509Thumbprint</a-select-option>
                    <a-select-option value="X509CertificateBase64">X509CertificateBase64</a-select-option>
                  </a-select>
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="value" slot-scope="text, record">
                <div>
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    size="small"
                    @change="e => changeSecret(record.rowKey, 'value', e.target.value)"
                  />
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="description" slot-scope="text, record">
                <div>
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    size="small"
                    @change="e => changeSecret(record.rowKey, 'description', e.target.value)"
                  />
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="expiration" slot-scope="text, record">
                <div>
                  <a-date-picker
                    show-time
                    v-if="record.editable"
                    :value="localDate(text)"
                    size="small"
                    @change="date => changeSecret(record.rowKey, 'expiration', formatUtcDate(date))"
                  />
                  <template v-else>{{ formatLocalDate(text) }}</template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <span v-if="record.editable">
                  <a @click="() => saveSecret(record.rowKey)">Save</a>
                  <a-divider type="vertical" />
                  <a @click="() => cancelSecret(record.rowKey)">Cancel</a>
                </span>
                <span v-else>
                  <a :disabled="editing" @click="() => editSecret(record.rowKey)">Edit</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="Sure to delete?" @confirm="() => deleteSecret(record.rowKey)">
                    <a href="javascript:;">Delete</a>
                  </a-popconfirm>
                </span>
              </template>
              <template slot="footer">
                <a-button
                  :disabled="editing"
                  class="editable-add-btn"
                  size="small"
                  @click="addSecret"
                >Add Row</a-button
                >
              </template>
            </a-table>
            <a-divider>Properties</a-divider>
            <a-table
              ref="propertiesTable"
              size="small"
              rowKey="rowKey"
              class="form-input-table"
              :columns="propertyColumns"
              :data-source="properties"
              :pagination="false"
              bordered
            >
              <template slot="key" slot-scope="text, record">
                <div>
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    size="small"
                    @change="e => changeProperty(record.rowKey, 'key', e.target.value)"
                  />
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="value" slot-scope="text, record">
                <div>
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    size="small"
                    @change="e => changeProperty(record.rowKey, 'value', e.target.value)"
                  />
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <span v-if="record.editable">
                  <a @click="() => saveProperty(record.rowKey)">Save</a>
                  <a-divider type="vertical" />
                  <a @click="() => cancelProperty(record.rowKey)">Cancel</a>
                </span>
                <span v-else>
                  <a :disabled="editing" @click="() => editProperty(record.rowKey)">Edit</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="Sure to delete?" @confirm="() => deleteProperty(record.rowKey)">
                    <a href="javascript:;">Delete</a>
                  </a-popconfirm>
                </span>
              </template>
              <template slot="footer">
                <a-button
                  :disabled="editing"
                  class="editable-add-btn"
                  size="small"
                  @click="addProperty"
                >Add Row</a-button
                >
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { STable } from '@/components'
import FormItemView from '../../components/FormItemView'

// 表单字段
const fields = [
  'id',
  'enabled',
  'name',
  'displayName',
  'description',
  'showInDiscoveryDocument',
  'userClaims',
  'scopes',
  'allowedAccessTokenSigningAlgorithms'
]

const secretColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: 'Value',
    dataIndex: 'value',
    scopedSlots: { customRender: 'value' }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    align: 'center',
    scopedSlots: { customRender: 'expiration' }
  },
  {
    title: 'Created',
    dataIndex: 'created',
    align: 'center',
    width: '150px',
    customRender: value =>
      value &&
      moment
        .utc(value)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    fixed: 'right',
    width: '120px',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

const propertyColumns = [
  {
    title: 'Key',
    dataIndex: 'key',
    scopedSlots: { customRender: 'key' }
  },
  {
    title: 'Value',
    dataIndex: 'value',
    scopedSlots: { customRender: 'value' }
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    width: '120px',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  components: { STable, FormItemView },
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
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }
    this.inputLayout1 = {
      labelCol: {
        sm: { span: 12 }
      },
      wrapperCol: {
        sm: { span: 12 }
      }
    }
    this.switchLayout = {
      labelCol: {
        sm: { span: 19 }
      },
      wrapperCol: {
        sm: { span: 5 }
      }
    }

    this.secretColumns = secretColumns
    this.propertyColumns = propertyColumns

    return {
      editing: false,
      apiResource: null,
      allScopes: [],
      apiSecrets: [],
      properties: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    localDate (value) {
      if (!value) {
        return null
      }
      return moment.utc(value).local()
    },
    formatUtcDate (date) {
      if (!date) {
        return null
      }

      return date.utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    formatLocalDate (value) {
      if (!value) {
        return null
      }

      return moment
        .utc(value)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
    },
    handleCancel () {
      this.$emit('cancel')
    },
    handleOk () {
      if (this.editing) {
        this.$message.info('Some row is editing.')
        return
      }
      this.$emit('ok')
    },
    getUnusedKey (records) {
      let rowKey = -1
      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        if (record.rowKey > i && !records.find(item => item.rowKey === i)) {
          rowKey = i
          break
        }
      }

      if (rowKey === -1) {
        rowKey = records.length
      }
      return rowKey
    },
    addSecret () {
      const newData = {
        rowKey: this.getUnusedKey(this.apiSecrets),
        id: 0,
        type: 'SharedSecret',
        value: '',
        description: '',
        expiration: null,
        editable: true
      }
      this.apiSecrets = [...this.apiSecrets, newData]
      this.editing = true
    },
    editSecret (rowKey) {
      const apiSecrets = [...this.apiSecrets]
      const target = apiSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        target.editable = true
        this.apiSecrets = apiSecrets
        this.editing = true
      }
    },
    saveSecret (rowKey) {
      const apiSecrets = [...this.apiSecrets]
      const target = apiSecrets.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.apiResource.apiSecrets.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.apiResource.apiSecrets.push({ ...target })
        }
        target.editable = false
        this.apiSecrets = apiSecrets
      }

      this.editing = false
    },
    cancelSecret (rowKey) {
      let apiSecrets = [...this.apiSecrets]
      const target = apiSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.apiResource.apiSecrets.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          apiSecrets = this.apiSecrets.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.apiSecrets = apiSecrets
      }
      this.editing = false
    },
    changeSecret (rowKey, dataIndex, value) {
      const target = this.apiSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        target[dataIndex] = value
      }
    },
    deleteSecret (rowKey) {
      const target = this.apiSecrets.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.apiSecrets = this.apiSecrets.filter(item => item.rowKey !== rowKey)
        this.apiResource.apiSecrets = this.apiResource.apiSecrets.filter(item => item.rowKey !== rowKey)
      }
    },
    addProperty () {
      const newData = {
        rowKey: this.getUnusedKey(this.properties),
        id: 0,
        key: '',
        value: '',
        editable: true
      }
      this.properties = [...this.properties, newData]
      this.editing = true
    },
    editProperty (rowKey) {
      const properties = [...this.properties]
      const target = properties.find(item => item.rowKey === rowKey)
      if (target) {
        target.editable = true
        this.properties = properties
        this.editing = true
      }
    },
    saveProperty (rowKey) {
      const properties = [...this.properties]
      const target = properties.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.apiResource.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.apiResource.properties.push({ ...target })
        }
        target.editable = false
        this.properties = properties
      }

      this.editing = false
    },
    cancelProperty (rowKey) {
      let properties = [...this.properties]
      const target = properties.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.apiResource.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          properties = this.properties.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.properties = properties
      }
      this.editing = false
    },
    changeProperty (rowKey, dataIndex, value) {
      const target = this.properties.find(item => item.rowKey === rowKey)
      if (target) {
        target[dataIndex] = value
      }
    },
    deleteProperty (rowKey) {
      const target = this.properties.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.properties = this.properties.filter(item => item.rowKey !== rowKey)
        this.apiResource.properties = this.apiResource.properties.filter(item => item.rowKey !== rowKey)
      }
    }
  },
  created () {
    console.log('custom modal created')

    fields.forEach(v => this.form.getFieldDecorator(v))

    this.$watch('model', () => {
      this.editing = false
      this.apiResource = this.model.data
      this.allScopes = this.model.allScopes
      this.apiSecrets = this.apiResource.apiSecrets.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })
      this.properties = this.apiResource.properties.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })

      this.form.setFieldsValue(pick(this.apiResource, fields))
    })
  }
}
</script>
