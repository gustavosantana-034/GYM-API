/**
 * Neon's "Connect" button gives a pooled URL (host with "-pooler") with
 * `channel_binding=require`. Prisma migrations need a direct connection and
 * Prisma 6 does not support channel binding, so both are removed.
 *
 * Neon's free compute also sleeps after 5 idle minutes and takes a few
 * seconds to wake up, longer than Prisma's 5s default: Neon recommends a
 * longer `connect_timeout`. Non-Neon URLs pass through unchanged.
 */
export function toDirectDatabaseUrl(databaseUrl: string) {
  let url: URL

  try {
    url = new URL(databaseUrl)
  } catch {
    return databaseUrl
  }

  if (!url.hostname.endsWith('.neon.tech')) {
    return databaseUrl
  }

  url.hostname = url.hostname.replace(/-pooler(?=\.)/, '')
  url.searchParams.delete('channel_binding')

  if (!url.searchParams.has('connect_timeout')) {
    url.searchParams.set('connect_timeout', '15')
  }

  return url.toString()
}
