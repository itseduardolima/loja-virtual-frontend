# Loja Frontend

Sistema de loja online desenvolvido com Next.js, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install

# Ou usando yarn
yarn install
```

## 🛠️ Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
# ou
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
│   ├── globals.css     # Estilos globais
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página inicial
│   └── login/          # Página de login
├── components/         # Componentes reutilizáveis
│   └── ui/            # Componentes shadcn/ui
└── lib/               # Utilitários
    └── utils.ts       # Funções utilitárias
```

## 🎨 Componentes Disponíveis

- **Button** - Botões com variantes
- **Input** - Campos de entrada
- **Label** - Rótulos para formulários
- **Card** - Cards com header, content e footer

## 🔐 Tela de Login

A tela de login inclui:

- ✅ Campos de email e senha
- ✅ Validação de formulário
- ✅ Mostrar/ocultar senha
- ✅ Checkbox "Lembrar de mim"
- ✅ Links para recuperação de senha
- ✅ Botões de login social (Google e Facebook)
- ✅ Link para cadastro
- ✅ Design responsivo
- ✅ Estados de loading

## 🚀 Próximos Passos

- [ ] Implementar autenticação real
- [ ] Criar dashboard administrativo
- [ ] Implementar CRUD de produtos
- [ ] Adicionar carrinho de compras
- [ ] Implementar sistema de pedidos
- [ ] Adicionar testes unitários

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm lint` - Executa o linter
