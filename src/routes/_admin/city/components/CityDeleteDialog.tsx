import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/city/components/CityDeleteDialog',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/city/components/CityDeleteDialog"!</div>
}
