// Declarações globais que o moduleResolution "bundler" não infere automaticamente.

declare module '*.css'
declare module '*.scss'
declare module '*.png' {
  const src: import('next/image').StaticImageData
  export default src
}
