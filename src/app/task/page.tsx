'use client'

import { motion } from 'framer-motion'

import backImage from '@/public/backImage.png'
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
  // 任务数据
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Daily Check-in',
      reward: 1000,
      status: 'completed',
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 2,
      title: 'Follow X',
      reward: 1000,
      status: 'pending',
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 3,
      title: 'Follow the Channel',
      reward: 1000,
      status: 'completed',
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 4,
      title: 'Invite 5 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 4,
        total: 5
      },
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 5,
      title: 'Invite 10 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 9,
        total: 10
      },
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 6,
      title: 'Invite 50 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 49,
        total: 50
      },
      taskicon: '🎉',
      badgeicon: '🎖️'
    },
    {
      id: 7,
      title: 'Invite 100 people',
      reward: 1000,
      status: 'in_progress',
      progress: {
        current: 99,
        total: 100
      },
      taskicon: '🎉',
      badgeicon: '🎖️'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* 背景容器 */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        {/* 椭圆径向渐变遮罩层 */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(94,50,172,0.3) 0%, rgba(94,50,172,0.15) 40%, rgba(94,50,172,0) 80%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        ></div>
      </div>
      
      {/* 头部标题区域 */}
      <div className="flex flex-col items-center pt-20 space-y-6 relative z-10">
    
          <span className="m-0 p-0 font-jersey-25 text-[36px] leading-[22px] text-white w-[166px] h-[22px]">Task Center</span>
      
        <div className="font-jersey-25 text-[16px] leading-[22px] text-center text-[#878787] w-[254px] h-[22px] px-4 py-1 rounded font-normal">
          Complete tasks to get rewards
        </div>
      </div>

      {/* 任务列表 */}
      <div className="mt-9 px-4 space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="relative w-[361px] h-[80px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* 背景模糊效果 */}
            <div 
              className="absolute inset-0 backdrop-blur-[20.5px] rounded-[12px]"
              style={{ backdropFilter: 'blur(20.5px)' }}
            />
            
            {/* 主背景 */}
            <div className="absolute inset-0 bg-[#221A4C] rounded-[12px]" />
            
            {/* 内容容器 */}
            <div className="relative w-full h-full flex items-center px-3">
              {/* 左侧图标和文本区域 */}
              <div className="flex items-center flex-1">
                {/* 图标容器 */}
                <div className="w-[47px] h-[47px] flex items-center justify-center text-2xl relative">
                  {/* 主任务图标 */}
                  <span className="text-3xl">{task.taskicon}</span>
                </div>
                
                {/* 文本信息 */}
                <div className="ml-3 flex-1">
                  {/* 任务标题 */}
                  <div 
                    className="text-white text-[22px] leading-[22px] font-normal font-jersey-25"
                  >
                    {task.title}
                  </div>
                  
                  {/* 奖励信息 */}
                  <div className="flex items-center gap-[6px] mt-1">
                    {/* 徽章图标 */}
                    <span className="text-sm ">{task.badgeicon}</span>
                    {/* 奖励数值 */}
                    <span 
                      className="text-[#B2B2B2] text-[14px] leading-[22px] font-normal font-jersey-25"
                    >
                      +{task.reward}
                    </span>
                  </div>
                  
                  {/* 进度条（仅对有进度的任务显示） */}
                  {task.progress && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                            style={{ 
                              width: `${(task.progress.current / task.progress.total) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-white text-xs">
                          {task.progress.current}/{task.progress.total}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 右侧按钮 */}
              <div className="ml-4">
                <button
                  className={`
                    px-3 py-[6px] rounded-[8px] min-w-[69px] h-[34px]
                    flex items-center justify-center
                    text-white text-[16px] leading-[22px] font-normal font-jersey-25
                    transition-all duration-200
                    ${
                      task.status === 'completed' || 
                      (task.status === 'in_progress' && task.progress && task.progress.current < task.progress.total)
                        ? 'bg-gray-500 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-[#6B0AE9] to-[#6410B1] hover:opacity-90 cursor-pointer'
                    }
                    shadow-[0px_4px_4px_rgba(255,255,255,0.02)]
                  `}
                  disabled={
                    task.status === 'completed' || 
                    (task.status === 'in_progress' && task.progress && task.progress.current < task.progress.total)
                  }
                  onClick={() => {
                    if (task.status === 'pending' || 
                        (task.status === 'in_progress' && task.progress && task.progress.current >= task.progress.total)) {
                      console.log(`Checking task: ${task.title}`)
                      // TODO: 在这里添加任务验证和奖励领取的逻辑
                    }
                  }}
                >
                  {task.status === 'completed' 
                    ? 'Done' 
                    : (task.status === 'in_progress' && task.progress && task.progress.current < task.progress.total)
                      ? `${task.progress.current}/${task.progress.total}`
                      : 'Check'
                  }
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
