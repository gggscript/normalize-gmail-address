import normalizeGmailAddress from './index.js'

const tests = [
  ['short@gmail.com', 'GMAIL_USERNAME_TOO_SHORT'],
  ['a.loooooooooooooooooooooong.name@gmail.com', 'aloooooooooooooooooooooongname@gmail.com'],
  ['a.loooooooooooooooooooooong.name+withanalias@gmail.com', 'aloooooooooooooooooooooongname@gmail.com'],
  ['a.loooooooooooooooooooooonger.name@gmail.com', 'GMAIL_USERNAME_TOO_LONG'],
  ["i.love.symbols!$%&/=?*+#'@gmail.com", 'GMAIL_USERNAME_INVALID_CHARACTERS'],
  ["i.love.symbols.after.alias++!$%&/=?*+#'@gmail.com", 'ilovesymbolsafteralias@gmail.com'],
  ['i.love.do..ts@gmail.com', 'NOT_AN_EMAIL'],
  ['".i.love.do.ts"@gmail.com', 'LOCALPART_STARTS_WITH_DOT'],
  ['"i.love.do.ts."@gmail.com', 'LOCALPART_ENDS_WITH_DOT'],
  ['"i.love.do..ts"@gmail.com', 'LOCALPART_PRECEDING_DOTS'],
  [1337, 'NOT_A_STRING'],
  ['"I have a Name" (and a comment) <not.bad.right@gmail.com>', 'notbadright@gmail.com'],
  ['<chevron@gmail.com>', 'chevron@gmail.com'],
  ['localpart@domain', 'NOT_GMAIL'],
  ['"quoted"@gmail.com', 'quoted@gmail.com'],
  [' whitespace\t @gmail.com', 'whitespace@gmail.com'],
  ['commentindomain@(comment)gmail.com', 'commentindomain@gmail.com'],
  ['googlemail@googlemail.com', 'googlemail@gmail.com'],
]

const start = performance.now()

function red(text) {
  return `\u001b[31m${text}\u001b[39m`
}
function green(text) {
  return `\u001b[32m${text}\u001b[39m`
}
function blue(text) {
  return `\u001b[34m${text}\u001b[39m`
}

let failedTests = 0
for (const [address, expectedShortHand] of tests) {
  let expected
  if (expectedShortHand.endsWith('@gmail.com')) {
    expected = {
      type: 'success',
      value: expectedShortHand,
      toString() {
        return `return "${this.value}"`
      },
    }
  } else {
    expected = {
      type: 'parsingerror',
      value: expectedShortHand,
      toString() {
        return `fail with ParsingError(code=${this.value})`
      },
    }
  }

  let actual
  try {
    actual = {
      type: 'success',
      value: normalizeGmailAddress(address),
      toString() {
        return `returned "${this.value}"`
      },
    }
  } catch (error) {
    if (error.name === 'ParsingError') {
      actual = {
        type: 'parsingerror',
        value: error.code,
        toString() {
          return `failed with ParsingError(code=${this.value})`
        },
      }
    } else {
      actual = {
        type: 'error',
        value: error.message,
        toString() {
          return `failed with "${this.value}"`
        },
      }
    }
  }

  if (expected.type !== actual.type || expected.value !== actual.value) {
    failedTests++
    console.error(`normalizeGmailAddress(${blue(`"${address}"`)})`)
    console.error(`      was expected to ${green(expected.toString())}`)
    console.error(`          but instead ${red(actual.toString())}`)
  }
}

const ms = Math.round(performance.now() - start)
if (failedTests === 0) {
  console.log(green('Passed all tests'), 'in', ms, 'ms')
} else {
  console.log(red(`\nFailed ${failedTests} test${failedTests === 1 ? '' : 's'}`), 'in', ms, 'ms')
}
