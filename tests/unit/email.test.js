// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isValidEmail } from '../../src/lib/email.js'

describe('isValidEmail', () => {
  it.each(['golfer@example.com', 'first.last+tee@mail.co.uk', '  padded@example.com  '])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each(['', 'plain', 'a@b', '@example.com', 'a@.com', 'a b@example.com', 'a@example.c0m', null, undefined, {}])(
    'rejects %j',
    (email) => {
      expect(isValidEmail(email)).toBe(false)
    },
  )
})
