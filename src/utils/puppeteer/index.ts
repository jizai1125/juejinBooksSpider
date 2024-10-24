/* eslint-disable no-restricted-globals */
import type { Browser, LaunchOptions } from 'puppeteer'
import puppeteer from 'puppeteer'
import { evConfig } from '@/config'

// 定义一个异步函数，用于获取浏览器
async function getBrowser(options?: LaunchOptions): Promise<Browser | null> {
  // 如果_browser不存在，则尝试启动浏览器
  if (!global._browser) {
    try {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--use-gl=egl',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
        ],
        defaultViewport: { width: 0, height: 0 },
        headless: Boolean(evConfig.headless),
        ...evConfig.puppeteerOptions,
        ...options,
      })
      global._browser = browser
    } catch (error) {
      console.log(error || 'puppeteer启动失败')
    }
  }

  // 返回_browser
  return global._browser || null
}

// 定义一个异步函数，用于关闭浏览器
async function closeBrowser(): Promise<void> {
  // 如果_browser存在，则关闭浏览器
  if (global._browser) {
    await global._browser.close()
    global._browser = null
  }
}

// 导出一个对象，包含getBrowser和closeBrowser函数
export { getBrowser, closeBrowser }
