"use client";

import { useState, useRef } from "react";
import { X, MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#F0EBE3]">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-[#5A3C1E]" />
              <span className="text-[15px] font-semibold text-[#1C1008] ml-2.5">
                Meus Endereços
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F3EF] flex items-center justify-center text-[#7C6B5C] hover:text-[#1C1008] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Botão novo endereço */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-[#1C1008] hover:bg-[#5A3C1E] text-white text-[13px] font-medium rounded-xl h-10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Novo Endereço
              </button>
            )}

            {/* Formulário */}
            {showForm && (
              <div className="bg-[#F7F3EF] rounded-2xl p-4 mb-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-4">
                  {editId ? "Editar Endereço" : "Novo Endereço"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* CEP */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        CEP *
                      </label>
                      <div className="relative">
                        <Input
                          value={form.zipcode}
                          onChange={(e) => handleZipcodeChange(e.target.value)}
                          onFocus={() => setFocusedField("zipcode")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="00000-000"
                          maxLength={9}
                          required
                          className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008] pr-8"
                        />
                        {isFetchingCep && (
                          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8998A] animate-spin" />
                        )}
                      </div>
                      {cepError && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {cepError}
                        </p>
                      )}
                      {!cepError && focusedField === "zipcode" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {form.zipcode.length}/9
                        </p>
                      )}
                    </div>

                    {/* Rótulo */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Rótulo (ex: Casa, Trabalho)
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "label" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {(form.label ?? "").length}/30
                        </p>
                      )}
                    </div>

                    {/* Nome */}
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Nome do destinatário *
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "name" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {form.name.length}/80
                        </p>
                      )}
                    </div>

                    {/* Logradouro */}
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Logradouro *
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "street" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {form.street.length}/100
                        </p>
                      )}
                    </div>

                    {/* Número */}
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Número
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "number" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {(form.number ?? "").length}/10
                        </p>
                      )}
                    </div>

                    {/* Complemento */}
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Complemento
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "complement" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {(form.complement ?? "").length}/50
                        </p>
                      )}
                    </div>

                    {/* Bairro */}
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Bairro
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "neighborhood" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {(form.neighborhood ?? "").length}/60
                        </p>
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        Cidade *
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "city" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
                          {form.city.length}/60
                        </p>
                      )}
                    </div>

                    {/* UF */}
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C6B5C] mb-1">
                        UF *
                      </label>
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
                        className="border-[#E8E0D8] focus:border-[#5A3C1E] bg-white rounded-lg h-9 text-[13px] text-[#1C1008]"
                      />
                      {focusedField === "state" && (
                        <p className="text-[10px] text-[#A8998A] mt-0.5">
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
                        className="text-[12px] text-[#7C6B5C]"
                      >
                        Definir como endereço padrão
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="bg-[#1C1008] hover:bg-[#5A3C1E] text-white text-[12px] font-medium rounded-lg h-9 px-5 transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {isCreating || isUpdating ? (
                        <LoadingSpinner size="sm" fullScreen={false} />
                      ) : editId ? (
                        "Salvar"
                      ) : (
                        "Adicionar"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="border border-[#E8E0D8] text-[#7C6B5C] hover:bg-[#F7F3EF] text-[12px] rounded-lg h-9 px-5 transition-colors"
                    >
                      Cancelar
                    </button>
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
                <MapPin className="w-10 h-10 text-[#C4B4A4] mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-[#1C1008] mt-2">
                  Nenhum endereço salvo
                </p>
                <p className="text-[12px] text-[#A8998A] mt-1">
                  Salve endereços para agilizar seus próximos pedidos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-4 flex items-start justify-between gap-3 ${
                      addr.is_default === 1
                        ? "border-[#5A3C1E] bg-[#F7F3EF]"
                        : "border-[#F0EBE3] bg-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        {addr.label && (
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#A8998A]">
                            {addr.label}
                          </span>
                        )}
                        <span className="text-[13px] font-semibold text-[#1C1008]">
                          {addr.name}
                        </span>
                        {addr.is_default === 1 && (
                          <span className="inline-flex items-center text-[9px] font-bold tracking-[0.1em] uppercase text-[#5A3C1E] bg-[#F0E8DC] px-2 py-0.5 rounded-full">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#7C6B5C] mt-0.5">
                        {addr.street}
                        {addr.number ? `, ${addr.number}` : ""}
                        {addr.complement ? ` - ${addr.complement}` : ""}
                      </p>
                      <p className="text-[12px] text-[#7C6B5C]">
                        {addr.neighborhood ? `${addr.neighborhood}, ` : ""}
                        {addr.city} - {addr.state}, {addr.zipcode}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {addr.is_default !== 1 && (
                        <button
                          title="Tornar padrão"
                          onClick={() => setDefaultAddress(addr.id)}
                          className="w-7 h-7 rounded-full hover:bg-[#F0EBE3] flex items-center justify-center text-[#A8998A] hover:text-[#1C1008] transition-colors"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(addr)}
                        className="w-7 h-7 rounded-full hover:bg-[#F0EBE3] flex items-center justify-center text-[#A8998A] hover:text-[#1C1008] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-[#A8998A] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
