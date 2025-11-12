'use client'
import dynamic from 'next/dynamic'
const MotionDiv = dynamic(() => import('@/components/motion/MotionDiv'), {
  ssr: false,
})
import { useState } from 'react'

import backImage from '@/public/backImage.png'
import Image from 'next/image'

/**
 * task接口json格式
{
  id:number,          任务id
  title:string,       任务标题
  reward:number,      奖励数值
  status:TaskStatus,  任务状态/任务进度
  progress?: {current: number，total: number}  
  taskicon: string    任务图标
  badgeicon: string   徽章图标
}
*/

// 任务状态类型
type TaskStatus = 'completed' | 'in_progress' | 'pending'

// 任务数据接口
interface Task {
  id: number
  title: string
  reward: number
  status: TaskStatus
  progress?: {
    current: number
    total: number
  }
  taskicon: string
  badgeicon: string
}

export default function TaskPage() {
  // 任务状态管理
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Daily Check-in',
      reward: 1000,
      status: 'completed',
      taskicon: '/task/taskicon/daily.svg',
      badgeicon: '/task/badgeicon/powers.svg',
    },
    {
      id: 2,
      title: 'Follow X',
      reward: 1000,
      status: 'pending',
      taskicon: '/task/taskicon/x.svg',
      badgeicon: '/task/badgeicon/diamond.svg',
    },
    {
      id: 3,
      title: 'Follow the Channel',
      reward: 1000,
      status: 'completed',
      taskicon: '/task/taskicon/telegram.svg',
      badgeicon: '/task/badgeicon/diamond.svg',
    },
    {
      id: 4,
      title: 'Invite 5 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 2,
        total: 5,
      },
      taskicon: '/task/taskicon/invite5.svg',
      badgeicon: '/task/badgeicon/crown.svg',
    },
    {
      id: 5,
      title: 'Invite 10 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 9,
        total: 10,
      },
      taskicon: '/task/taskicon/invite10.svg',
      badgeicon: '/task/badgeicon/crown.svg',
    },
    {
      id: 6,
      title: 'Invite 50 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 40,
        total: 50,
      },
      taskicon: '/task/taskicon/invite50.svg',
      badgeicon: '/task/badgeicon/highest.svg',
    },
    {
      id: 7,
      title: 'Invite 100 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 99,
        total: 100,
      },
      taskicon: '/task/taskicon/invite100.svg',
      badgeicon: '/task/badgeicon/highest.svg',
    },
  ])

  // 任务操作函数
  const handleTaskAction = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === 'pending') {
            return { ...task, status: 'completed' as TaskStatus }
          }
          if (
            task.status === 'in_progress' &&
            task.progress &&
            task.progress.current >= task.progress.total
          ) {
            return { ...task, status: 'completed' as TaskStatus }
          }
        }
        return task
      })
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14">
      {/* 背景容器 */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        {/* 椭圆径向渐变遮罩层 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107,10,233,0.4) 0%, rgba(100,16,177,0.2) 40%, rgba(94,50,172,0.1) 80%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        ></div>
      </div>

      {/* 头部标题区域*/}
      <div className="flex flex-col items-center pt-12 sm:pt-16 space-y-3 sm:space-y-4 relative z-10 px-4">
        <h1 className="font-jersey-10 text-[36px] sm:text-[40px] leading-[22px] sm:leading-[48px] text-white font-normal tracking-wide text-center">
          Task Center
        </h1>
        <p className="font-exo2 text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px] text-center text-[#B2B2B2] font-normal max-w-[280px] sm:max-w-[300px]">
          Complete tasks to get rewards
        </p>
      </div>

      {/* 任务列表  */}
      <div className="mt-6 sm:mt-8 px-3 sm:px-4 space-y-3 max-w-[380px] sm:max-w-[400px] mx-auto">
        {tasks.map((task, index) => (
          <MotionDiv
            key={task.id}
            className="relative w-full h-[80px] sm:h-[88px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
          >
            {/* 背景模糊*/}
            <div
              className="absolute inset-0 backdrop-blur-[25px] rounded-[14px] sm:rounded-[16px] border border-white/10"
              style={{ backdropFilter: 'blur(25px)' }}
            />

            {/* 主背景  */}
            <div
              className="absolute inset-0 rounded-[14px] sm:rounded-[16px]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(34,26,76,0.9) 0%, rgba(34,26,76,0.7) 100%)',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            />

            {/* 内容容器 */}
            <div className="relative w-full h-full flex items-center px-3 sm:px-4">
              {/* 左侧图标和文本区域 */}
              <div className="flex items-center flex-1 min-w-0">
                {/* 图标容器  */}
                <div className="w-[48px] h-[48px] sm:w-[48px] sm:h-[48px] flex items-center justify-center relative flex-shrink-0">
                  {/* 图标背景圆圈 */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(107,10,233,0.3) 0%, rgba(100,16,177,0.3) 100%)',
                    }}
                  />
                  {/* 主任务图标 */}
                  {typeof task.taskicon === 'string' &&
                  /\.(png|jpg|jpeg|svg|gif)$/i.test(task.taskicon) ? (
                    <Image
                      src={task.taskicon}
                      alt={task.title}
                      width={48}
                      height={48}
                      className="relative z-10"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    <span className="text-[24px] sm:text-[28px] relative z-10">
                      {task.taskicon || '🎉'}
                    </span>
                  )}
                </div>

                {/* 文本信息 */}
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  {/* 任务标题 */}
                  <div className="text-white text-[22px] sm:text-[20px] leading-[22px] sm:leading-[24px] font-normal font-jersey-10 mb-1 truncate">
                    {task.title}
                  </div>

                  {/* 奖励信息 */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* 徽章图标（统一使用图片 26×26，非图片字符串兼容显示）*/}
                    {typeof task.badgeicon === 'string' &&
                    /\.(png|jpg|jpeg|svg|gif)$/i.test(task.badgeicon) ? (
                      <Image
                        src={task.badgeicon}
                        alt="badge"
                        width={26}
                        height={26}
                        className="flex-shrink-0"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    ) : (
                      <span className="text-[14px] sm:text-[16px] flex-shrink-0">
                        {task.badgeicon}
                      </span>
                    )}
                    {/* 奖励数值 */}
                    <span className="text-white text-[14px] sm:text-[16px] leading-[22px] sm:leading-[20px] font-normal font-exo2 text-center">
                      *{task.reward.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 右侧区域 - 进度条和按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                {/* 进度条 */}
                {task.progress && task.progress.total > 0 && (
                  <div className="flex flex-col items-center w-[65px] justify-end mb-[-17px]">
                    <span className="text-white text-[11px] font-jersey-25 text-center leading-tight">
                      {task.progress.current}/{task.progress.total}
                    </span>
                    <div className="w-full h-[7px] bg-gray-700/50 rounded-full overflow-hidden mb-1 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#EE3BA7] to-[#B448FB] transition-all duration-200 rounded-full shadow-sm"
                        style={{
                          width: `${Math.min(Math.max((task.progress.current / task.progress.total) * 100, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Check 按钮  */}
                <div className="flex-shrink-0">
                  <button
                    className={`
                       px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] w-[69px] height-[34px] sm:rounded-[12px] min-w-[70px] sm:min-w-[80px] h-[36px] sm:h-[40px]
                       flex items-center justify-center
                       text-white text-[16px] sm:text-[16px] leading-[22px] sm:leading-[20px] font-normal font-jersey-10
                       transition-all duration-300 transform
                       ${
                         task.status === 'completed'
                           ? 'bg-gray-600/60 cursor-not-allowed opacity-70'
                           : 'bg-gradient-to-r from-[#6B0AE9] to-[#6410B1] hover:from-[#7B1AF9] hover:to-[#7420C1] hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl active:scale-95'
                       }
                     `}
                    disabled={task.status === 'completed'}
                    onClick={() => handleTaskAction(task.id)}
                  >
                    {task.status === 'completed' ? 'Done' : 'Check'}
                  </button>
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  )
}
