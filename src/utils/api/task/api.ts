import http from '../../http'
import type { GetTasksMain } from '../../../types/tasks'

// 对于鉴权接口使用fetchTasksCenter()函数注入认证
export async function fetchTasksCenter(): Promise<GetTasksMain> {
  const res = await http.get('/tasks/center')
  console.log('GET /api/tasks/center 响应获取到的:', res)
  return res as unknown as GetTasksMain
}
