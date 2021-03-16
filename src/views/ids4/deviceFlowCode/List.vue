<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="ClientId">
                <a-input v-model="queryParam.clientId" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="Description">
                <a-input v-model="queryParam.description" placeholder="" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="UserCode">
                  <a-input v-model="queryParam.userCode" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="DeviceCode">
                  <a-input v-model="queryParam.deviceCode" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="SubjectId">
                  <a-input v-model="queryParam.subjectId" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="SessionId">
                  <a-input v-model="queryParam.sessionId" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="CreationTime">
                  <a-date-picker
                    v-model="queryParam.creationTimeBegin"
                    format="YYYY-MM-DD"
                    placeholder="Start"
                    style="width: 120px;"
                  />
                  ~
                  <a-date-picker
                    v-model="queryParam.creationTimeEnd"
                    format="YYYY-MM-DD"
                    placeholder="End"
                    style="width: 120px;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="Expiration">
                  <a-date-picker
                    v-model="queryParam.expirationBegin"
                    format="YYYY-MM-DD"
                    placeholder="Start"
                    style="width: 120px;"
                  />
                  ~
                  <a-date-picker
                    v-model="queryParam.expirationEnd"
                    format="YYYY-MM-DD"
                    placeholder="End"
                    style="width: 120px;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="Data">
                  <a-input v-model="queryParam.data" placeholder="" />
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

      <s-table
        ref="table"
        size="default"
        rowKey="userCode"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 2500 }"
        showPagination="auto"
      >
        <template slot="userCode" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="deviceCode" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="subjectId" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="description" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="data" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleView(record)">View</a>
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
import { getDeviceFlowCodeList, getDeviceFlowCodeView, deleteDeviceFlowCode } from '@/api/ids4admin'

import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: 'ClientId',
    dataIndex: 'clientId'
  },
  {
    title: 'UserCode',
    dataIndex: 'userCode',
    scopedSlots: { customRender: 'userCode' }
  },
  {
    title: 'DeviceCode',
    dataIndex: 'deviceCode',
    scopedSlots: { customRender: 'userCode' }
  },
  {
    title: 'SubjectId',
    dataIndex: 'subjectId',
    scopedSlots: { customRender: 'subjectId' }
  },
  {
    title: 'SessionId',
    dataIndex: 'sessionId'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: 'Data',
    dataIndex: 'data',
    scopedSlots: { customRender: 'data' }
  },
  {
    title: 'CreationTime',
    dataIndex: 'creationTime',
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
    title: 'Expiration',
    dataIndex: 'expiration',
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
  name: 'DeviceFlowCodeList',
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
        return getDeviceFlowCodeList(requestParameters)
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
    handleView (record) {
      const requestParameters = { key: record.userCode }
      getDeviceFlowCodeView(requestParameters)
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
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields()
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields()
    },
    handleDelete (record) {
      const requestParameters = { key: record.userCode }
      deleteDeviceFlowCode(requestParameters)
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
