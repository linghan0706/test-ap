import { LoadingPageData } from '@/types/loading'

// 加载页面数据配置 - 与Loading.tsx保持一致
export const LOADING_DATA: LoadingPageData[] = [
  {
    id: '1',
    icon: '/LoadingIcon/CionOne.png',
    title: 'Welcome to NovaExplorer',
    description: 'Collect energy and search for spaceship parts'
  },
  {
    id: '2',
    icon: '/LoadingIcon/CionTwo.png',
    title: '23123',
    subtitle: 'Blue Star',
    description: 'Collect energy and search for spaceship parts'
  },
  {
    id: '3',
    icon: '/LoadingIcon/CionThree.png',
    title: '',
    subtitle: 'Solar System',
    description: 'Learn the planets and explore the mysteries'
  },
  {
    id: '4',
    icon: '/LoadingIcon/CionFour.png',
    title: '',
    subtitle: 'Galaxy',
    description: 'Explore the enormous and challenge the unknown'
  },
  {
    id: '5',
    icon: '/LoadingIcon/CionFive.png',
    title: '',
    subtitle: 'Infinite Universe',
    description: 'The space turns become a legend'
  },
  {
    id: '6',
    icon: '/LoadingIcon/CionSix.png',
    title: 'Star-Universe UN Heart NFT',
    description: 'your legend, eternally written in the cosmos'
  }
]

// 动画配置常量
export const ANIMATION_CONFIG = {
  PAGE_TRANSITION_DURATION: 3000, // 页面切换间隔（毫秒）
  PROGRESS_UPDATE_INTERVAL: 50,   // 进度条更新间隔（毫秒）
  ICON_TRANSITION_DURATION: 0.6,  // 图标切换动画时长（秒）
  TEXT_TRANSITION_DELAY: 0.2,     // 文本动画延迟（秒）
  STAR_ANIMATION_DURATION: 2,     // 星星动画时长（秒）
  ORBIT_SPEEDS: [20, 15, 12],     // 轨道行星速度（秒）
} as const