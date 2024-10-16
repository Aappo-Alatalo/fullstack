import { render, screen } from "@testing-library/react"
import BlogForm from "./BlogForm"
import { describe, expect } from "vitest"
import userEvent from "@testing-library/user-event"

describe("<BlogForm />", () => {
  test("callback function is called with the right information, when a blog is created", async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    const { container } = render(<BlogForm createBlog={mockHandler} />)

    const title = container.querySelector("#titleInput")
    const author = container.querySelector("#authorInput")
    const url = container.querySelector("#urlInput")
    const submitButton = container.querySelector("#submitBlogButton")

    await user.type(title, "testing title")
    await user.type(author, "aappo alatalo")
    await user.type(url, "www.aappoalatalo.com")
    await user.click(submitButton)

    expect(mockHandler).toHaveBeenCalledOnce()
    expect(mockHandler.mock.calls[0][0].title).toBe("testing title")
    expect(mockHandler.mock.calls[0][0].author).toBe("aappo alatalo")
    expect(mockHandler.mock.calls[0][0].url).toBe("www.aappoalatalo.com")
  })
})
