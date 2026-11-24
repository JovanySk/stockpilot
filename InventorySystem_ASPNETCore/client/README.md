# Sistema de Inventario — Frontend

React dashboard for the InventorySystem_ASPNETCore backend.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- shadcn/ui (radix base, Nova preset, lucide-react icons)
- Axios

## Development

The backend API must be running first:

```bash
# from the project root
dotnet run   # serves the API at http://localhost:5116
```

Then start the frontend dev server:

```bash
cd client
npm install
npm run dev
```

Vite proxies `/api/*` to `http://localhost:5116` (see `vite.config.ts`),
so the app calls `/api/dashboard/summary` without CORS configuration.

## Build

```bash
npm run build    # type-checks and outputs production bundle to dist/
```

## Structure

```
src/
├── api/           # axios API clients
├── components/
│   ├── layout/    # Sidebar, Topbar
│   ├── dashboard/ # StatCard, MovimientosTable, StockBajoTable, SkuTag
│   └── ui/        # shadcn/ui components (generated)
├── pages/         # DashboardPage
├── types/         # TypeScript types mirroring API responses
└── lib/           # cn() and es-MX formatters (currency, number, date)
```
