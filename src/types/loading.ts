// 加载页面数据类型定义
export interface LoadingPageData {
  id: string
  icon: string
  title: string
  subtitle?: string
  description: string
}

// 星星粒子类型定义
export interface StarParticle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

// 行星轨道类型定义
export interface PlanetOrbit {
  radius: number
  speed: number
  size: number
  color: string
}

// 动画配置类型定义
export interface AnimationConfig {
  duration: number
  delay?: number
  ease?: string | number[]
  repeat?: number
}

// 组件状态类型定义
export interface LoadingState {
  currentPage: number
  progress: number
  isTransitioning: boolean
}