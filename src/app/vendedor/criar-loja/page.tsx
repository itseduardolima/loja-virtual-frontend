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
import {
  Store,
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function CriarLojaPage() {
  const hookData = useCreateStorePage();

  // Função auxiliar para acessar erros de forma segura
  const getError = (step: 1 | 2 | 3 | 4, field: string): string | undefined => {
    const errors: { [key: string]: string } | undefined = step === 1 ? hookData.step1Errors : 
                   step === 2 ? hookData.step2Errors :
                   step === 3 ? hookData.step3Errors : hookData.step4Errors;
    return errors?.[field];
  };

  if (hookData.loading) {
    return <LoadingPage />;
  }

  // Se o usuário já possui uma loja, mostrar mensagem
  if (hookData.hasStore) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-7xl mx-auto w-full py-6 sm:py-10">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0">
              <CardContent className="p-6 sm:p-12 text-center">
                <div className="mb-6 sm:mb-8">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <Store className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Você já possui uma loja!
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 break-words">
                    Você já tem uma loja cadastrada:{" "}
                    <strong>{hookData.store?.name}</strong>
                  </p>
                </div>

                <Button
                  onClick={() => hookData.router?.push("/vendedor")}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 flex items-center justify-center gap-2 mx-auto"
                >
                  Ir para página inicial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-semibold">
          Nome da Loja *
        </Label>
        <Input
          id="name"
          value={hookData.formData.name}
          onChange={(e) => hookData.handleInputChange("name", e.target.value)}
          placeholder="Ex: Minha Loja de Roupas"
          className={`mt-2 ${getError(1, 'name') ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {getError(1, 'name') && (
          <p className="mt-1 text-sm text-red-600">{getError(1, 'name')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-semibold">
          Descrição da Loja
        </Label>
        <Textarea
          id="description"
          value={hookData.formData.description}
          onChange={(e) =>
            hookData.handleInputChange("description", e.target.value)
          }
          placeholder="Descreva sua loja e o que você vende..."
          className={`mt-2 ${getError(1, 'description') ? 'border-red-500 focus:ring-red-500' : ''}`}
          rows={3}
        />
        {getError(1, 'description') && (
          <p className="mt-1 text-sm text-red-600">{getError(1, 'description')}</p>
        )}
      </div>

      <div>
        <Label className="text-base font-semibold">Nichos da Loja *</Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Selecione os nichos que melhor descrevem sua loja
        </p>
        {hookData.nichesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hookData.nichesData?.data.map((niche: any) => (
              <div
                key={niche.id}
                onClick={() => hookData.handleNicheToggle(niche.id.toString())}
                className="flex items-center gap-3 p-3 rounded-lg border border-secondary hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Checkbox
                  id={niche.id.toString()}
                  checked={hookData.formData.niche_ids.includes(
                    niche.id.toString()
                  )}
                  onCheckedChange={() =>
                    hookData.handleNicheToggle(niche.id.toString())
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor={niche.id.toString()}
                    className="block cursor-pointer"
                  >
                    <span className="font-medium text-gray-900">
                      {niche.name}
                    </span>
                    {niche.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {niche.description}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
        {getError(1, 'niche_ids') && (
          <p className="mt-2 text-sm text-red-600">{getError(1, 'niche_ids')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-semibold">Logo da Loja</Label>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Adicione o logo da sua loja (opcional)
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                hookData.handleFileChange("logo", e.target.files?.[0] || null)
              }
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors shrink-0"
            >
              Escolher Logo
            </label>
            {hookData.logoPreview && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border shrink-0">
                <Image
                  src={hookData.logoPreview}
                  alt="Logo preview"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Banner da Loja</Label>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Adicione um banner para sua loja (opcional)
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                hookData.handleFileChange("banner", e.target.files?.[0] || null)
              }
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors shrink-0"
            >
              Escolher Banner
            </label>
            {hookData.bannerPreview && (
              <div className="w-28 h-14 sm:w-32 sm:h-16 rounded-lg overflow-hidden border shrink-0">
                <Image
                  src={hookData.bannerPreview}
                  alt="Banner preview"
                  width={128}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="whatsapp"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            WhatsApp
          </Label>
          <div className="flex flex-row gap-2 mt-2 items-stretch">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() =>
                  hookData.setShowCountryDropdown(!hookData.showCountryDropdown)
                }
                className="flex items-center h-12 gap-2 px-3 py-2 border rounded-xl border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 justify-start"
              >
                {hookData.getSelectedCountry()?.flagUrl ? (
                  <img
                    src={hookData.getSelectedCountry()?.flagUrl}
                    alt={`Bandeira do ${hookData.getSelectedCountry()?.name.common
                      }`}
                    className="w-5 h-4 object-cover rounded-sm"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const nextElement =
                        target.nextElementSibling as HTMLElement;
                      target.style.display = "none";
                      if (nextElement) nextElement.style.display = "inline";
                    }}
                  />
                ) : null}
                <span className="text-lg hidden">
                  {hookData.getSelectedCountry()?.flag || "🇧🇷"}
                </span>
                <span className="text-sm font-medium">
                  {hookData.getCountryCallingCode()}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {hookData.showCountryDropdown && (
                <div
                  ref={hookData.dropdownRef}
                  className="absolute top-full left-0 z-10 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1"
                >
                  {hookData.countriesLoading ? (
                    <div className="p-4 text-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    hookData.countriesData?.map((country) => (
                      <button
                        key={country.cca2}
                        type="button"
                        onClick={() =>
                          hookData.handleCountrySelect(country.cca2)
                        }
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${hookData.selectedCountry === country.cca2
                            ? "bg-blue-50 text-blue-700"
                            : ""
                          }`}
                      >
                        <img
                          src={country.flagUrl}
                          alt={`Bandeira do ${country.name.common}`}
                          className="w-5 h-4 object-cover rounded-sm"
                          onError={(e) => {
                            // Fallback para emoji se a imagem não carregar
                            const target = e.currentTarget as HTMLImageElement;
                            const nextElement =
                              target.nextElementSibling as HTMLElement;
                            target.style.display = "none";
                            if (nextElement)
                              nextElement.style.display = "inline";
                          }}
                        />
                        <span className="text-lg hidden">{country.flag}</span>
                        <span className="flex-1 text-sm">
                          {country.name.common}
                        </span>
                        <span className="text-xs text-gray-500">
                          {country.callingCodes[0]}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <Input
              id="whatsapp"
              value={hookData.formData.whatsapp}
              onChange={(e) =>
                hookData.handleInputChange("whatsapp", e.target.value)
              }
              placeholder="11999999999"
              className={`flex-1 min-w-0 h-12 ${getError(2, 'whatsapp') ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {getError(2, 'whatsapp') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'whatsapp')}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="instagram"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            id="instagram"
            type="url"
            value={hookData.formData.instagram}
            onChange={(e) =>
              hookData.handleInputChange("instagram", e.target.value)
            }
            placeholder="https://instagram.com/minhaloja"
            className={`mt-2 ${getError(2, 'instagram') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(2, 'instagram') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'instagram')}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="facebook"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Label>
          <Input
            id="facebook"
            type="url"
            value={hookData.formData.facebook}
            onChange={(e) =>
              hookData.handleInputChange("facebook", e.target.value)
            }
            placeholder="https://facebook.com/minhaloja"
            className={`mt-2 ${getError(2, 'facebook') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(2, 'facebook') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'facebook')}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={hookData.formData.email}
            onChange={(e) =>
              hookData.handleInputChange("email", e.target.value)
            }
            placeholder="contato@minhaloja.com.br"
            className={`mt-2 ${getError(2, 'email') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(2, 'email') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'email')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label htmlFor="cnpj" className="text-base font-semibold">
            CNPJ
          </Label>
          <Input
            id="cnpj"
            value={hookData.formData.cnpj}
            onChange={(e) =>
              hookData.handleInputChange("cnpj", e.target.value)
            }
            placeholder="00.000.000/0000-00"
            className={`mt-2 ${getError(2, 'cnpj') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(2, 'cnpj') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'cnpj')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cpf" className="text-base font-semibold">
            CPF
          </Label>
          <Input
            id="cpf"
            value={hookData.formData.cpf}
            onChange={(e) =>
              hookData.handleInputChange("cpf", e.target.value)
            }
            placeholder="000.000.000-00"
            className={`mt-2 ${getError(2, 'cpf') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(2, 'cpf') && (
            <p className="mt-1 text-sm text-red-600">{getError(2, 'cpf')}</p>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">
              Informações Opcionais
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da
              edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label
            htmlFor="address"
            className="text-base font-semibold flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Endereço
          </Label>
          <Input
            id="address"
            value={hookData.formData.address}
            onChange={(e) =>
              hookData.handleInputChange("address", e.target.value)
            }
            placeholder="Rua das Flores, 123"
            className={`mt-2 ${getError(3, 'address') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'address') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'address')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="text-base font-semibold">
            Cidade
          </Label>
          <Input
            id="city"
            value={hookData.formData.city}
            onChange={(e) => hookData.handleInputChange("city", e.target.value)}
            placeholder="São Paulo"
            className={`mt-2 ${getError(3, 'city') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'city') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'city')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-base font-semibold">
            Estado (UF)
          </Label>
          <Input
            id="state"
            value={hookData.formData.state}
            onChange={(e) =>
              hookData.handleInputChange("state", e.target.value)
            }
            placeholder="SP"
            className={`mt-2 ${getError(3, 'state') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'state') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'state')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="zipcode" className="text-base font-semibold">
            CEP
          </Label>
          <Input
            id="zipcode"
            value={hookData.formData.zipcode}
            onChange={(e) =>
              hookData.handleInputChange("zipcode", e.target.value)
            }
            placeholder="01234-567"
            className={`mt-2 ${getError(3, 'zipcode') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'zipcode') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'zipcode')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="neighborhood" className="text-base font-semibold">
            Bairro
          </Label>
          <Input
            id="neighborhood"
            value={hookData.formData.neighborhood}
            onChange={(e) =>
              hookData.handleInputChange("neighborhood", e.target.value)
            }
            placeholder="Centro"
            className={`mt-2 ${getError(3, 'neighborhood') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'neighborhood') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'neighborhood')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="number" className="text-base font-semibold">
            Número
          </Label>
          <Input
            id="number"
            value={hookData.formData.number}
            onChange={(e) =>
              hookData.handleInputChange("number", e.target.value)
            }
            placeholder="123"
            className={`mt-2 ${getError(3, 'number') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'number') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'number')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="complement" className="text-base font-semibold">
            Complemento
          </Label>
          <Input
            id="complement"
            value={hookData.formData.complement}
            onChange={(e) =>
              hookData.handleInputChange("complement", e.target.value)
            }
            placeholder="Apto 45"
            className={`mt-2 ${getError(3, 'complement') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'complement') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'complement')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="delivery_fee" className="text-base font-semibold">
            Taxa de Entrega (R$)
          </Label>
          <Input
            id="delivery_fee"
            type="text"
            value={hookData.formData.delivery_fee}
            onChange={(e) =>
              hookData.handleInputChange("delivery_fee", e.target.value)
            }
            placeholder="5.50"
            className={`mt-2 ${getError(3, 'delivery_fee') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'delivery_fee') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'delivery_fee')}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="free_delivery_min"
            className="text-base font-semibold"
          >
            Valor Mínimo para Entrega Grátis (R$)
          </Label>
          <Input
            id="free_delivery_min"
            type="text"
            value={hookData.formData.free_delivery_min}
            onChange={(e) =>
              hookData.handleInputChange("free_delivery_min", e.target.value)
            }
            placeholder="50.00"
            className={`mt-2 ${getError(3, 'free_delivery_min') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'free_delivery_min') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'free_delivery_min')}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor="delivery_time"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Tempo de Entrega
          </Label>
          <Input
            id="delivery_time"
            value={hookData.formData.delivery_time}
            onChange={(e) =>
              hookData.handleInputChange("delivery_time", e.target.value)
            }
            placeholder="2-3 dias úteis"
            className={`mt-2 ${getError(3, 'delivery_time') ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {getError(3, 'delivery_time') && (
            <p className="mt-1 text-sm text-red-600">{getError(3, 'delivery_time')}</p>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">
              Informações Opcionais
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da
              edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Métodos de Pagamento
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Selecione os métodos de pagamento que você aceita
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hookData.PAYMENT_METHODS.map((method) => (
            <div
              key={method}
              onClick={() => hookData.handlePaymentMethodToggle(method)}
              className="flex items-center gap-3 p-3 rounded-lg border border-secondary hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Checkbox
                id={method}
                checked={
                  hookData.formData.payment_methods?.includes(method) || false
                }
                onCheckedChange={() =>
                  hookData.handlePaymentMethodToggle(method)
                }
              />
              <div className="flex-1">
                <label htmlFor={method} className="block cursor-pointer">
                  <span className="font-medium text-gray-900">{method}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        {getError(4, 'payment_methods') && (
          <p className="mt-2 text-sm text-red-600">{getError(4, 'payment_methods')}</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">
              Informações Opcionais
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da
              edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (hookData.currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Criar Nova Loja</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Configure sua loja online em poucos passos
            </p>
          </div>
          <div className="hidden sm:block text-right min-w-0 max-w-[120px] lg:max-w-none shrink-0">
            <p className="font-semibold text-gray-900 truncate text-sm">
              {hookData.user?.name || "Usuário"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {hookData.user?.profile || "Perfil não informado"}
            </p>
          </div>
        </div>

        {/* Progress Steps: em telas grandes usa largura total; em mobile scroll horizontal */}
        <div className="mb-6 sm:mb-8 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center w-full min-w-[280px] max-w-3xl lg:max-w-none mx-auto">
            {hookData.STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0 last:flex-none last:min-w-0">
                {/* Círculo da etapa */}
                <div className="flex items-center shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${hookData.currentStep >= step.id
                        ? "bg-primary text-white hover:bg-primary/80"
                        : "bg-secondary text-primary"
                      }`}
                  >
                    {hookData.currentStep > step.id ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 hidden sm:block max-w-[72px] md:max-w-[100px] lg:max-w-none">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate lg:whitespace-normal ${hookData.currentStep >= step.id
                          ? "text-primary"
                          : "text-gray-600"
                        }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate lg:whitespace-normal">{step.description}</p>
                  </div>
                </div>
                {/* Linha centralizada entre os números */}
                {index < hookData.STEPS.length - 1 && (
                  <div className="flex-1 flex items-center min-w-[12px] sm:min-w-[16px] lg:min-w-[24px] px-1 sm:px-2 lg:px-4">
                    <div
                      className={`w-full h-0.5 rounded-full ${hookData.currentStep > step.id
                          ? "bg-primary"
                          : "bg-secondary"
                        }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              {hookData.STEPS[hookData.currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">{renderCurrentStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 sm:justify-between mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={hookData.prevStep}
            disabled={hookData.currentStep === 1}
            className="flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          {hookData.currentStep < hookData.STEPS.length ? (
            <Button
              onClick={hookData.nextStep}
              disabled={!hookData.isStepValid}
              className="flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={hookData.handleSubmit}
              disabled={!hookData.isStepValid || hookData.isCreating}
              className="flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              {hookData.isCreating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {hookData.isCreating ? "Criando Loja..." : "Criar Loja"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
