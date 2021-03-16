<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="Name">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="DisplayName">
                <a-input v-model="queryParam.displayName" placeholder="" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="Enabled">
                  <a-select placeholder="Please Select" default-value="">
                    <a-select-option value="">All</a-select-option>
                    <a-select-option value="false">False</a-select-option>
                    <a-select-option value="true">True</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="Created">
                  <a-date-picker
                    v-model="queryParam.createdBegin"
                    format="YYYY-MM-DD"
                    placeholder="Start"
                    style="width: 120px;"
                  />
                  ~
                  <a-date-picker
                    v-model="queryParam.createdEnd"
                    format="YYYY-MM-DD"
                    placeholder="End"
                    style="width: 120px;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="Updated">
                  <a-date-picker
                    v-model="queryParam.updatedBegin"
                    format="YYYY-MM-DD"
                    placeholder="Start"
                    style="width: 120px;"
                  />
                  ~
                  <a-date-picker
                    v-model="queryParam.updatedEnd"
                    format="YYYY-MM-DD"
                    placeholder="End"
                    style="width: 120px;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="Description">
                  <a-input v-model="queryParam.description" placeholder="" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">Search</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">Reset</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? 'Collapse' : 'Expand' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">New</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 1500 }"
        showPagination="auto"
      >
        <template slot="description" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">Edit</a>
          <a-divider type="vertical" />
          <a-popconfirm title="Sure to delete?" @confirm="() => handleDelete(record)">
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import notification from 'ant-design-vue/es/notification'
import {
  getIdentityResourceList,
  getIdentityResourceInit,
  getIdentityResourceView,
  insertIdentityResource,
  updateIdentityResource,
  deleteIdentityResource
} from '@/api/ids4admin'

import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left'
  },
  {
    title: 'DisplayName',
    dataIndex: 'displayName'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    width: '100px',
    align: 'center',
    customRender: value => value.toString()
  },
  {
    title: 'Created',
    dataIndex: 'created',
    width: '160px',
    align: 'center',
    customRender: value =>
      value &&
      moment
        .utc(value)
        .local()
        .format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: 'Updated',
    dataIndex: 'updated',
    width: '160px',
    align: 'center',
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

export default {
  name: 'IdentityResourceList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      advanced: false,
      queryParam: {},
      loadData: parameter => {
        const requestParameters = { ...parameter, condition: this.queryParam }
        console.log('loadData request parameters:', requestParameters)
        return getIdentityResourceList(requestParameters)
          .then(result => {
            const data = {
              pageSize: result.pageSize,
              pageNo: result.pageNo,
              totalCount: result.totalCount,
              totalPage: Math.ceil(result.totalCount / result.pageSize),
              data: result.dataList
            }
            return data
          })
          .catch(error => {
            notification.error({
              message: 'An error occured.',
              description: error.message
            })
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handleAdd () {
      getIdentityResourceInit()
        .then(result => {
          this.visible = true
          this.mdl = result
        })
        .catch(error => {
          notification.error({
            message: 'An error occured.',
            description: error.message
          })
        })
    },
    handleEdit (record) {
      const requestParameters = { id: record.id }
      getIdentityResourceView(requestParameters)
        .then(result => {
          this.visible = true
          this.mdl = result
        })
        .catch(error => {
          notification.error({
            message: 'An error occured.',
            description: error.message
          })
        })
    },
    handleOk () {
      const createModal = this.$refs.createModal
      const form = createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)

          const identityResource = createModal.model.data
          Object.assign(identityResource, values)

          const parameter = { data: identityResource }
          console.log('handleOk request parameters:', parameter)
          if (identityResource.id > 0) {
            updateIdentityResource(parameter)
              .then(result => {
                this.visible = false
                this.confirmLoading = false
                form.resetFields()
                this.$refs.table.refresh()

                this.$message.info('Modify successfull.')
              })
              .catch(error => {
                this.confirmLoading = false
                notification.error({
                  message: 'An error occured.',
                  description: error.message
                })
              })
          } else {
            insertIdentityResource(parameter)
              .then(result => {
                this.visible = false
                this.confirmLoading = false
                form.resetFields()
                this.$refs.table.refresh()

                this.$message.info('Add successfull.')
              })
              .catch(error => {
                this.confirmLoading = false
                notification.error({
                  message: 'An error occured.',
                  description: error.message
                })
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields()
    },
    handleDelete (record) {
      const requestParameters = { id: record.id }
      deleteIdentityResource(requestParameters)
        .then(result => {
          this.$refs.table.refresh()
          this.$message.info('Delete successffull.')
        })
        .catch(error => {
          notification.error({
            message: 'An error occured.',
            description: error.message
          })
        })
    }
  }
}
</script>
