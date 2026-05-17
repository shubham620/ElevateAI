// lib/api.ts
import { getSession } from "next-auth/react"

export async function apiCall<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const session = await getSession()
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session && { Authorization: `Bearer ${session.user.id}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API error")
  }

  return response.json()
}

export async function apiGet<T = any>(url: string): Promise<T> {
  return apiCall<T>(url, { method: "GET" })
}

export async function apiPost<T = any>(
  url: string,
  data?: any
): Promise<T> {
  return apiCall<T>(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function apiPatch<T = any>(
  url: string,
  data?: any
): Promise<T> {
  return apiCall<T>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  return apiCall<T>(url, { method: "DELETE" })
}

export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}
