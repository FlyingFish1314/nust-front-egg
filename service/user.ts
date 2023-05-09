import request from '.'

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
