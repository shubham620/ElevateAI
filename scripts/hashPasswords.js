require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const p = new PrismaClient()

async function main() {
  const users = await p.user.findMany()
  console.log('Found', users.length, 'users')
  for (const u of users) {
    const pw = u.password || ''
    if (!pw.startsWith('$2a$') && !pw.startsWith('$2b$') && pw.length < 60) {
      const hashed = await bcrypt.hash(pw, 10)
      await p.user.update({ where: { id: u.id }, data: { password: hashed } })
      console.log('Hashed password for', u.email)
    } else {
      console.log('Already hashed or missing for', u.email)
    }
  }
  await p.$disconnect()
}

main().catch(async (e) => { console.error(e); await p.$disconnect(); process.exit(1) })
