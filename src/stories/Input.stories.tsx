import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Digite algo...' },
}

export const WithValue: Story = {
  args: { defaultValue: 'Valor preenchido', placeholder: 'Digite algo...' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'seu@email.com' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Campo desabilitado', defaultValue: 'Não editável' },
}

export const WithError: Story = {
  args: {
    placeholder: 'Campo com erro',
    className: 'border-red-500 focus-visible:ring-red-500',
    'aria-invalid': true,
  },
}
