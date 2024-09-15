import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders blog title and author, but not url or likes', () => {
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