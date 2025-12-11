export function createRandomPassword(): string {
  const length = 9
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'

  const all = lower + upper + digits

  const rand = (max: number) => Math.floor(Math.random() * max)
  const passChars: string[] = []

  passChars.push(lower[rand(lower.length)])
  passChars.push(upper[rand(upper.length)])
  passChars.push(digits[rand(digits.length)])

  for (let i = passChars.length; i < length; i++) {
    passChars.push(all[rand(all.length)])
  }

  for (let i = passChars.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    const tmp = passChars[i]
    passChars[i] = passChars[j]
    passChars[j] = tmp
  }

  return passChars.join('')
}
