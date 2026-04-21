import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Botão padrão' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Botão outline' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Botão secundário' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Excluir' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Pequeno' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Grande' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Desabilitado' },
}
