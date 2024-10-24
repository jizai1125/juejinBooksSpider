import { ElementHandle, type Page } from 'puppeteer'
import inquirer from 'inquirer'
import { evConfig } from '@/config'
import { logger } from '@/utils'

export async function login(page: Page) {
  const $loginBtn = await page.$('button.login-button')
  await $loginBtn?.click()
  await page.waitForSelector('.other-login-box')
  const $bypwd = await page.$('.other-login-box .clickable')
  await $bypwd?.click()
  await page.waitForSelector('.login-main input[name=loginPhoneOrEmail]')
  const $loginPhoneOrEmail = await page.$('.login-main input[name=loginPhoneOrEmail]')
  await $loginPhoneOrEmail?.type(evConfig.username, { delay: 100 })
  const $pwd = await page.$('.login-main input[name=loginPassword]')
  await $pwd?.type(evConfig.passowrd, { delay: 100 })
  const $login = await page.$('.login-main button.btn-login')
  await $login?.click()
  const { isLogin } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isLogin',
      message: '确认已登录（若未登录成功，可自己手动登录下）：',
    },
  ])
  if (!isLogin) {
    logger.warn('必须登录才能下载付费的小册！')
    await login(page)
  }
}
