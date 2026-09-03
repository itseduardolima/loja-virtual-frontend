import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LegalDoc,
  P,
  Sub,
  Bullets,
  Strong,
  Callout,
  DataTable,
  type LegalSection,
} from '../_legal/LegalDoc'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Nexo',
  description:
    'Como a Nexo trata dados pessoais na operação da plataforma — os dados do lojista e os dados dos compradores finais que passam pela vitrine de cada loja.',
}

const sections: LegalSection[] = [
  {
    id: 'papeis',
    title: 'Papéis: quem é operadora e quem é controladora',
    content: (
      <>
        <P>
          A Lei Geral de Proteção de Dados (LGPD) distingue duas funções: o{' '}
          <Strong>controlador</Strong>, que decide para que servem os dados e por que são coletados,
          e o <Strong>operador</Strong>, que trata os dados seguindo as instruções do controlador. Na
          Nexo, esses papéis dependem de quem é o titular do dado:
        </P>
        <Callout title="Importante">
          <P>
            Para os <Strong>dados do comprador final</Strong> coletados no checkout de uma loja
            (nome, endereço de entrega, telefone, CPF/CNPJ, itens comprados), o{' '}
            <Strong>lojista é o controlador</Strong> — é ele quem decide vender pela sua vitrine e
            quem usa esses dados para cumprir o pedido. A <Strong>Nexo atua como operadora</Strong>,
            processando esses dados apenas para fazer a plataforma funcionar (armazenar o pedido,
            calcular frete, exibir no painel do lojista), sem decidir por conta própria o que fazer
            com eles.
          </P>
          <P>
            Já para os <Strong>dados do próprio lojista</Strong> (cadastro da conta e da loja,
            assinatura do plano), a <Strong>Nexo é a controladora</Strong>, pois é a Nexo quem decide
            como esses dados são usados para operar o negócio da plataforma.
          </P>
        </Callout>
        <P>
          Na prática: se você é um <Strong>comprador</Strong> e quer exercer um direito sobre seus
          dados de um pedido, o primeiro contato deve ser a <Strong>loja onde comprou</Strong> — veja a
          seção 07.
        </P>
      </>
    ),
  },
  {
    id: 'dados-lojista',
    title: 'Dados coletados do lojista',
    content: (
      <>
        <P>Ao criar uma conta e configurar uma loja, coletamos:</P>
        <DataTable
          head={['Dado', 'Para que usamos']}
          rows={[
            ['Nome, e-mail e senha (armazenada com hash)', 'Criar e autenticar a conta no painel'],
            ['WhatsApp e telefone', 'Contato sobre a conta e verificação de identidade'],
            ['CPF ou CNPJ', 'Cobrança da assinatura, emissão fiscal e prevenção a fraude'],
            [
              'Endereço, horário de funcionamento e demais dados da loja',
              'Exibir a vitrine pública e calcular frete/localização',
            ],
            [
              'Dados de pagamento da assinatura (cartão/boleto/Pix)',
              'Processados diretamente pelo meio de pagamento integrado à plataforma — a Nexo não armazena número completo de cartão',
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: 'dados-comprador',
    title: 'Dados coletados do comprador final',
    content: (
      <>
        <P>
          Quando alguém finaliza uma compra em uma loja hospedada na Nexo, os dados abaixo são
          inseridos pelo próprio comprador no checkout, sob a responsabilidade do lojista como
          controlador:
        </P>
        <DataTable
          head={['Dado', 'Para que é usado']}
          rows={[
            ['Nome completo', 'Identificar o pedido e o destinatário da entrega'],
            ['E-mail', 'Enviar confirmação e permitir rastreio do pedido'],
            ['Telefone/WhatsApp', 'A loja entrar em contato para combinar pagamento e entrega'],
            ['CPF ou CNPJ', 'Emissão de nota fiscal pelo lojista, quando aplicável'],
            ['Endereço de entrega', 'Cálculo de frete e envio do produto'],
            ['Itens, valores e histórico do pedido', 'Processar e registrar a compra'],
          ]}
        />
        <P>
          Esses dados ficam visíveis para o lojista da loja onde a compra foi feita, e nunca são
          compartilhados com outras lojas da plataforma.
        </P>
      </>
    ),
  },
  {
    id: 'finalidade',
    title: 'Finalidade do tratamento',
    content: (
      <Bullets
        items={[
          'Operar a plataforma: autenticação, checkout, criação e acompanhamento de pedidos.',
          'Processar o pagamento da assinatura do lojista.',
          'Enviar comunicações transacionais (confirmação de pedido, cobrança da assinatura, notificações do painel).',
          'Dar suporte ao lojista e ao comprador sobre o funcionamento da plataforma.',
          'Prevenir fraude e cumprir obrigações legais e fiscais.',
          'Gerar métricas agregadas de uso do produto para melhorar a plataforma — sem venda de dados pessoais a terceiros para fins de publicidade.',
        ]}
      />
    ),
  },
  {
    id: 'compartilhamento',
    title: 'Compartilhamento com terceiros',
    content: (
      <>
        <P>
          A Nexo compartilha dados apenas com prestadores de serviço necessários para operar a
          plataforma, sempre limitado ao que cada um precisa para prestar seu serviço:
        </P>
        <Bullets
          items={[
            <>
              <Strong>Meio de pagamento integrado (Asaas)</Strong> — recebe os dados necessários para
              cobrar a assinatura do lojista e, quando aplicável, viabilizar o checkout de vendas.
            </>,
            <>
              <Strong>Provedor de armazenamento e CDN de imagens</Strong> — hospeda as fotos de
              produtos, logo e banner de cada loja para exibição rápida na vitrine.
            </>,
            <>
              <Strong>Provedores de hospedagem e infraestrutura em nuvem</Strong> — mantêm o banco de
              dados e os servidores da aplicação no ar.
            </>,
            <>
              <Strong>Serviço de envio de e-mail transacional</Strong> — entrega e-mails de
              confirmação de cadastro, pedido e cobrança.
            </>,
            <>
              <Strong>Autoridades públicas</Strong> — quando exigido por lei, ordem judicial ou para
              exercício regular de direitos em processo administrativo ou judicial.
            </>,
          ]}
        />
        <P>A Nexo não vende dados pessoais a terceiros para fins de publicidade.</P>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies e armazenamento local',
    content: (
      <>
        <P>
          A plataforma usa cookies e armazenamento local do navegador (localStorage) essenciais para
          o funcionamento da loja e do painel — por exemplo, para manter a sessão de login, lembrar o
          carrinho de compras entre visitas e guardar a lista de favoritos (wishlist) de cada loja.
          Sem esses itens, funcionalidades básicas como carrinho e login deixam de funcionar.
        </P>
        <P>
          A Nexo não usa, hoje, cookies de rastreamento publicitário de terceiros. Se isso mudar (por
          exemplo, com a ativação de ferramentas de análise de tráfego), esta política será atualizada
          antes da mudança entrar em vigor.
        </P>
      </>
    ),
  },
  {
    id: 'direitos-titular',
    title: 'Direitos do titular dos dados',
    content: (
      <>
        <P>Conforme a LGPD, todo titular de dados pessoais tem direito a:</P>
        <Bullets
          items={[
            'Confirmar se seus dados são tratados e acessá-los.',
            'Corrigir dados incompletos, inexatos ou desatualizados.',
            'Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei.',
            'Solicitar a portabilidade dos dados a outro fornecedor de serviço.',
            'Eliminar dados tratados com base no consentimento, quando aplicável.',
            'Ser informado sobre com quem seus dados são compartilhados.',
            'Revogar o consentimento, quando o tratamento tiver essa base legal.',
          ]}
        />
        <Sub>Como exercer</Sub>
        <P>
          <Strong>Se você é comprador</Strong> e quer exercer algum desses direitos sobre um pedido,
          fale primeiro diretamente com a loja onde comprou, pelo canal de contato exibido na
          vitrine — ela é a controladora desses dados (seção 01). Se a loja não responder em prazo
          razoável, ou sua dúvida for sobre como a própria Nexo processa esses dados como operadora,
          entre em contato pelo canal do encarregado indicado na seção 12.
        </P>
        <P>
          <Strong>Se você é lojista</Strong>, pode corrigir a maior parte dos seus dados diretamente
          no painel (Configurações da loja) ou solicitar exclusão de conta pelo suporte da Nexo
          (seção 12).
        </P>
      </>
    ),
  },
  {
    id: 'retencao',
    title: 'Retenção e exclusão de dados',
    content: (
      <P>
        Os dados são mantidos enquanto a conta ou a loja estiver ativa, e pelo prazo adicional
        exigido por obrigações legais aplicáveis (fiscais, cíveis e regulatórias — por exemplo, o
        prazo de guarda de documentos fiscais e o prazo prescricional do Código de Defesa do
        Consumidor). Após o encerramento de uma conta ou loja, os dados podem ser mantidos por até{' '}
        <Strong>5 anos</Strong> para fins de auditoria e cumprimento legal, antes de serem
        eliminados ou anonimizados definitivamente.
      </P>
    ),
  },
  {
    id: 'seguranca',
    title: 'Segurança da informação',
    content: (
      <>
        <P>Medidas técnicas adotadas para proteger os dados na plataforma incluem:</P>
        <Bullets
          items={[
            'Senhas armazenadas com hash — a Nexo nunca guarda senhas em texto puro.',
            'Conexão criptografada (HTTPS) entre o navegador e os servidores da plataforma.',
            'Sessões autenticadas por token com renovação automática e expiração.',
            'Controle de acesso por perfil (comprador, vendedor, administrador).',
            'Isolamento entre lojas: os dados de uma loja não ficam visíveis para outra loja da plataforma.',
          ]}
        />
        <P>
          Nenhum sistema é livre de risco. Caso um incidente de segurança venha a afetar dados
          pessoais, a Nexo notificará os titulares afetados e a Autoridade Nacional de Proteção de
          Dados (ANPD) conforme exigido pela LGPD.
        </P>
      </>
    ),
  },
  {
    id: 'transferencia-internacional',
    title: 'Transferência internacional de dados',
    content: (
      <P>
        Alguns dos prestadores de serviço listados na seção 05 processam dados fora do Brasil — hoje,
        o provedor de armazenamento e CDN de imagens (Cloudflare) opera em infraestrutura global,
        podendo processar dados em outros países. O meio de pagamento (Asaas) é uma empresa brasileira
        e processa os dados em servidores no Brasil. Nesses casos, a Nexo busca contratar apenas
        fornecedores com salvaguardas compatíveis com a LGPD.
      </P>
    ),
  },
  {
    id: 'alteracoes-privacidade',
    title: 'Alterações desta política',
    content: (
      <P>
        Esta Política pode ser atualizada para refletir mudanças na plataforma, nos fornecedores
        utilizados ou na legislação. Mudanças relevantes são comunicadas por e-mail ou aviso no
        painel do vendedor. Esta versão está em vigor desde a data indicada no topo desta página. Veja
        também os{' '}
        <Link href="/termos" className="font-semibold text-nxp hover:text-nxp/80">
          Termos de Uso
        </Link>
        .
      </P>
    ),
  },
  {
    id: 'contato-dpo',
    title: 'Contato e encarregado de dados (DPO)',
    content: (
      <>
        <P>Para dúvidas sobre esta política ou para exercer direitos sobre dados tratados pela Nexo como controladora:</P>
        <Bullets
          items={[
            <>
              E-mail do encarregado (DPO): <Strong>contato@eduardolima.tech</Strong>
            </>,
            <>
              Endereço da empresa: <Strong>Manaus, AM — CEP 69085-045</Strong>
            </>,
          ]}
        />
        <P>
          Compradores com dúvidas sobre um pedido específico devem falar primeiro com a loja onde
          compraram (seção 07).
        </P>
      </>
    ),
  },
]

export default function PrivacidadePage() {
  return (
    <LegalDoc
      eyebrow="Documento legal"
      title="Política de Privacidade"
      summary="Como a Nexo trata dados pessoais na operação da plataforma — os seus, como lojista, e os dos compradores finais que passam pela sua vitrine."
      updatedAt="9 de agosto de 2026"
      sections={sections}
      related={{ href: '/termos', label: 'Termos de Uso' }}
    />
  )
}
