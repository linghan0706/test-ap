'use client'

import { useState } from 'react'
import Link from 'next/link'
import Loading from '@/components/ui/Loading'
import InitialLoading from '@/components/ui/InitialLoading'

export default function LoadingGuideTestPage() {
  const [testStage, setTestStage] = useState<'initial' | 'guidance' | 'complete'>('initial')
  const [showClearButton, setShowClearButton] = useState(true)

  const handleInitialComplete = () => {
    setTestStage('guidance')
  }

  const handleGuidanceComplete = () => {
    setTestStage('complete')
  }

  const resetTest = () => {
    setTestStage('initial')
    setShowClearButton(true)
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('nova-explorer-guidance-completed')
    alert('LocalStorage 已清除！刷新页面或返回首页即可重新体验引导流程。')
    setShowClearButton(false)
  }

  if (testStage === 'initial') {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 space-x-2">
          <button
            onClick={resetTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重置测试
          </button>
          {showClearButton && (
            <button
              onClick={clearLocalStorage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              清除缓存
            </button>
          )}
        </div>
        <InitialLoading onLoadingComplete={handleInitialComplete} />
      </div>
    )
  }

  if (testStage === 'guidance') {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 space-x-2">
          <button
            onClick={resetTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重置测试
          </button>
          {showClearButton && (
            <button
              onClick={clearLocalStorage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              清除缓存
            </button>
          )}
        </div>
        <Loading onComplete={handleGuidanceComplete} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">引导流程测试完成！</h1>
        <p className="text-xl text-gray-300">
          恭喜！您已经完成了完整的7页引导流程测试。
        </p>
        
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold mb-3">测试结果验证：</h2>
            <ul className="text-left space-y-2 text-sm">
              <li>✅ 组件正常显示</li>
            </ul>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新测试
            </button>
            
            {showClearButton && (
              <button
                onClick={clearLocalStorage}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                清除缓存
              </button>
            )}
            
                        <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}