// 账户管理api
import { get } from '@/utils/request'
// 顾客账户相关接口
export function pageQueryCustomerAccount(data) {
  return get('/account/pageQueryCustomerAccount', data)
}
// 员工账户相关接口
export function pageQueryEmployeeAccount(data) {
  return get('/account/pageQueryEmployeeAccount', data)
}
// 系统账户相关接口
export function pageQuerySystemAccount(data) {
  return get('/account/pageQuerySystemAccount', data)
}
