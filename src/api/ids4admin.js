import ids4Request from '@/utils/ids4Request'

const api = {
  apiScopeList: '/ApiScope/List',
  apiScopeView: '/ApiScope/View',
  apiScopeInit: '/ApiScope/Init',
  apiScopeInsert: '/ApiScope/Insert',
  apiScopeUpdate: '/ApiScope/Update',
  apiScopeDelete: '/ApiScope/Delete',

  apiResourceList: '/ApiResource/List',
  apiResourceView: '/ApiResource/View',
  apiResourceInit: '/ApiResource/Init',
  apiResourceInsert: '/ApiResource/Insert',
  apiResourceUpdate: '/ApiResource/Update',
  apiResourceDelete: '/ApiResource/Delete',

  identityResourceList: '/IdentityResource/List',
  identityResourceView: '/IdentityResource/View',
  identityResourceInit: '/IdentityResource/Init',
  identityResourceInsert: '/IdentityResource/Insert',
  identityResourceUpdate: '/IdentityResource/Update',
  identityResourceDelete: '/IdentityResource/Delete',

  clientList: '/Client/List',
  clientView: '/Client/View',
  clientInit: '/Client/Init',
  clientInsert: '/Client/Insert',
  clientUpdate: '/Client/Update',
  clientDelete: '/Client/Delete',

  deviceFlowCodeList: '/DeviceFlowCode/List',
  deviceFlowCodeView: '/DeviceFlowCode/View',
  deviceFlowCodeDelete: '/DeviceFlowCode/Delete',

  persistedGrantList: '/PersistedGrant/List',
  persistedGrantView: '/PersistedGrant/View',
  persistedGrantDelete: '/PersistedGrant/Delete'
}

const request = {
  header: {
    version: 1,
    requestId: () => {
      var valueString = '0123456789abcdef'
      var guidString = []
      for (var i = 0; i < 32; i++) {
        guidString[i] = valueString.charAt(Math.ceil(Math.random() * 16) - 1)
      }
      return guidString.join('')
    },
    culture: 'en-US'
  }
}

export default api

export function actionRequest (actionUrl, parameter) {
  if (parameter) {
    request.body = parameter
  }

  return new Promise((resolve, reject) => {
    ids4Request({
      url: actionUrl,
      method: 'post',
      data: request
    })
      .then(response => {
        if (response.header.isSuccess) {
          return resolve(response.body)
        } else {
          return reject(response.header.errors[0])
        }
      })
      .catch(error => {
        const error1 = { code: 'SystemError', message: error.message }
        reject(error1)
      })
  })
}

export function getApiScopeList (parameter) {
  return actionRequest(api.apiScopeList, parameter)
}

export function getApiScopeView (parameter) {
  return actionRequest(api.apiScopeView, parameter)
}

export function getApiScopeInit () {
  return actionRequest(api.apiScopeInit)
}

export function insertApiScope (parameter) {
  return actionRequest(api.apiScopeInsert, parameter)
}

export function updateApiScope (parameter) {
  return actionRequest(api.apiScopeUpdate, parameter)
}

export function deleteApiScope (parameter) {
  return actionRequest(api.apiScopeDelete, parameter)
}

export function getApiResourceList (parameter) {
  return actionRequest(api.apiResourceList, parameter)
}

export function getApiResourceView (parameter) {
  return actionRequest(api.apiResourceView, parameter)
}

export function getApiResourceInit () {
  return actionRequest(api.apiResourceInit)
}

export function insertApiResource (parameter) {
  return actionRequest(api.apiResourceInsert, parameter)
}

export function updateApiResource (parameter) {
  return actionRequest(api.apiResourceUpdate, parameter)
}

export function deleteApiResource (parameter) {
  return actionRequest(api.apiResourceDelete, parameter)
}

export function getIdentityResourceList (parameter) {
  return actionRequest(api.identityResourceList, parameter)
}

export function getIdentityResourceView (parameter) {
  return actionRequest(api.identityResourceView, parameter)
}

export function getIdentityResourceInit () {
  return actionRequest(api.identityResourceInit)
}

export function insertIdentityResource (parameter) {
  return actionRequest(api.identityResourceInsert, parameter)
}

export function updateIdentityResource (parameter) {
  return actionRequest(api.identityResourceUpdate, parameter)
}

export function deleteIdentityResource (parameter) {
  return actionRequest(api.identityResourceDelete, parameter)
}

export function getClientList (parameter) {
  return actionRequest(api.clientList, parameter)
}

export function getClientView (parameter) {
  return actionRequest(api.clientView, parameter)
}

export function getClientInit () {
  return actionRequest(api.clientInit)
}

export function insertClient (parameter) {
  return actionRequest(api.clientInsert, parameter)
}

export function updateClient (parameter) {
  return actionRequest(api.clientUpdate, parameter)
}

export function deleteClient (parameter) {
  return actionRequest(api.clientDelete, parameter)
}

export function getDeviceFlowCodeList (parameter) {
  return actionRequest(api.deviceFlowCodeList, parameter)
}

export function getDeviceFlowCodeView (parameter) {
  return actionRequest(api.deviceFlowCodeView, parameter)
}

export function deleteDeviceFlowCode (parameter) {
  return actionRequest(api.deviceFlowCodeDelete, parameter)
}

export function getPersistedGrantList (parameter) {
  return actionRequest(api.persistedGrantList, parameter)
}

export function getPersistedGrantView (parameter) {
  return actionRequest(api.persistedGrantView, parameter)
}

export function deletePersistedGrant (parameter) {
  return actionRequest(api.persistedGrantDelete, parameter)
}
