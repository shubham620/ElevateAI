require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  try {
    const user = await p.user.findUnique({ where: { email: 'employee@elevateai.com' } })
    console.log('USER:', JSON.stringify(user, null, 2))
  } catch (e) {
    console.error('ERR', e)
  } finally {
    await p.$disconnect()
  }
}

main()
