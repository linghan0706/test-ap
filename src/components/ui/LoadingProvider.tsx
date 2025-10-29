'use client'

import { useState, useEffect } from 'react'
import InitialLoading from './InitialLoading'
import Loading from './Loading'

interface LoadingProviderProps {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingStage, setLoadingStage] = useState<'initial' | 'guidance' | 'complete'>('initial')

  // 检查是否已经完成过引导流程
  useEffect(() => {
    const hasCompletedGuidance = localStorage.getItem('nova-explorer-guidance-completed')
    if (hasCompletedGuidance === 'true') {
      setLoadingStage('complete')
    }
  }, [])

  const handleInitialLoadingComplete = () => {
    setLoadingStage('guidance')
  }

  const handleGuidanceComplete = () => {
    localStorage.setItem('nova-explorer-guidance-completed', 'true')
    setLoadingStage('complete')
  }

  // 渲染不同的加载阶段
  if (loadingStage === 'initial') {
    return <InitialLoading onLoadingComplete={handleInitialLoadingComplete} />
  }

  if (loadingStage === 'guidance') {
    return <Loading onComplete={handleGuidanceComplete} />
  }

  // 加载完成，显示主应用
  return <>{children}</>
}