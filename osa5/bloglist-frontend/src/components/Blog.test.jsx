import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders blog title and author, but does not show url or likes initially', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Aappo testaaja',
    url: 'aappo.com',
    likes: 4,
    user: {
      username: 'logical',
      name: 'Aappo',
    }
  }

  render(<Blog blog={blog} blogs={[]} setBlogs={() => null} username='Aappo'/>)

  // Renders blog title and author
  // Using exact false since in the Blog component these texts are not in their own html elements
  screen.getByText('Component testing is done with react-testing-library', { exact: false })
  screen.getByText('Aappo testaaja', { exact: false })

  // Does NOT render url or likes
  const url = screen.queryByText('aappo.com')
  const likes = screen.queryByText('4')
  expect(url).not.toBeVisible()
  expect(likes).not.toBeVisible()
})

test('shows url, likes and user when blogs "show" button has been pressed', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Aappo testaaja',
    url: 'aappo.com',
    likes: 4,
    user: {
      username: 'logical',
      name: 'Aappo',
    }
  }
  
  render(<Blog blog={blog} blogs={[]} setBlogs={() => null} username='Aappo'/>)

  // The things are not there before "view" button click
  expect(screen.queryByText('aappo.com')).not.toBeVisible()
  expect(screen.queryByText('4')).not.toBeVisible()
  expect(screen.queryByText('Aappo')).not.toBeVisible()

  // Click the "view" button
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // Does render url or likes
  expect(screen.queryByText('aappo.com')).toBeVisible()
  expect(screen.queryByText('4')).toBeVisible()
  expect(screen.queryByText('Aappo')).toBeVisible()
})