import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        integral: ['var(--font-integral)', 'system-ui', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
        satoshi: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Design system Nexo Vendedor
        nxp: 'hsl(var(--nxp) / <alpha-value>)',
        nxa: 'hsl(var(--nxa) / <alpha-value>)',
        nxs: 'hsl(var(--nxs) / <alpha-value>)',
        nxw: 'hsl(var(--nxw) / <alpha-value>)',
        nxd: 'hsl(var(--nxd) / <alpha-value>)',
        nxsurf: 'hsl(var(--nxsurf) / <alpha-value>)',
        nxbg: 'hsl(var(--nxbg) / <alpha-value>)',
        nxi1: 'hsl(var(--nxi1) / <alpha-value>)',
        nxi2: 'hsl(var(--nxi2) / <alpha-value>)',
        nxi3: 'hsl(var(--nxi3) / <alpha-value>)',
        nxborder: 'hsl(var(--nxborder) / <alpha-value>)',
        wa: 'hsl(var(--wa) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}

export default config
