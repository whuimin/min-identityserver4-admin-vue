<template>
  <a-modal
    :title="identityResource && identityResource.id > 0 ? 'Edit Identity Resource' : 'New Identity Resource'"
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
                <a-form-item label="Required" v-bind="switchLayout">
                  <a-switch v-decorator="['required', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="Description">
              <a-input size="small" v-decorator="['description', { rules: [{ max: 1000 }] }]" />
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <a-form-item label="ShowInDiscoveryDocument" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['showInDiscoveryDocument', { initialValue: true, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Emphasize" v-bind="switchLayout">
                  <a-switch v-decorator="['emphasize', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="UserClaims">
              <a-select
                mode="tags"
                dropdownClassName="form-input-select"
                :token-separators="[',']"
                v-decorator="['userClaims']"
              >
              </a-select>
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <form-item-view
                  label="Created"
                  :value="formatLocalDate(identityResource && identityResource.created)"
                />
              </a-col>
              <a-col :span="12">
                <form-item-view
                  label="Updated"
                  :value="formatLocalDate(identityResource && identityResource.updated)"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Properties" :forceRender="true">
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
  'required',
  'emphasize',
  'showInDiscoveryDocument',
  'userClaims'
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
    this.switchLayout = {
      labelCol: {
        sm: { span: 19 }
      },
      wrapperCol: {
        sm: { span: 5 }
      }
    }

    this.propertyColumns = propertyColumns

    return {
      editing: false,
      identityResource: null,
      properties: [],
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
    addProperty () {
      console.log('add property begin', this.properties)

      const newData = {
        rowKey: this.getUnusedKey(this.properties),
        id: 0,
        key: '',
        value: '',
        editable: true
      }
      this.properties = [...this.properties, newData]
      this.editing = true

      console.log('add property end', this.properties)
    },
    editProperty (rowKey) {
      console.log('edit property begin, rowKey: ' + rowKey, this.properties, this.identityResource.properties)

      const properties = [...this.properties]
      const target = properties.find(item => item.rowKey === rowKey)
      if (target) {
        target.editable = true
        this.properties = properties
        this.editing = true
      }

      console.log('edit property end, rowKey: ' + rowKey, this.properties)
    },
    saveProperty (rowKey) {
      console.log('save property begin, rowKey: ' + rowKey, this.properties, this.identityResource.properties)

      const properties = [...this.properties]
      const target = properties.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.identityResource.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.identityResource.properties.push({ ...target })
        }
        target.editable = false
        this.properties = properties
      }

      this.editing = false

      console.log('save property end, rowKey: ' + rowKey, this.properties, this.identityResource.properties)
    },
    cancelProperty (rowKey) {
      console.log('cancel property begin, rowKey: ' + rowKey, this.properties, this.identityResource.properties)

      let properties = [...this.properties]
      const target = properties.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.identityResource.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          properties = this.properties.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.properties = properties
      }
      this.editing = false

      console.log('cancel property end, rowKey: ' + rowKey, this.properties, this.identityResource.properties)
    },
    changeProperty (rowKey, dataIndex, value) {
      console.log(
        'change property begin, rowKey: ' + rowKey + ', dataIndex: ' + dataIndex + ', value: ' + value,
        this.properties
      )

      const target = this.properties.find(item => item.rowKey === rowKey)
      if (target) {
        target[dataIndex] = value
      }

      console.log(
        'change property end, rowKey: ' + rowKey + ', dataIndex: ' + dataIndex + ', value: ' + value,
        this.properties
      )
    },
    deleteProperty (rowKey) {
      console.log('delete property begin, rowKey: ' + rowKey, this.properties, this.identityResource.properties)

      const target = this.properties.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.properties = this.properties.filter(item => item.rowKey !== rowKey)
        this.identityResource.properties = this.identityResource.properties.filter(item => item.rowKey !== rowKey)
      }

      console.log('delete property end, rowKey: ' + rowKey, this.clapropertiesims, this.identityResource.properties)
    }
  },
  created () {
    console.log('custom modal created')

    fields.forEach(v => this.form.getFieldDecorator(v))

    this.$watch('model', () => {
      this.editing = false
      this.identityResource = this.model.data
      this.properties = this.identityResource.properties.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })

      this.form.setFieldsValue(pick(this.identityResource, fields))
    })
  }
}
</script>
