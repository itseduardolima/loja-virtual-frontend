import React from 'react'
import type { Preview } from '@storybook/experimental-nextjs-vite'
import '../src/app/globals.css'

// A fonte padrão (Nunito) é carregada em .storybook/preview-head.html, que também
// define a variável --font-nunito. O `font-sans` do Tailwind (tailwind.config.ts)
// aponta para essa variável, então todo o preview renderiza com a Nunito — a mesma
// tipografia do app (src/app/layout.tsx).
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans">
        <Story />
      </div>
    ),
  ],
}

export default preview
