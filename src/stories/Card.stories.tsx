import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80 shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição breve sobre o conteúdo do card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Conteúdo principal do card vai aqui.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80 shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Confirmar ação</CardTitle>
        <CardDescription>Tem certeza que deseja continuar?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button variant="destructive">Confirmar</Button>
      </CardFooter>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <Card className="w-64 shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Receita Total</span>
        <Badge variant="secondary">+12%</Badge>
      </div>
      <p className="text-3xl font-bold">R$ 4.280</p>
      <p className="text-xs text-muted-foreground mt-1">Comparado ao mês anterior</p>
    </Card>
  ),
}

export const ProductCard: Story = {
  render: () => (
    <Card className="w-64 shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Imagem do produto
      </div>
      <CardContent className="pt-4">
        <p className="font-semibold text-sm">Camiseta Básica</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold">R$ 59,90</span>
          <span className="text-sm text-muted-foreground line-through">R$ 79,90</span>
        </div>
      </CardContent>
    </Card>
  ),
}
