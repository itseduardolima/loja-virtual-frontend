export interface NavLink {
  label: string
  href: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface Step {
  number: string
  title: string
  description: string
  duration: string
  emoji: string
}

export interface FooterColumn {
  heading: string
  links: NavLink[]
}
