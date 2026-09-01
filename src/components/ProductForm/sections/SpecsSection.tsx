'use client'

// Especificações técnicas (rich text) — espelha o SpecsSection do protótipo
// (sections.jsx). Toolbar fiel ao design: Bold, Italic, Underline, List,
// ListOrdered + botão "Título" (H3), paleta nx (toolbar bg-nxbg, estado ativo
// text-nxp). Usa TipTap diretamente (StarterKit v3 já inclui Underline e
// headings) em vez do RichTextEditor compartilhado, que usa paleta cinza e não
// tem Underline/Título. Ligado ao campo 'specifications' via Controller. Contador
// X/2000 conta texto puro (sem tags HTML).
import * as React from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, ScrollText, Underline } from 'lucide-react'
import type { CreateProductFormData } from '@/schemas'
import { cn } from '@/lib/utils'
import { SectionCard, SectionHeader } from '../primitives'

const MAX = 2000

// comprimento de texto puro a partir do HTML (sem contar tags)
function plainTextLength(html: string): number {
  return (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim().length
}

function SpecsEditor({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (html: string) => void
  error: boolean
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Descreva materiais, medidas, cuidados, garantia…' }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[140px] px-4 py-3 text-[13px] leading-relaxed text-nxi1 focus:outline-none',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:my-1',
          '[&_p.is-editor-empty:first-child]:before:text-nxi3 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:pointer-events-none',
        ),
      },
    },
  })

  // sincroniza conteúdo externo (ex.: carregamento do produto no modo edição)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  const tools: { icon: typeof Bold; name: string; run: () => void }[] = [
    { icon: Bold, name: 'bold', run: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, name: 'italic', run: () => editor.chain().focus().toggleItalic().run() },
    {
      icon: Underline,
      name: 'underline',
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: List,
      name: 'bulletList',
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      name: 'orderedList',
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ]

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-white',
        error ? 'border-nxd' : 'border-nxborder',
      )}
    >
      <div className="flex items-center gap-0.5 border-b border-nxborder bg-nxbg px-2 py-1.5">
        {tools.map(({ icon: Ic, name, run }) => (
          <button
            key={name}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              run()
            }}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white hover:text-nxp',
              editor.isActive(name) ? 'text-nxp' : 'text-nxi2',
            )}
          >
            <Ic size={15} />
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-nxborder" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }}
          className={cn(
            'flex h-8 items-center rounded-md px-2 text-[12px] font-bold transition-colors hover:bg-white hover:text-nxp',
            editor.isActive('heading', { level: 3 }) ? 'text-nxp' : 'text-nxi2',
          )}
        >
          Título
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export function SpecsSection({ form }: { form: UseFormReturn<CreateProductFormData> }) {
  return (
    <SectionCard id="sec-specs">
      <SectionHeader
        icon={ScrollText}
        title="Especificações técnicas"
        description={
          <>
            Detalhes ricos do produto (material, medidas, cuidados, garantia). Aparecem na aba de
            especificações — diferente da <strong>Descrição curta</strong>, que é o resumo exibido
            na listagem e no topo da página.
          </>
        }
      />
      <Controller
        control={form.control}
        name="specifications"
        render={({ field }) => {
          const html = field.value || ''
          const len = plainTextLength(html)
          const over = len > MAX
          return (
            <div>
              <SpecsEditor value={html} onChange={field.onChange} error={over} />
              <p
                className={cn(
                  'mt-2 text-right text-[11px] font-medium',
                  over ? 'text-nxd' : 'text-nxi3',
                )}
              >
                {len}/{MAX}
              </p>
            </div>
          )
        }}
      />
    </SectionCard>
  )
}
