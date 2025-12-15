import { api } from './api-client'

interface UpdateProfileRequest {
  name: string | null
  email?: string | null
  avatarUrl?: string | null
}

export async function updateProfile({
  avatarUrl,
  email,
  name,
}: UpdateProfileRequest) {
  await api.put(`profile`, {
    json: { name, email, avatarUrl },
  })
}
