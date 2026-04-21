import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Título do Dialog</DialogTitle>
          <DialogDescription>
            Descrição do que este dialog faz ou qual ação está sendo confirmada.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Conteúdo principal do dialog.</p>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar cupom</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar cupom</DialogTitle>
          <DialogDescription>Preencha os dados do novo cupom de desconto.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="code">Código</Label>
            <Input id="code" placeholder="DESCONTO10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount">Desconto (%)</Label>
            <Input id="discount" type="number" placeholder="10" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir produto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O produto será removido permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive">Excluir permanentemente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
