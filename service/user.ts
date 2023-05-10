import request from '.'

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
export const uploadFile = (data: any) => {
  return request({
    url: '/uploadFile',
    method: 'post',
    data
  })
}
