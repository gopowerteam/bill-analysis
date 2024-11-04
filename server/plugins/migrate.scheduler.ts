import dayjs from 'dayjs'
import { useScheduler } from '#scheduler'
import { migrateTransaction } from '~/server/services/migrate.service'

export default defineNitroPlugin(() => {
  startScheduler()
})

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(async () => {
    console.log(`[migrate transaction] start: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
    await migrateTransaction()
    console.log(`[migrate transaction] end: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
  }).dailyAt(0, 30)
}
