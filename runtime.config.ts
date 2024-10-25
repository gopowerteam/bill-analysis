import process from 'node:process'

export const runtimeConfig = {
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: false,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  auth: {
    accessToken: {
      secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
      expires: process.env.AUTH_ACCESS_TOKEN_EXPIRES,
    },
    refreshToken: {
      secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
      expires: process.env.AUTH_REFRESH_TOKEN_EXPIRES,
    },
  },
} as const
