// 定义 Telegram WebApp 类型
interface TelegramWebApp {
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
    notificationOccurred: (type: 'success' | 'error' | 'warning') => void
  }
}
// 声明 Telegram WebApp 全局变量
declare const Telegram: {
  WebApp: {
    HapticFeedback: {
      impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
      notificationOccurred: (type: 'success' | 'error' | 'warning') => void
    }
  }
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
// 方式一
function vibrateLight() {
  window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
}

// 方式二
function vibrateLights() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  } else {
    console.warn('震动触发：轻微')
  }
}

{
  /** 方法调用
   *方式一与方式二区别
   *方式一：采用直接调用，因存在类型访问不安全报错，没有进行变量环境检查，虽然进行了类型定义
   *方式二：使用判断语句进行环境检查
   */
}

{
  /**其他解决
   * 1、声明全局Telegram变量
   * 
   *   declare const Telegram: {
   * WebApp: {
   * HapticFeedback: {
   * impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
   *  notificationOccurred: (type: 'success' | 'error' | 'warning') => void;
   *    }; 
   *   };
   * };
    * 2、使用 TypeScript 的非空断言操作符
    * function vibrateLight() {
    *  window.Telegram!.WebApp.HapticFeedback.impactOccurred('light');
    * }
    */
}
