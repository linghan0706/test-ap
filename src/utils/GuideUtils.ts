// 布局工具函数 - 用于处理SVG渲染和主图标的间距管理

export interface LayoutBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface SpacingConfig {
  minSafeDistance: number
  mainIconBounds: LayoutBounds
  titleAreaBounds: LayoutBounds
  descriptionAreaBounds: LayoutBounds
}

// 间距要求配置
export const SPACING_REQUIREMENTS = {
  // 主图标与其他元素的最小安全间距
  MIN_SAFE_DISTANCE: 24, // 24px 确保足够的视觉分离
  
  // 主图标区域边界定义
  MAIN_ICON_BOUNDS: {
    width: 320,  // w-80
    height: 256, // h-64
    centerX: 160, // 相对于容器中心
    centerY: 128  // 相对于容器中心
  },
  
  // 标题区域边界定义
  TITLE_AREA_BOUNDS: {
    width: 285,  // 最大宽度
    height: 140, // 固定高度
    marginBottom: 24 // mb-6
  },
  
  // SVG椭圆底盘边界定义
  SVG_ELLIPSE_BOUNDS: {
    width: 378,
    height: 40,
    offsetY: 8 // translate-y-2
  },
  
  // 响应式断点
  BREAKPOINTS: {
    mobile: 640,
    tablet: 768,
    desktop: 1024
  }
} as const

// 边界检测函数
export function detectCollision(
  element1: LayoutBounds,
  element2: LayoutBounds,
  minDistance: number = SPACING_REQUIREMENTS.MIN_SAFE_DISTANCE
): boolean {
  const dx = Math.abs(element1.x - element2.x)
  const dy = Math.abs(element1.y - element2.y)
  
  const minRequiredDistanceX = (element1.width + element2.width) / 2 + minDistance
  const minRequiredDistanceY = (element1.height + element2.height) / 2 + minDistance
  
  return dx < minRequiredDistanceX && dy < minRequiredDistanceY
}

// 智能避让算法
export function calculateAvoidancePosition(
  targetElement: LayoutBounds,
  obstacleElement: LayoutBounds,
  containerBounds: LayoutBounds,
  minDistance: number = SPACING_REQUIREMENTS.MIN_SAFE_DISTANCE
): LayoutBounds {
  const avoidanceOptions = [
    // 向下移动
    {
      ...targetElement,
      y: obstacleElement.y + obstacleElement.height + minDistance
    },
    // 向上移动
    {
      ...targetElement,
      y: obstacleElement.y - targetElement.height - minDistance
    },
    // 向左移动
    {
      ...targetElement,
      x: obstacleElement.x - targetElement.width - minDistance
    },
    // 向右移动
    {
      ...targetElement,
      x: obstacleElement.x + obstacleElement.width + minDistance
    }
  ]
  
  // 选择最佳避让位置（优先保持垂直布局）
  for (const option of avoidanceOptions) {
    if (isWithinContainer(option, containerBounds)) {
      return option
    }
  }
  
  // 如果没有合适的避让位置，返回原位置
  return targetElement
}

// 检查元素是否在容器边界内
export function isWithinContainer(
  element: LayoutBounds,
  container: LayoutBounds
): boolean {
  return (
    element.x >= container.x &&
    element.y >= container.y &&
    element.x + element.width <= container.x + container.width &&
    element.y + element.height <= container.y + container.height
  )
}

// 响应式间距计算
export function getResponsiveSpacing(screenWidth: number): number {
  if (screenWidth < SPACING_REQUIREMENTS.BREAKPOINTS.mobile) {
    return SPACING_REQUIREMENTS.MIN_SAFE_DISTANCE * 0.75 // 18px
  } else if (screenWidth < SPACING_REQUIREMENTS.BREAKPOINTS.tablet) {
    return SPACING_REQUIREMENTS.MIN_SAFE_DISTANCE // 24px
  } else {
    return SPACING_REQUIREMENTS.MIN_SAFE_DISTANCE * 1.25 // 30px
  }
}

// 动画过渡配置
export const TRANSITION_CONFIG = {
  duration: 300, // 300ms 符合要求
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  properties: ['transform', 'opacity', 'width', 'height']
} as const

// 布局验证函数
export function validateLayout(elements: LayoutBounds[]): {
  isValid: boolean
  conflicts: Array<{ element1: number; element2: number }>
} {
  const conflicts: Array<{ element1: number; element2: number }> = []
  
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      if (detectCollision(elements[i], elements[j])) {
        conflicts.push({ element1: i, element2: j })
      }
    }
  }
  
  return {
    isValid: conflicts.length === 0,
    conflicts
  }
}