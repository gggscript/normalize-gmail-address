import EmailAddresses from 'email-addresses'

class ParsingError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'ParsingError'
    this.code = code
  }
}

// https://support.google.com/mail/answer/9211434
export default function normalizeGmailAddress(emailAddress, emailParserOptions) {
  if (typeof emailAddress !== 'string') throw new ParsingError('The input is not a string', 'NOT_A_STRING')
  const address = EmailAddresses.parseOneAddress(emailAddress, emailParserOptions)
  if (!address || address.type !== 'mailbox')
    throw new ParsingError('The input is not a valid Email address', 'NOT_AN_EMAIL')
  if (address.domain.toLowerCase() !== 'gmail.com' && address.domain.toLowerCase() !== 'googlemail.com')
    throw new ParsingError("The email's domain is neither gmail.com nor googlemail.com", 'NOT_GMAIL')

  if (address.local.startsWith('.'))
    throw new ParsingError("The email's local part starts with a dot", 'LOCALPART_STARTS_WITH_DOT')
  if (address.local.endsWith('.'))
    throw new ParsingError("The email's local part ends with a dot", 'LOCALPART_ENDS_WITH_DOT')

  if (/\.\./.test(address.local))
    throw new ParsingError("The email's local part has atleast two preceding dots", 'LOCALPART_PRECEDING_DOTS')

  const username = address.local
    .substring(0, address.local.includes('+') ? address.local.indexOf('+') : address.local.length)
    .replace(/\./g, '')
    .toLowerCase()

  if (username.length < 6) throw new ParsingError("The email's username is too short", 'GMAIL_USERNAME_TOO_SHORT')
  if (username.length > 30) throw new ParsingError("The email's username is too long", 'GMAIL_USERNAME_TOO_LONG')
  if (/[^a-z0-9]/.test(username))
    throw new ParsingError("The email's username includes invalid characters", 'GMAIL_USERNAME_INVALID_CHARACTERS')

  return username + '@gmail.com'
}
