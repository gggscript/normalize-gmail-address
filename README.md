# normalize-gmail-address

Validate and normalize a Gmail Address

# Why

If you don't normalize Gmail addresses, one Google Account can be used to have practically infinite email addresses.
Because if you own `example@gmail.com`, you can receive Emails at `example+zczgmrebqgrjvgk@gmail.com` or at any other string after the plus sign.

# Usage

1. Respect your users preferences by sending Emails to the Email address they provided
2. But check for account duplicates with the normalized Gmail address

```js
import EmailAddresses from 'email-addresses'
import normalizeGmailAddress from 'normalize-gmail-address'

function userSignup(emailAddress, hashedPassword) {
  // Check if Email is valid
  const parsed = EmailAddresses.parseOneAddress(emailAddress)
  if (!parsed || parsed.type !== 'mailbox') throw new Error('Invalid Email address')

  // Distinguish because Emails addresses may be case sensitive
  // or in case of gmail, users may want Emails to end up at the provided alias
  const emailAddressForSendingEmails = parsed.address
  let emailAddressForCheckingAccountExists = parsed.address.toLowerCase()

  try {
    emailAddressForCheckingAccountExists = normalizeGmailAddress(parsed.address)
  } catch (error) {
    if (error.code !== 'NOT_GMAIL') throw new Error('Invalid Gmail address')
  }

  if (yourDatabase.doesAccountExist(emailAddressForCheckingAccountExists)) throw new Error('Account already exists')

  // ...
}
```

# Format of a Email/Gmail address

`ilikemath+1+1=2@gmail.com`

- `ilikemath+1+1=2` is called the local part
- `gmail.com` is called the domain
- `ilikemath` is called the username (only for gmail.com and googlemail.com)
- `1+1=2` is called the alias (only for gmail.com and googlemail.com)
