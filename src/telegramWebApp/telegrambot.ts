// Telegram Web App 工具函数
import type { 
  TelegramUser, 
  TelegramInitData,
  TelegramChat
} from '../types';

// 定义 Telegram WebApp 的类型
type TelegramWebApp = NonNullable<Window['Telegram']>['WebApp'];

/**
 * 获取 Telegram WebApp 实例
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

/**
 * 检查是否在 Telegram 环境中运行
 */
export function isTelegramEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const webApp = getTelegramWebApp();
  if (!webApp) return false;
  
  // 检查是否有 initData 或者是否在 Telegram 环境中
  return !!(webApp.initData || (window.Telegram?.WebApp && 'platform' in window.Telegram.WebApp));
}

/**
 * 获取原始 initData 字符串
 */
export function getRawInitData(): string {
  const webApp = getTelegramWebApp();
  return webApp?.initData || '';
}

/**
 * 解析 initData 字符串为对象
 */
export function parseInitData(initDataString: string): TelegramInitData | null {
  if (!initDataString) return null;

  try {
    const params = new URLSearchParams(initDataString);
    const result: Partial<TelegramInitData> = {};

    // 解析用户信息
    const userParam = params.get('user');
    if (userParam) {
      result.user = JSON.parse(decodeURIComponent(userParam)) as TelegramUser;
    }

    // 解析聊天信息
    const chatParam = params.get('chat');
    if (chatParam) {
      result.chat = JSON.parse(decodeURIComponent(chatParam)) as TelegramChat;
    }

    // 解析其他参数
    const authDate = params.get('auth_date');
    if (authDate) {
      result.auth_date = parseInt(authDate, 10);
    }

    const startParam = params.get('start_param');
    if (startParam) {
      result.start_param = startParam;
    }

    const hash = params.get('hash');
    if (hash) {
      result.hash = hash;
    }

    return result as TelegramInitData;
  } catch (error) {
    console.error('Failed to parse initData:', error);
    return null;
  }
}

/**
 * 获取解析后的 initData
 */
export function getInitData(): TelegramInitData | null {
  const rawData = getRawInitData();
  return parseInitData(rawData);
}

/**
 * 获取当前用户信息
 */
export function getTelegramUser(): TelegramUser | null {
  const initData = getInitData();
  return initData?.user || null;
}

/**
 * 获取完整的 initData 并格式化为 JSON
 * 返回格式: { "initData": "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123" }
 */
export function getFormattedInitData(): { initData: string } | null {
  const webApp = getTelegramWebApp();
  
  if (!webApp || !isTelegramEnvironment()) {
    console.warn('Not running in Telegram environment');
    return null;
  }

  // 获取原始 initData 字符串
  const rawInitData = webApp.initData || '';
  
  if (!rawInitData) {
    console.warn('No initData available');
    return null;
  }

  // 完整格式示例
  // const initData = "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123";
  // URL解码后的格式: user={"id":123456}&auth_date=1234567890&hash=abc123
  
  return {
    initData: rawInitData
  };
}

