import request from '.'

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
export const uploadFile = (config: any) => {
  console.log('🚀 ~ file: user.ts:10 ~ uploadFile ~ config:', config.data)
  return request({
    url: '/uploadFile',
    method: 'post',
    data: config.data,
    onUploadProgress: config.onUploadProgress
  })
}

export const mergeFile = (config: any) => {
  return request({
    url: '/mergeFile',
    method: 'POST',
    data: config.data
  })
}
