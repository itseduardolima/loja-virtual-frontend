"use client";

import { useState, useRef } from "react";
import { X, MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useAddresses, CreateAddressData, Address } from "@/hooks/useAddresses";
import { LoadingSpinner } from "../Layout/LoadingSpinner";

const emptyForm: CreateAddressData = {
  label: "",
  name: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipcode: "",
  is_default: 0,
};

interface CustomerAddressesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerAddressesDrawer({
  isOpen,
  onClose,
}: CustomerAddressesDrawerProps) {
  const { isAuthenticated } = useAuth();
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    isCreating,
    isUpdating,
  } = useAddresses(isAuthenticated && isOpen);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateAddressData>(emptyForm);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepError, setCepError] = useState("");
  const numberInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (addr: Address) => {
    setEditId(addr.id);
    setForm({
      label: addr.label ?? "",
      name: addr.name,
      street: addr.street,
      number: addr.number ?? "",
      complement: addr.complement ?? "",
      neighborhood: addr.neighborhood ?? "",
      city: addr.city,
      state: addr.state,
      zipcode: addr.zipcode,
      is_default: addr.is_default,
    });
    setCepError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.zipcode
    )
      return;
    if (editId) {
      await updateAddress({ id: editId, data: form });
    } else {
      await createAddress(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setCepError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setCepError("");
  };

  const handleZipcodeChange = async (value: string) => {
    const formatted = value.slice(0, 9);
    setForm((p) => ({ ...p, zipcode: formatted }));
    setCepError("");

    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (data.erro) {
          setCepError("CEP não encontrado");
        } else {
          setForm((p) => ({
            ...p,
            zipcode: formatted,
            street: data.logradouro || p.street,
            neighborhood: data.bairro || p.neighborhood,
            city: data.localidade || p.city,
            state: data.uf || p.state,
          }));
          setTimeout(() => numberInputRef.current?.focus(), 50);
        }
      } catch {
        setCepError("Erro ao consultar o CEP");
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Meus Endereços
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Botão novo endereço */}
            {!showForm && (
              <Button className="w-full" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" /> Novo Endereço
              </Button>
            )}

            {/* Formulário */}
            {showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">
                  {editId ? "Editar Endereço" : "Novo Endereço"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* CEP */}
                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-xs">CEP *</Label>
                      <div className="relative">
                        <Input
                          value={form.zipcode}
                          onChange={(e) => handleZipcodeChange(e.target.value)}
                          onFocus={() => setFocusedField("zipcode")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="00000-000"
                          maxLength={9}
                          required
                          className="h-9 text-sm pr-8"
                        />
                        {isFetchingCep && (
                          <Loader2
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                        )}
                      </div>
                      {cepError && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {cepError}
                        </p>
                      )}
                      {!cepError && focusedField === "zipcode" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.zipcode.length}/9
                        </p>
                      )}
                    </div>

                    {/* Rótulo */}
                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-xs">
                        Rótulo (ex: Casa, Trabalho)
                      </Label>
                      <Input
                        value={form.label}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            label: e.target.value.slice(0, 30),
                          }))
                        }
                        onFocus={() => setFocusedField("label")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Casa"
                        maxLength={30}
                        className="h-9 text-sm"
                      />
                      {focusedField === "label" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(form.label ?? "").length}/30
                        </p>
                      )}
                    </div>

                    {/* Nome */}
                    <div className="col-span-2">
                      <Label className="text-xs">Nome do destinatário *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            name: e.target.value.slice(0, 80),
                          }))
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Nome completo"
                        maxLength={80}
                        required
                        className="h-9 text-sm"
                      />
                      {focusedField === "name" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.name.length}/80
                        </p>
                      )}
                    </div>

                    {/* Logradouro */}
                    <div className="col-span-2">
                      <Label className="text-xs">Logradouro *</Label>
                      <Input
                        value={form.street}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            street: e.target.value.slice(0, 100),
                          }))
                        }
                        onFocus={() => setFocusedField("street")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Rua, Avenida..."
                        maxLength={100}
                        required
                        className="h-9 text-sm"
                      />
                      {focusedField === "street" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.street.length}/100
                        </p>
                      )}
                    </div>

                    {/* Número */}
                    <div>
                      <Label className="text-xs">Número</Label>
                      <Input
                        ref={numberInputRef}
                        value={form.number}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            number: e.target.value.slice(0, 10),
                          }))
                        }
                        onFocus={() => setFocusedField("number")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="123"
                        maxLength={10}
                        className="h-9 text-sm"
                      />
                      {focusedField === "number" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(form.number ?? "").length}/10
                        </p>
                      )}
                    </div>

                    {/* Complemento */}
                    <div>
                      <Label className="text-xs">Complemento</Label>
                      <Input
                        value={form.complement}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            complement: e.target.value.slice(0, 50),
                          }))
                        }
                        onFocus={() => setFocusedField("complement")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Apto 4B"
                        maxLength={50}
                        className="h-9 text-sm"
                      />
                      {focusedField === "complement" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(form.complement ?? "").length}/50
                        </p>
                      )}
                    </div>

                    {/* Bairro */}
                    <div className="col-span-2">
                      <Label className="text-xs">Bairro</Label>
                      <Input
                        value={form.neighborhood}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            neighborhood: e.target.value.slice(0, 60),
                          }))
                        }
                        onFocus={() => setFocusedField("neighborhood")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Bairro"
                        maxLength={60}
                        className="h-9 text-sm"
                      />
                      {focusedField === "neighborhood" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(form.neighborhood ?? "").length}/60
                        </p>
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <Label className="text-xs">Cidade *</Label>
                      <Input
                        value={form.city}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            city: e.target.value.slice(0, 60),
                          }))
                        }
                        onFocus={() => setFocusedField("city")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="São Paulo"
                        maxLength={60}
                        required
                        className="h-9 text-sm"
                      />
                      {focusedField === "city" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.city.length}/60
                        </p>
                      )}
                    </div>

                    {/* UF */}
                    <div>
                      <Label className="text-xs">UF *</Label>
                      <Input
                        value={form.state}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            state: e.target.value.toUpperCase().slice(0, 2),
                          }))
                        }
                        onFocus={() => setFocusedField("state")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="SP"
                        maxLength={2}
                        required
                        className="h-9 text-sm"
                      />
                      {focusedField === "state" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.state.length}/2
                        </p>
                      )}
                    </div>

                    {/* Padrão */}
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_default_drawer"
                        checked={form.is_default === 1}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            is_default: e.target.checked ? 1 : 0,
                          }))
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="is_default_drawer"
                        className="text-xs text-gray-700"
                      >
                        Definir como endereço padrão
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating ? (
                        <LoadingSpinner size="sm" fullScreen={false} />
                      ) : editId ? (
                        "Salvar"
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-10">
                <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="font-medium text-gray-700 text-sm mb-1">
                  Nenhum endereço salvo
                </p>
                <p className="text-xs text-gray-500">
                  Salve endereços para agilizar seus próximos pedidos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white border rounded-xl p-3 flex items-start justify-between gap-2 ${addr.is_default === 1 ? "border-gray-900" : "border-gray-200"}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        {addr.label && (
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {addr.label}
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {addr.name}
                        </span>
                        {addr.is_default === 1 && (
                          <Badge variant="default" className="text-xs">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {addr.street}
                        {addr.number ? `, ${addr.number}` : ""}
                        {addr.complement ? ` - ${addr.complement}` : ""}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr.neighborhood ? `${addr.neighborhood}, ` : ""}
                        {addr.city} - {addr.state}, {addr.zipcode}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {addr.is_default !== 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          title="Tornar padrão"
                          onClick={() => setDefaultAddress(addr.id)}
                        >
                          <Star className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(addr)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeAddress(addr.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
