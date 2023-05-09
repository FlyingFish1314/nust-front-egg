// import Request from '.'
import request from '.'
import type { IRegisterReq } from '@/interface/login'

export const getLogin = (data: any) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}
export const getRegister = (data: IRegisterReq) => {
  return request({
    url: '/user/register',
    method: 'POST',
    data
  })
}

export const getSendCode = (data: string) => {
  return request({
    url: `/sendcode?email=${data}`,
    method: 'get'
  })
}
