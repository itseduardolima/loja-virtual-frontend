import path from 'path'
import type { StorybookConfig } from '@storybook/experimental-nextjs-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    }
    return config
  },
}

export default config
