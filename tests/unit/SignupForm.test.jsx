import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SignupForm from '../../src/components/SignupForm.jsx'
import { signup } from '../../src/content/copy.js'

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

describe('SignupForm', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows an inline error and does not submit for an invalid email', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<SignupForm />)
    await userEvent.type(screen.getByLabelText('Email address'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: signup.button }))
    expect(screen.getByRole('alert')).toHaveTextContent(signup.invalid)
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('posts to /api/subscribe and shows success', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse(200, { ok: true }))
    vi.stubGlobal('fetch', fetchSpy)
    render(<SignupForm />)
    await userEvent.type(screen.getByLabelText('Email address'), 'golfer@example.com')
    await userEvent.click(screen.getByRole('button', { name: signup.button }))
    expect(await screen.findByRole('status')).toHaveTextContent(signup.success)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('/api/subscribe')
    expect(JSON.parse(init.body)).toEqual({ email: 'golfer@example.com', company: '' })
  })

  it('shows the server error when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(502, { ok: false, error: 'Could not save.' })))
    render(<SignupForm />)
    await userEvent.type(screen.getByLabelText('Email address'), 'golfer@example.com')
    await userEvent.click(screen.getByRole('button', { name: signup.button }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save.')
  })

  it('shows a generic error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    render(<SignupForm />)
    await userEvent.type(screen.getByLabelText('Email address'), 'golfer@example.com')
    await userEvent.click(screen.getByRole('button', { name: signup.button }))
    expect(await screen.findByRole('alert')).toHaveTextContent(signup.failure)
  })
})
