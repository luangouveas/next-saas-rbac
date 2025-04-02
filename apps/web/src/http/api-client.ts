import { getCookie } from 'cookies-next'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
          const cookieStore = await serverCookies()

          token = cookieStore.get('token')?.value
        } else {
          token = getCookie('token') as string | undefined
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
