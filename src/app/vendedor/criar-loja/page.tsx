"use client";

import { useCreateStorePage } from "./useCreateStorePage";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Checkbox,
  LoadingSpinner,
  LoadingPage,
} from "@/components";
import { PhoneCountryInput } from "@/components/Form/PhoneCountryInput";
import {
  Store,
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  Instagram,
  Facebook,
  Mail,
  Info,
} from "lucide-react";
import Image from "next/image";

export default function CriarLojaPage() {
  const h = useCreateStorePage();

  const err = (step: 1 | 2 | 3, field: string): string | undefined =>
    (h.stepErrors[step - 1] as Record<string, string>)[field];

  if (h.loading) return <LoadingPage />;

  if (h.hasStore) {
    return (
      <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full border-0">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Store className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Você já possui uma loja!
            </h1>
            <p className="text-gray-600 mb-8">
              Loja cadastrada: <strong>{h.store?.name}</strong>
            </p>
            <Button onClick={() => h.router?.push("/vendedor")} className="w-full sm:w-auto px-8">
              Ir para página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ─── Step 1: Informações Básicas ─── */
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-sm font-semibold">
          Nome da Loja *
        </Label>
        <Input
          id="name"
          value={h.formData.name}
          onChange={(e) => h.handleInputChange("name", e.target.value)}
          placeholder="Digite o nome da sua loja"
          className={`mt-2 ${err(1, "name") ? "border-red-500" : ""}`}
        />
        {err(1, "name") && (
          <p className="mt-1 text-sm text-red-600">{err(1, "name")}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-semibold">
          Descrição{" "}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="description"
          value={h.formData.description}
          onChange={(e) => h.handleInputChange("description", e.target.value)}
          placeholder="Descreva sua loja em poucas palavras"
          className="mt-2"
          rows={3}
          maxLength={170}
        />
        <p className="mt-1 text-xs text-gray-400">
          {h.formData.description?.length || 0}/170
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-semibold">
            Logo <span className="text-gray-400 font-normal">(opcional)</span>
          </Label>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                h.handleFileChange("logo", e.target.files?.[0] || null)
              }
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm"
            >
              Escolher Logo
            </label>
            {h.logoPreview && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border">
                <Image
                  src={h.logoPreview}
                  alt="Logo"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold">
            Banner <span className="text-gray-400 font-normal">(opcional)</span>
          </Label>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                h.handleFileChange("banner", e.target.files?.[0] || null)
              }
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm"
            >
              Escolher Banner
            </label>
            {h.bannerPreview && (
              <div className="w-28 h-14 rounded-lg overflow-hidden border">
                <Image
                  src={h.bannerPreview}
                  alt="Banner"
                  width={112}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Step 2: Nicho ─── */
  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selecione os nichos que melhor descrevem sua loja
      </p>

      {h.nichesLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {h.nichesData?.data.map((niche: any) => {
            const selected = h.formData.niche_ids.includes(niche.id.toString());
            return (
              <div
                key={niche.id}
                onClick={() => h.handleNicheToggle(niche.id.toString())}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-secondary hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  id={`niche-${niche.id}`}
                  checked={selected}
                  onCheckedChange={() =>
                    h.handleNicheToggle(niche.id.toString())
                  }
                />
                <label
                  htmlFor={`niche-${niche.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <span className="font-medium text-sm text-gray-900 block">
                    {niche.name}
                  </span>
                  {niche.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {niche.description}
                    </p>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {err(2, "niche_ids") && (
        <p className="text-sm text-red-600">{err(2, "niche_ids")}</p>
      )}
    </div>
  );

  /* ─── Step 3: Contato ─── */
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="whatsapp"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            WhatsApp *
          </Label>
          <div className="mt-2">
            <PhoneCountryInput
              id="whatsapp"
              value={h.formData.whatsapp ?? ""}
              onValueChange={(val) => h.handleInputChange("whatsapp", val)}
              placeholder="Número do WhatsApp"
              minLength={8}
              maxLength={15}
              required
              selectedCountry={h.selectedCountry}
              onSelectedCountryChange={h.setSelectedCountry}
              countriesData={h.countriesData}
              countriesLoading={h.countriesLoading}
              inputClassName={`flex-1 min-w-0 h-12 ${err(3, "whatsapp") ? "border-red-500" : ""}`}
            />
          </div>
          {err(3, "whatsapp") && (
            <p className="mt-1 text-sm text-red-600">{err(3, "whatsapp")}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={h.formData.email}
            onChange={(e) => h.handleInputChange("email", e.target.value)}
            placeholder="email@suaempresa.com.br"
            className={`mt-2 ${err(3, "email") ? "border-red-500" : ""}`}
          />
          {err(3, "email") && (
            <p className="mt-1 text-sm text-red-600">{err(3, "email")}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="instagram"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Instagram{" "}
            <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </Label>
          <Input
            id="instagram"
            type="url"
            value={h.formData.instagram}
            onChange={(e) => h.handleInputChange("instagram", e.target.value)}
            placeholder="https://instagram.com/minhaloja"
            className={`mt-2 ${err(3, "instagram") ? "border-red-500" : ""}`}
          />
          {err(3, "instagram") && (
            <p className="mt-1 text-sm text-red-600">{err(3, "instagram")}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="facebook"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook{" "}
            <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </Label>
          <Input
            id="facebook"
            type="url"
            value={h.formData.facebook}
            onChange={(e) => h.handleInputChange("facebook", e.target.value)}
            placeholder="https://facebook.com/minhaloja"
            className={`mt-2 ${err(3, "facebook") ? "border-red-500" : ""}`}
          />
          {err(3, "facebook") && (
            <p className="mt-1 text-sm text-red-600">{err(3, "facebook")}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Endereço, documentos, métodos de pagamento e horários podem ser
          configurados depois em <strong>Configurações</strong>.
        </p>
      </div>
    </div>
  );

  const steps: Record<number, () => JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-4 sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">
          Criar Nova Loja
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Preencha as informações essenciais para começar
        </p>
      </div>

      {/* Steps indicator */}
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 py-4 sm:py-6">
        <div className="flex items-center w-full min-w-[260px]">
          {h.STEPS.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center flex-1 min-w-0 last:flex-none"
            >
              <div className="flex items-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    h.currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-secondary text-primary"
                  }`}
                >
                  {h.currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-2 sm:ml-3 hidden sm:block">
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      h.currentStep >= step.id ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < h.STEPS.length - 1 && (
                <div className="flex-1 flex items-center px-6 sm:px-10 md:px-16">
                  <div
                    className={`w-full h-0.5 rounded-full transition-colors ${
                      h.currentStep > step.id ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2">
          <CardTitle className="text-lg sm:text-xl">
            {h.STEPS[h.currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          {steps[h.currentStep]?.()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-2">
        <Button
          variant="outline"
          onClick={h.prevStep}
          disabled={h.currentStep === 1}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        {h.currentStep < h.STEPS.length ? (
          <Button
            onClick={h.nextStep}
            disabled={!h.isStepValid}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={h.handleSubmit}
            disabled={!h.isStepValid || h.isCreating}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {h.isCreating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {h.isCreating ? "Criando Loja..." : "Criar Loja"}
          </Button>
        )}
      </div>
    </div>
  );
}
