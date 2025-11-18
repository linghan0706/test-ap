'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import { useEffect } from 'react'
import {
  retrieveLaunchParams,
  retrieveRawInitData,
} from '@telegram-apps/sdk-react'
import {
  getInitData,
  isTelegramEnvironment,
} from '@/telegramWebApp/telegrambot'
import { initData, telegramLogin } from '@/utils/api'
import { fetchTasksCenter } from '@/utils/api/task/api'
export default function HomePage() {


  useEffect(() => {
    const data = getInitData()
    
    console.log('获取到Telegram InitData:', data)
    console.log('格式处理：',initData)
    if (isTelegramEnvironment()) {
      try {
        const lp = retrieveLaunchParams()
        console.log('SDK LaunchParams:', lp)
      } catch (e) {
        console.warn('读取 LaunchParams 失败（已忽略）:', e)
      }
      let rawInit: string | null = null
      try {
        rawInit = retrieveRawInitData() || null
        console.log('SDK raw initData:', rawInit)
      } catch (e) {
        console.warn('读取 raw initData 失败（已忽略）:', e)
      }

      if (rawInit) {
        telegramLogin()
          .then(res => {
            console.log('Telegram 登录结果:', res);
            if (res.success) {
              console.log('登录成功，用户数据:', res.data);
            } else {
              console.log('登录失败:', res.message);
            }
          })
          .catch(err => {
            console.error('Telegram 登录出错:', err);
          });
      } else {
        console.warn('未获取到 raw initData，跳过登录请求。')
      }
    } else {
      console.warn('当前不在 Telegram 环境，跳过 SDK 参数读取与登录。')
    }
    getTasksMain()
  }, [])
  const getTasksMain=async()=>{
    console.log('开始获取任务中心')
    try{
      const data = await fetchTasksCenter()
      console.log('任务中心接口返回:', data)
    }catch(e){
      console.error('获取任务中心失败:', e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden pb-20">
      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6">
        <MotionDiv
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-2xl font-bold mb-4">个人中心</h1>
          <p className="text-gray-400">个人中心功能开发中...</p>
        </MotionDiv>
      </div>
    </div>
  )
}
