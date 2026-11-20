// Welcome email for new launch-list signups. DRAFT COPY lives in src/content/copy.js
// (`welcomeEmail`). Sent by api/subscribe.js only when WELCOME_EMAIL_ENABLED=true.
// Plain HTML with inline styles and table layout so it renders in most email clients.
import { BRAND_COLOR, BRAND_NAME, BRAND_TEXT_COLOR } from '../brand/brand.js'
import { CONTACT_EMAIL, welcomeEmail as copy } from '../content/copy.js'
import { SHOP_PATH } from '../routes.js'
import { absoluteUrl } from '../seo.js'

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function buildWelcomeEmail({ siteUrl }) {
  const shopUrl = absoluteUrl(siteUrl, SHOP_PATH)
  const homeUrl = absoluteUrl(siteUrl, '/')
  const paragraphs = copy.paragraphs
    .map((text) => `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#44403c;">${escapeHtml(text)}</p>`)
    .join('\n              ')

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(copy.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(copy.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:24px 32px;">
                <a href="${escapeHtml(homeUrl)}" style="color:${BRAND_TEXT_COLOR};font-size:28px;font-weight:800;text-decoration:none;">${escapeHtml(BRAND_NAME)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:32px;color:#1c1917;">${escapeHtml(copy.heading)}</h1>
              ${paragraphs}
              <p style="margin:24px 0;">
                <a href="${escapeHtml(shopUrl)}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;font-weight:600;padding:12px 24px;border-radius:999px;text-decoration:none;">${escapeHtml(copy.cta)}</a>
              </p>
              <p style="margin:0;font-size:16px;line-height:24px;color:#44403c;">${escapeHtml(copy.signoff)}<br />${escapeHtml(copy.signature)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px;font-size:12px;line-height:18px;color:#78716c;">
                ${escapeHtml(copy.footer)} ${escapeHtml(copy.contact)}
                <a href="mailto:${escapeHtml(CONTACT_EMAIL)}" style="color:#78716c;">${escapeHtml(CONTACT_EMAIL)}</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

  const text = [
    copy.heading,
    '',
    ...copy.paragraphs.flatMap((p) => [p, '']),
    `${copy.cta}: ${shopUrl}`,
    '',
    copy.signoff,
    copy.signature,
    '',
    `${copy.footer} ${copy.contact} ${CONTACT_EMAIL}.`,
    '',
  ].join('\n')

  return { subject: copy.subject, html, text }
}
