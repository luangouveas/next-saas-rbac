import { ServerResponse } from 'http'

// userId -> várias conexões abertas
const connections = new Map<string, Set<ServerResponse>>()

export function addConnection(userId: string, res: ServerResponse) {
  if (!connections.has(userId)) {
    connections.set(userId, new Set())
  }

  connections.get(userId)!.add(res)
}

export function removeConnection(userId: string, res: ServerResponse) {
  const userConnections = connections.get(userId)
  if (!userConnections) return

  userConnections.delete(res)

  if (userConnections.size === 0) {
    connections.delete(userId)
  }
}

export function getConnections(userId: string) {
  return connections.get(userId)
}

export function sendToUser<T>(userId: string, data: T) {
  const userConnections = connections.get(userId)

  if (!userConnections) {
    return
  }

  const payload = `data: ${JSON.stringify(data)}\n\n`

  for (const res of userConnections) {
    res.write(payload)
  }
}
