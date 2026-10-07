/**
 * Neon's "Connect" button gives a pooled URL (host with "-pooler") with
 * `channel_binding=require`. Prisma migrations need a direct connection and
 * Prisma 6 does not support channel binding, so both are removed. Other URLs
 * pass through unchanged.
 */
export function toDirectDatabaseUrl(databaseUrl: string) {
  let url: URL

  try {
    url = new URL(databaseUrl)
  } catch {
    return databaseUrl
  }

  url.hostname = url.hostname.replace(/-pooler(?=\.)/, '')
  url.searchParams.delete('channel_binding')

  return url.toString()
}
