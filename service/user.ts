import request from '.'

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
export const uploadFile = (config: any) => {
  return request({
    url: '/uploadFile',
    method: 'post',
    data: config.data,
    onUploadProgress: config.onUploadProgress
  })
}
