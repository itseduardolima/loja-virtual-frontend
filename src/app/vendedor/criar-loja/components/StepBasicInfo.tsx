import { Input, Textarea } from '@/components'
import { FieldLabel, FieldHelp, nxInputClass } from '@/app/vendedor/configuracoes/_shared'
import { cn } from '@/lib/utils'
import { slugify } from '../utils/social'
import { FileUploadZone } from './FileUploadZone'
import type { CreateStoreData } from '@/hooks/useCreateStore'

interface StepBasicInfoProps {
  formData: CreateStoreData
  logoPreview: string | null
  errors: Record<string, string>
  onChange: (field: keyof CreateStoreData, value: CreateStoreData[keyof CreateStoreData]) => void
  onFile: (field: 'logo', file: File) => void
  onRemoveFile: (field: 'logo') => void
}

function OptionalBadge() {
  return (
    <span className="rounded-full bg-nxi3/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-nxi3">
      opcional
    </span>
  )
}

export function StepBasicInfo({
  formData,
  logoPreview,
  errors,
  onChange,
  onFile,
  onRemoveFile,
}: StepBasicInfoProps) {
  const slug = slugify(formData.name)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-nxi1">
          Como vai se chamar sua loja?
        </h2>
        <p className="mt-1 text-[13px] text-nxi2">
          Você pode mudar isso depois nas configurações.
        </p>
      </div>

      {/* Nome */}
      <div className="space-y-1.5">
        <FieldLabel required>Nome da loja</FieldLabel>
        <Input
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Boutique da Maria"
          className={cn(nxInputClass(!!errors.name), 'w-full')}
        />
        {formData.name.length >= 3 && (
          <FieldHelp>
            Sua URL será: {process.env.NEXT_PUBLIC_APP_URL}/loja/
            <strong className="text-nxi2">{slug}</strong>
          </FieldHelp>
        )}
        {errors.name && <FieldHelp variant="error">{errors.name}</FieldHelp>}
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <FieldLabel>
          Descrição
          <OptionalBadge />
        </FieldLabel>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value.slice(0, 170))}
          placeholder="Descreva sua loja — o que você vende, quem são seus clientes..."
          rows={4}
          className="resize-none rounded-lg border-nxborder text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:border-nxp focus-visible:ring-2 focus-visible:ring-nxp/30"
        />
        <p className="text-right text-[11.5px] text-nxi3">{formData.description?.length || 0}/170</p>
      </div>

      {/* Identidade Visual */}
      <div>
        <p className="mb-3 text-[12.5px] font-semibold tracking-[0.01em] text-nxi2">
          Identidade visual
        </p>
        <div className="max-w-[240px]">
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px] text-nxi3">
            Logo
            <OptionalBadge />
          </p>
          <FileUploadZone
            label="Logo"
            hint="PNG · JPG · máx. 2MB"
            preview={logoPreview}
            onFile={(file) => onFile('logo', file)}
            onRemove={() => onRemoveFile('logo')}
          />
        </div>
      </div>
    </div>
  )
}
