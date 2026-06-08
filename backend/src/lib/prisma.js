const { PrismaClient } = require('../../generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: 'postgresql://postgres:2550@localhost:5432/ferreteria_nasca',
})

const prisma = new PrismaClient({ adapter })

module.exports = prisma