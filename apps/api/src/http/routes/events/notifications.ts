import { env } from '@saas/env'
import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'

import {
  addConnection,
  removeConnection,
} from '@/infra/events/sse-connections.store'

export async function notificationsRoute(app: FastifyInstance) {
  app.get('/events/notifications', async (request, reply) => {
    const token = request.cookies.token

    if (!token) {
      return reply.status(401).send()
    }

    let userId: string

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as {
        sub: string
      }

      userId = payload.sub
    } catch {
      return reply.status(401).send()
    }

    reply.raw.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    reply.raw.setHeader('Access-Control-Allow-Credentials', 'true')

    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache')
    reply.raw.setHeader('Connection', 'keep-alive')

    reply.raw.flushHeaders()

    reply.hijack()

    addConnection(userId, reply.raw)

    request.raw.on('close', () => {
      removeConnection(userId, reply.raw)
    })

    reply.raw.write(`event: connected\ndata: ok\n\n`)
  })
}
