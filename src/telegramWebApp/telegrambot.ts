'use client';

import type { TelegramUser, TelegramInitData, TelegramChat } from '../types';

/**
 * 获取并初始化 Telegram WebApp
 */
export function initializeTelegramApp() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    console.warn('当前不在 Telegram WebApp 环境中');
    return null;
  }

  const tg = window.Telegram.WebApp;
  tg.ready();
  return tg;
}

/**
 * 获取解析后的 initData
 */
export function getInitData(): TelegramInitData | null {
  const tg = initializeTelegramApp();
  if (!tg) return null;

  const data = tg.initDataUnsafe as {
    user?: {
      id: number;
      first_name: string;
      username?: string;
    };
    auth_date: number;
    hash: string;
    start_param?: string;
    chat?: unknown;
  };

  if (!data) {
    console.warn('未检测到 initDataUnsafe');
    return null;
  }

  const formatted: TelegramInitData = {
    user: data.user ? {
      id: data.user.id,
      first_name: data.user.first_name,
      username: data.user.username,
    } as TelegramUser : undefined,
    auth_date: data.auth_date,
    hash: data.hash,
  };

  if (data.start_param) {
    formatted.start_param = data.start_param;
  }

  if (data.chat) {
    formatted.chat = data.chat as TelegramChat;
  }

  return formatted;
}

/**
 * 获取当前用户信息
 */
export function getTelegramUser(): TelegramUser | null {
  const initData = getInitData();
  return initData?.user || null;
}

/**
 * 检查是否在 Telegram 环境中运行
 */
export function isTelegramEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.Telegram?.WebApp;
}

/**
 * 格式化 initData 数据为查询字符串格式
 * @returns {string} 格式如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 * @example
 * const formattedData = formatInitDataToQueryString();
 */
export function getFormattedInitData(): { initData: string } | null {
  const formattedData = formatInitDataToQueryString();
  if (!formattedData) return null;
  
  return {
    initData: formattedData
  };
}

/**
 * 格式化 initData 数据为查询字符串格式（内部使用）
 * @returns {string} 格式如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 */
export function formatInitDataToQueryString(): string | null {
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams();

  // 处理 user 数据
  if (initData.user) {
    const userStr = JSON.stringify({
      id: initData.user.id,
      first_name: initData.user.first_name,
      ...(initData.user.username ? { username: initData.user.username } : {})
    });
    params.append('user', userStr);
  }

  // 添加 auth_date
  params.append('auth_date', initData.auth_date.toString());

  // 添加 hash
  params.append('hash', initData.hash);

  return params.toString();
}

