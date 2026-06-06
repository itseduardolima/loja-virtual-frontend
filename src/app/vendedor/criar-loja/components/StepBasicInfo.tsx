import { Input, Label, Textarea } from '@/components'
import { cn } from '@/lib/utils'
import { slugify } from '../utils/social'
import { FileUploadZone } from './FileUploadZone'
import type { CreateStoreData } from '@/hooks/useCreateStore'

interface StepBasicInfoProps {
  formData: CreateStoreData
  logoPreview: string | null
  bannerPreview: string | null
  errors: Record<string, string>
  onChange: (field: keyof CreateStoreData, value: CreateStoreData[keyof CreateStoreData]) => void
  onFile: (field: 'logo' | 'banner', file: File) => void
}

export function StepBasicInfo({
  formData,
  logoPreview,
  bannerPreview,
  errors,
  onChange,
  onFile,
}: StepBasicInfoProps) {
  const slug = slugify(formData.name)

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-semibold text-gray-900 leading-tight text-2xl sm:text-3xl">
          Como vai se chamar sua loja?
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Você pode mudar isso depois nas configurações.
        </p>
      </div>

      {/* Nome */}
      <div>
        <Label className="text-[13px] font-semibold text-gray-700 mb-1 block">
          Nome da Loja <span className="text-red-400">*</span>
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Boutique da Maria"
          className={cn(
            'h-12 focus-visible:ring-[#1E3A5F]/20 focus-visible:border-[#1E3A5F]',
            errors.name && 'border-red-400',
          )}
        />
        {formData.name.length >= 3 && (
          <p className="text-xs text-gray-400 mt-1.5">
            Sua URL será: {process.env.NEXT_PUBLIC_APP_URL}/loja/<strong className="text-gray-600">{slug}</strong>
          </p>
        )}
        {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
      </div>

      {/* Descrição */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className="text-[13px] font-semibold text-gray-700">Descrição</Label>
          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded leading-none">
            opcional
          </span>
        </div>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value.slice(0, 170))}
          placeholder="Descreva sua loja — o que você vende, quem são seus clientes..."
          rows={4}
          className="resize-none focus-visible:ring-[#1E3A5F]/20 focus-visible:border-[#1E3A5F]"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {formData.description?.length || 0}/170
        </p>
      </div>

      {/* Identidade Visual */}
      <div>
        <p className="text-[13px] font-semibold text-gray-700 mb-3">Identidade Visual</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
              Logo
              <span className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">opcional</span>
            </p>
            <FileUploadZone
              label="Logo"
              hint="PNG · JPG · máx. 2MB"
              preview={logoPreview}
              onFile={(file) => onFile('logo', file)}
            />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
              Banner
              <span className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">opcional</span>
            </p>
            <FileUploadZone
              label="Banner"
              hint="PNG · JPG · proporção 3:1"
              preview={bannerPreview}
              onFile={(file) => onFile('banner', file)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
