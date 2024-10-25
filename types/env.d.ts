declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_HOST: string
      DATABASE_PORT: string
      DATABASE_USER: string
      DATABASE_PASSWORD: string
      DATABASE_DB: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
