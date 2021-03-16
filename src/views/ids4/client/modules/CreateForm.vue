<template>
  <a-modal
    :title="client && client.id > 0 ? 'Edit Client' : 'New Client'"
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
              <a-col :span="15">
                <a-form-item label="ClientId">
                  <a-input size="small" v-decorator="['clientId', { rules: [{ required: true, min: 1, max: 200 }] }]" />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item label="Enabled" v-bind="switchLayout">
                  <a-switch v-decorator="['enabled', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="15">
                <a-form-item label="ClientName">
                  <a-input size="small" v-decorator="['clientName', { rules: [{ max: 200 }] }]" />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item label="ProtocolType" v-bind="switchLayout">
                  <a-radio-group v-decorator="['protocolType', { initialValue: 'oidc' }]">
                    <a-radio value="oidc">OIDC</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="Description">
              <a-input size="small" v-decorator="['description', { rules: [{ max: 1000 }] }]" />
            </a-form-item>
            <a-row>
              <a-col :span="8">
                <a-form-item label="AllowOfflineAccess" v-bind="switchLayout">
                  <a-switch v-decorator="['allowOfflineAccess', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="RequireClientSecret" v-bind="switchLayout">
                  <a-switch v-decorator="['requireClientSecret', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="RequireRequestObject" v-bind="switchLayout">
                  <a-switch v-decorator="['requireRequestObject', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="RequirePkce" v-bind="switchLayout">
                  <a-switch v-decorator="['requirePkce', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="AllowPlainTextPkce" v-bind="switchLayout">
                  <a-switch v-decorator="['allowPlainTextPkce', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="AllowAccessTokensViaBrowser" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['allowAccessTokensViaBrowser', { initialValue: false, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="AllowedGrantTypes">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['allowedGrantTypes']">
                <a-select-option value="client_credentials">client_credentials</a-select-option>
                <a-select-option value="authorization_code">authorization_code</a-select-option>
                <a-select-option value="password">password</a-select-option>
                <a-select-option value="implicit">implicit</a-select-option>
                <a-select-option value="hybrid">hybrid</a-select-option>
                <a-select-option value="urn:ietf:params:oauth:grant-type:device_code">device_code</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="AllowedScopes">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['allowedScopes']">
                <a-select-option v-for="scope in allScopes" :key="scope">{{ scope }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-row>
              <a-col :span="8">
                <form-item-view label="Created" :value="formatLocalDate(client && client.created)" />
              </a-col>
              <a-col :span="8">
                <form-item-view label="Updated" :value="formatLocalDate(client && client.updated)" />
              </a-col>
              <a-col :span="8">
                <form-item-view label="LastAccessed" :value="formatLocalDate(client && client.lastAccessed)" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Authentication/Logout" :forceRender="true">
            <a-form-item label="RedirectUris">
              <a-select
                mode="tags"
                dropdownClassName="form-input-select"
                :token-separators="[',']"
                v-decorator="['redirectUris']"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="PostLogoutRedirectUris" v-bind="inputLayout">
              <a-select
                mode="tags"
                dropdownClassName="form-input-select"
                :token-separators="[',']"
                v-decorator="['postLogoutRedirectUris']"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="FrontChannelLogoutUri" v-bind="inputLayout">
              <a-input size="small" v-decorator="['frontChannelLogoutUri', { rules: [{ max: 2000 }] }]" />
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <a-form-item label="FrontChannelLogoutSessionRequired" v-bind="switchLayout">
                  <a-switch
                    v-decorator="[
                      'frontChannelLogoutSessionRequired',
                      { initialValue: true, valuePropName: 'checked' }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="EnableLocalLogin" v-bind="switchLayout">
                  <a-switch v-decorator="['enableLocalLogin', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="BackChannelLogoutUri" v-bind="inputLayout">
              <a-input size="small" v-decorator="['backChannelLogoutUri', { rules: [{ max: 2000 }] }]" />
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <a-form-item label="BackChannelLogoutSessionRequired" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['backChannelLogoutSessionRequired', { initialValue: true, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="UserSsoLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['userSsoLifetime']"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="IdentityProviderRestrictions" v-bind="inputLayout">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['identityProviderRestrictions']">
              </a-select>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Token" :forceRender="true">
            <a-row>
              <a-col :span="12">
                <a-form-item label="IdentityTokenLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['identityTokenLifetime', { initialValue: 300 }]"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="AuthorizationCodeLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['authorizationCodeLifetime', { initialValue: 300 }]"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="AccessTokenType" v-bind="radioLayout">
                  <a-radio-group v-decorator="['accessTokenType', { initialValue: 'Jwt' }]">
                    <a-radio value="Jwt">Jwt</a-radio>
                    <a-radio value="Reference">Reference</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="AccessTokenLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['accessTokenLifetime', { initialValue: 3600 }]"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="RefreshTokenUsage" v-bind="radioLayout">
                  <a-radio-group v-decorator="['refreshTokenUsage', { initialValue: 'OneTimeOnly' }]">
                    <a-radio value="ReUse">ReUse</a-radio>
                    <a-radio value="OneTimeOnly">OneTimeOnly</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="RefreshTokenExpiration" v-bind="radioLayout">
                  <a-radio-group v-decorator="['refreshTokenExpiration', { initialValue: 'Absolute' }]">
                    <a-radio value="Sliding">Sliding</a-radio>
                    <a-radio value="Absolute">Absolute</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="AbsoluteRefreshTokenLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['absoluteRefreshTokenLifetime', { initialValue: 2592000 }]"
                    style="width: 120px;"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="SlidingRefreshTokenLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['slidingRefreshTokenLifetime', { initialValue: 1296000 }]"
                    style="width: 120px;"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="UpdateAccessTokenClaimsOnRefresh" v-bind="switchLayout">
                  <a-switch
                    v-decorator="[
                      'updateAccessTokenClaimsOnRefresh',
                      { initialValue: false, valuePropName: 'checked' }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="AlwaysIncludeUserClaimsInIdToken" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['alwaysIncludeUserClaimsInIdToken', { initialValue: true, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="IncludeJwtId" v-bind="switchLayout">
                  <a-switch v-decorator="['includeJwtId', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="AlwaysSendClientClaims" v-bind="switchLayout">
                  <a-switch
                    v-decorator="['alwaysSendClientClaims', { initialValue: false, valuePropName: 'checked' }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="ClientClaimsPrefix" v-bind="numberLayout">
                  <a-input v-decorator="['clientClaimsPrefix', { rules: [{ max: 200 }], initialValue: 'client_' }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="PairWiseSubjectSalt" v-bind="inputLayout">
              <a-input size="small" v-decorator="['pairWiseSubjectSalt', { rules: [{ max: 200 }] }]" />
            </a-form-item>
            <a-form-item label="AllowedIdentityTokenSigningAlgorithms" v-bind="inputLayout1">
              <a-select mode="tags" :token-separators="[',']" v-decorator="['allowedIdentityTokenSigningAlgorithms']">
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
            <a-form-item label="AllowedCorsOrigins" v-bind="inputLayout">
              <a-select
                mode="tags"
                size="small"
                dropdownClassName="form-input-select"
                :token-separators="[',']"
                v-decorator="['allowedCorsOrigins']"
              >
              </a-select>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="4" tab="Consent Screen" :forceRender="true">
            <a-row>
              <a-col :span="8">
                <a-form-item label="RequireConsent" v-bind="switchLayout">
                  <a-switch v-decorator="['requireConsent', { initialValue: false, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="AllowRememberConsent" v-bind="switchLayout">
                  <a-switch v-decorator="['allowRememberConsent', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="ConsentLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['consentLifetime']"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="ClientUri">
              <a-input size="small" v-decorator="['clientUri', { rules: [{ max: 2000 }] }]" />
            </a-form-item>
            <a-form-item label="LogoUri">
              <a-input size="small" v-decorator="['logoUri', { rules: [{ max: 2000 }] }]" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="5" tab="Device flow" :forceRender="true">
            <a-row>
              <a-col :span="12">
                <a-form-item label="UserCodeType" v-bind="inputLayout">
                  <a-input siza="small" v-decorator="['userCodeType', { rules: [{ max: 100 }] }]" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="DeviceCodeLifetime" v-bind="numberLayout">
                  <a-input-number
                    v-decorator="['deviceCodeLifetime', { initialValue: 300 }]"
                    :min="0"
                    :formatter="value => `${value} sec.`"
                    :parser="value => value.replace(' sec.', '')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="6" tab="Secrets/Claims/..." :forceRender="true">
            <a-divider>Secrets</a-divider>
            <a-table
              ref="secretsTable"
              size="small"
              rowKey="rowKey"
              class="form-input-table"
              :columns="secretColumns"
              :data-source="clientSecrets"
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
            <a-divider>Claims</a-divider>
            <a-table
              ref="claimsTable"
              size="small"
              rowKey="rowKey"
              class="form-input-table"
              :columns="claimColumns"
              :data-source="claims"
              :pagination="false"
              bordered
            >
              <template slot="type" slot-scope="text, record">
                <div>
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    size="small"
                    @change="e => changeClaim(record.rowKey, 'type', e.target.value)"
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
                    @change="e => changeClaim(record.rowKey, 'value', e.target.value)"
                  />
                  <template v-else>{{ text }}</template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <span v-if="record.editable">
                  <a @click="() => saveClaim(record.rowKey)">Save</a>
                  <a-divider type="vertical" />
                  <a @click="() => cancelClaim(record.rowKey)">Cancel</a>
                </span>
                <span v-else>
                  <a :disabled="editing" @click="() => editClaim(record.rowKey)">Edit</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="Sure to delete?" @confirm="() => deleteClaim(record.rowKey)">
                    <a href="javascript:;">Delete</a>
                  </a-popconfirm>
                </span>
              </template>
              <template slot="footer">
                <a-button :disabled="editing" class="editable-add-btn" size="small" @click="addClaim">Add Row</a-button>
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
  'clientId',
  'clientName',
  'description',
  'protocolType',
  'requireClientSecret',
  'clientUri',
  'logoUri',
  'requireConsent',
  'allowRememberConsent',
  'requirePkce',
  'allowPlainTextPkce',
  'requireRequestObject',
  'allowAccessTokensViaBrowser',
  'frontChannelLogoutUri',
  'frontChannelLogoutSessionRequired',
  'backChannelLogoutUri',
  'backChannelLogoutSessionRequired',
  'allowOfflineAccess',
  'alwaysIncludeUserClaimsInIdToken',
  'identityTokenLifetime',
  'accessTokenLifetime',
  'authorizationCodeLifetime',
  'absoluteRefreshTokenLifetime',
  'slidingRefreshTokenLifetime',
  'consentLifetime',
  'refreshTokenUsage',
  'refreshTokenExpiration',
  'updateAccessTokenClaimsOnRefresh',
  'accessTokenType',
  'enableLocalLogin',
  'includeJwtId',
  'alwaysSendClientClaims',
  'clientClaimsPrefix',
  'pairWiseSubjectSalt',
  'userSsoLifetime',
  'userCodeType',
  'deviceCodeLifetime',
  'allowedGrantTypes',
  'allowedScopes',
  'redirectUris',
  'postLogoutRedirectUris',
  'identityProviderRestrictions',
  'allowedIdentityTokenSigningAlgorithms',
  'allowedCorsOrigins'
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

const claimColumns = [
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
    title: 'Operation',
    dataIndex: 'operation',
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
    this.inputLayout = {
      labelCol: {
        sm: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 18 }
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
    this.numberLayout = {
      labelCol: {
        sm: { span: 14 }
      },
      wrapperCol: {
        sm: { span: 10 }
      }
    }
    this.radioLayout = {
      labelCol: {
        sm: { span: 14 }
      },
      wrapperCol: {
        sm: { span: 10 }
      }
    }
    this.timeLayout = {
      labelCol: {
        sm: { span: 9 }
      },
      wrapperCol: {
        sm: { span: 15 }
      }
    }

    this.secretColumns = secretColumns
    this.claimColumns = claimColumns
    this.propertyColumns = propertyColumns

    return {
      editing: false,
      client: null,
      allScopes: [],
      clientSecrets: [],
      claims: [],
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
        rowKey: this.getUnusedKey(this.clientSecrets),
        id: 0,
        type: 'SharedSecret',
        value: '',
        description: '',
        expiration: null,
        editable: true
      }
      this.clientSecrets = [...this.clientSecrets, newData]
      this.editing = true
    },
    editSecret (rowKey) {
      const clientSecrets = [...this.clientSecrets]
      const target = clientSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        target.editable = true
        this.clientSecrets = clientSecrets
        this.editing = true
      }
    },
    saveSecret (rowKey) {
      const clientSecrets = [...this.clientSecrets]
      const target = clientSecrets.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.client.clientSecrets.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.client.clientSecrets.push({ ...target })
        }
        target.editable = false
        this.clientSecrets = clientSecrets
      }

      this.editing = false
    },
    cancelSecret (rowKey) {
      let clientSecrets = [...this.clientSecrets]
      const target = clientSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.client.clientSecrets.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          clientSecrets = this.clientSecrets.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.clientSecrets = clientSecrets
      }
      this.editing = false
    },
    changeSecret (rowKey, dataIndex, value) {
      const target = this.clientSecrets.find(item => item.rowKey === rowKey)
      if (target) {
        target[dataIndex] = value
      }
    },
    deleteSecret (rowKey) {
      const target = this.clientSecrets.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.clientSecrets = this.clientSecrets.filter(item => item.rowKey !== rowKey)
        this.client.clientSecrets = this.client.clientSecrets.filter(item => item.rowKey !== rowKey)
      }
    },
    addClaim () {
      const newData = {
        rowKey: this.getUnusedKey(this.claims),
        id: 0,
        type: '',
        value: '',
        valueType: 'http://www.w3.org/2001/XMLSchema#string',
        editable: true
      }
      this.claims = [...this.claims, newData]
      this.editing = true
    },
    editClaim (rowKey) {
      const claims = [...this.claims]
      const target = claims.find(item => item.rowKey === rowKey)
      if (target) {
        target.editable = true
        this.claims = claims
        this.editing = true
      }
    },
    saveClaim (rowKey) {
      const claims = [...this.claims]
      const target = claims.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.client.claims.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.client.claims.push({ ...target })
        }
        target.editable = false
        this.claims = claims
      }

      this.editing = false
    },
    cancelClaim (rowKey) {
      let claims = [...this.claims]
      const target = claims.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.client.claims.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          claims = this.claims.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.claims = claims
      }
      this.editing = false
    },
    changeClaim (rowKey, dataIndex, value) {
      const target = this.claims.find(item => item.rowKey === rowKey)
      if (target) {
        target[dataIndex] = value
      }
    },
    deleteClaim (rowKey) {
      const target = this.claims.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.claims = this.claims.filter(item => item.rowKey !== rowKey)
        this.client.claims = this.client.claims.filter(item => item.rowKey !== rowKey)
      }
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
      console.log('edit property begin, rowKey: ' + rowKey, this.properties, this.client.properties)

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
      console.log('save property begin, rowKey: ' + rowKey, this.properties, this.client.properties)

      const properties = [...this.properties]
      const target = properties.find(item => rowKey === item.rowKey)
      if (target) {
        const target1 = this.client.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target1, target)
        } else {
          this.client.properties.push({ ...target })
        }
        target.editable = false
        this.properties = properties
      }

      this.editing = false

      console.log('save property end, rowKey: ' + rowKey, this.properties, this.client.properties)
    },
    cancelProperty (rowKey) {
      console.log('cancel property begin, rowKey: ' + rowKey, this.properties, this.client.properties)

      let properties = [...this.properties]
      const target = properties.find(item => item.rowKey === rowKey)
      if (target) {
        const target1 = this.client.properties.find(item => item.rowKey === rowKey)
        if (target1) {
          Object.assign(target, target1)
        } else {
          properties = this.properties.filter(item => item.rowKey !== rowKey)
        }

        target.editable = false
        this.properties = properties
      }
      this.editing = false

      console.log('cancel property end, rowKey: ' + rowKey, this.properties, this.client.properties)
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
      console.log('delete property begin, rowKey: ' + rowKey, this.properties, this.client.properties)

      const target = this.properties.filter(item => item.rowKey !== rowKey)
      if (target) {
        this.properties = this.properties.filter(item => item.rowKey !== rowKey)
        this.client.properties = this.client.properties.filter(item => item.rowKey !== rowKey)
      }

      console.log('delete property end, rowKey: ' + rowKey, this.clapropertiesims, this.client.properties)
    }
  },
  created () {
    console.log('custom modal created')

    fields.forEach(v => this.form.getFieldDecorator(v))

    this.$watch('model', () => {
      this.editing = false
      this.client = this.model.data
      this.allScopes = this.model.allScopes
      this.clientSecrets = this.client.clientSecrets.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })
      this.claims = this.client.claims.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })
      this.properties = this.client.properties.map((item, index) => {
        item.rowKey = index
        return { ...item, rowKey: index }
      })

      this.form.setFieldsValue(pick(this.client, fields))
    })
  }
}
</script>
