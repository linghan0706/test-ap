import http from '../../http'
import type { GetTasksMain } from '../../../types/tasks'

// 对于鉴权接口使用fetchTasksCenter()函数注入认证
export async function fetchTasksCenter(): Promise<GetTasksMain> {
  console.log('GET /api/tasks/center')
  const res = await http.get('/api/tasks/center')
  console.log('GET /api/tasks/center 响应:', res)
  return res as unknown as GetTasksMain
}
