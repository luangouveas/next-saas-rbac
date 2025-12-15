type EventHandler<T = any> = (event: T) => void

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  subscribe<T>(eventType: string, handler: EventHandler<T>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    this.handlers.get(eventType)!.add(handler)
  }

  publish<T>(eventType: string, event: T) {
    const handlers = this.handlers.get(eventType)
    if (!handlers) return

    for (const handler of handlers) {
      handler(event)
    }
  }
}

export const eventBus = new EventBus()
