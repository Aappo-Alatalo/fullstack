const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('usernameInput')).toBeVisible()
    await expect(page.getByTestId('passwordInput')).toBeVisible()
    await expect(page.getByTestId('submitButton')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('usernameInput').fill('mluukkai')
        await page.getByTestId('passwordInput').fill('salainen')
        await page.getByTestId('submitButton').click()

        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('usernameInput').fill('mluukkai')
        await page.getByTestId('passwordInput').fill('wrong')
        await page.getByTestId('submitButton').click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('usernameInput').fill('mluukkai')
        await page.getByTestId('passwordInput').fill('salainen')
        await page.getByTestId('submitButton').click()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByText('new blog').click()
        await page.getByTestId('titleInput').fill('A blog created by Playwright')
        await page.getByTestId('authorInput').fill('John Doe')
        await page.getByTestId('urlInput').fill('http://test.com')
        await page.getByTestId('submitBlogButton').click()

        const blogDiv = await page.getByTestId('blog')
        await expect(blogDiv).toContainText('A blog created by Playwright')
    })
  })
})