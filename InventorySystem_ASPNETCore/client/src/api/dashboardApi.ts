import axios from "axios"
import type { DashboardResumen } from "@/types/dashboard"

const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

export async function obtenerResumenDashboard(): Promise<DashboardResumen> {
  const { data } = await api.get<DashboardResumen>("/dashboard/summary")
  return data
}
