import Request from '.'
import type { IResultData } from '.'
export const getHomeInfo = () => {
  return Request.get<IResultData<any>>('/home/info')
}
