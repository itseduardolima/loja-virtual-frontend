import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: 'Padrão' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secundário' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Cancelado' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Rascunho' },
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Ativo</Badge>
      <Badge variant="secondary">Pendente</Badge>
      <Badge variant="destructive">Cancelado</Badge>
      <Badge variant="outline">Rascunho</Badge>
    </div>
  ),
}

export const OrderStatuses: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="secondary">Pendente</Badge>
      <Badge>Confirmado</Badge>
      <Badge variant="outline">Enviado</Badge>
      <Badge className="bg-green-100 text-green-800 border-green-200">Entregue</Badge>
      <Badge variant="destructive">Cancelado</Badge>
    </div>
  ),
}
