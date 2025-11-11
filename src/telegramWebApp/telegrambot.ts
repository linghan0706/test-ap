'use client';

import type { TelegramUser, TelegramInitData } from '../types';
import { retrieveRawInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * 初始化 Telegram WebApp
 */
export function initializeTelegramApp() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    console.warn('Not currently in Telegram WebApp environment');
    return null;
  }
  try {
    const tg = window.Telegram.WebApp;
    // 使用类型断言调用 ready 方法（SDK 类型定义可能不完整）
    if ('ready' in tg && typeof tg.ready === 'function') {
      tg.ready();
    }
    return tg;
  } catch (e) {
    console.warn('Failed to initialize Telegram WebApp:', e);
    return null;
  }
}

/**
 * 使用 telegram-apps/sdk-react 获取并解析 initData
 */
export function getInitData(): TelegramInitData | null {
  if (typeof window === 'undefined') return null;

  try {
    // 非 Telegram 环境直接返回 null，避免 SDK 报错日志
    if (!isTelegramEnvironment()) {
      return null;
    }
    // 使用 SDK 的原生方法获取原始 initData 字符串
    const raw = retrieveRawInitData();
    if (!raw) return null;

    // Telegram WebApp 的 initData 原始值是查询字符串："user=...&auth_date=...&hash=...&..."
    const parsed = parseInitDataQueryString(raw);
    return parsed;
  } catch (e) {
    console.warn('Failed to get initData via SDK:', e);
    return null;
  }
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
  try {
    // 若能正常检索到 Launch Params，则视为在 Telegram 环境
    retrieveLaunchParams();
    return true;
  } catch {
    return !!window.Telegram?.WebApp;
  }
}

/**
 * 返回以查询字符串形式表示的 initData（仅包含 user、auth_date、hash）
 * @returns {string} 例如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 */
export function getFormattedInitData(): { initData: string } | null {
  if (typeof window === 'undefined') return null;
  if (!isTelegramEnvironment()) return null;
  try {
    const raw = retrieveRawInitData();
    if (!raw || typeof raw !== 'string') return null;
    // 直接返回 SDK 的原始 initData（完整查询字符串，包含 signature、chat_instance 等）
    return { initData: raw };
  } catch (e) {
    console.warn('Failed to read raw initData:', e);
    return null;
  }
}

/**
 * 将 SDK 获取的 initData 转为查询字符串（内部使用）
 */
export function formatInitDataToQueryString(): string | null {
  // 仍然支持将解析后的数据转为最小查询串，但不用于登录
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams();

  if (initData.user) {
    const userStr = JSON.stringify({
      id: initData.user.id,
      first_name: initData.user.first_name,
      ...(initData.user.username ? { username: initData.user.username } : {}),
    });
    params.append('user', userStr);
  }

  params.append('auth_date', initData.auth_date.toString());
  params.append('hash', initData.hash);

  if (initData.chat_type) params.append('chat_type', initData.chat_type);
  if (initData.chat_instance) params.append('chat_instance', initData.chat_instance);
  if (initData.start_param) params.append('start_param', initData.start_param);

  return params.toString();
}

function parseInitDataQueryString(raw: string): TelegramInitData {
  const qs = raw.startsWith('?') ? raw.slice(1) : raw;
  const params = new URLSearchParams(qs);

  const userParam = params.get('user');
  let user: TelegramUser | undefined;
  if (userParam) {
    try {
      // URLSearchParams.get 已经对 %xx 解码，得到 JSON 字符串
      const u = JSON.parse(userParam) as Partial<TelegramUser>;
      user = {
        id: Number(u.id),
        first_name: String(u.first_name ?? ''),
        last_name: u.last_name,
        username: u.username,
        language_code: u.language_code,
        allows_write_to_pm: u.allows_write_to_pm,
        photo_url: u.photo_url,
        is_premium: u.is_premium,
      };
    } catch (e) {
      console.warn('Failed to parse user field (ignoring this field):', e);
    }
  }

  const chat_type = params.get('chat_type') ?? undefined;
  const chat_instance = params.get('chat_instance') ?? undefined;
  const start_param = params.get('start_param') ?? undefined;

  const auth_dateStr = params.get('auth_date');
  const hash = params.get('hash') ?? '';

  const auth_date = auth_dateStr ? Number(auth_dateStr) : Date.now();

  const result: TelegramInitData = {
    user,
    chat_type,
    chat_instance,
    start_param,
    auth_date,
    hash,
  };

  return result;
}
