import type { UnknownKeysParam, z } from 'zod'
import type { H3Event } from 'h3'
import { useSafeValidatedBody, useSafeValidatedParams, useSafeValidatedQuery } from 'h3-zod'

type Schema<U extends UnknownKeysParam = any> = z.ZodObject<any, U> | z.ZodUnion<[Schema<U>, ...Schema<U>[]]> | z.ZodIntersection<Schema<U>, Schema<U>> | z.ZodDiscriminatedUnion<string, z.ZodObject<any, U>[]> | z.ZodEffects<z.ZodTypeAny>
type ParsedData<T extends Schema | z.ZodRawShape> = T extends Schema ? z.output<T> : T extends z.ZodRawShape ? z.output<z.ZodObject<T>> : never
type SafeParsedData<T extends Schema | z.ZodRawShape> = T extends Schema ? z.SafeParseReturnType<T, ParsedData<T>> : T extends z.ZodRawShape ? z.SafeParseReturnType<z.ZodObject<T>, ParsedData<T>> : never

function validateParseResult<T extends Schema | z.ZodRawShape>(result: SafeParsedData<T>): ParsedData<T> {
  if (!result.success) {
    throw createError({
      status: 400,
      message: result.error.message,
    })
  }

  return result.data
}

export async function useSafeBody<T extends Schema | z.ZodRawShape>(event: H3Event, schema: T): Promise<ParsedData<T>> {
  const result = await useSafeValidatedBody<T>(event, schema)
  return validateParseResult(result)
}

export async function useSafeQuery<T extends Schema | z.ZodRawShape>(event: H3Event, schema: T): Promise<ParsedData<T>> {
  const result = await useSafeValidatedQuery(event, schema)
  return validateParseResult(result)
}

export async function useSafeParams<T extends Schema | z.ZodRawShape>(event: H3Event, schema: T): Promise<ParsedData<T>> {
  const result = await useSafeValidatedParams(event, schema)
  return validateParseResult(result)
}
