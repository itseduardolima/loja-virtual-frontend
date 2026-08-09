import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalDoc, P, Sub, Bullets, Strong, Callout, Fill, type LegalSection } from '../_legal/LegalDoc'

export const metadata: Metadata = {
  title: 'Termos de Uso | Nexo',
  description:
    'Regras de uso da plataforma Nexo para lojistas que criam e operam sua vitrine de e-commerce e para os compradores que compram nessas lojas.',
}

const sections: LegalSection[] = [
  {
    id: 'objeto',
    title: 'O que é a Nexo',
    content: (
      <>
        <P>
          A Nexo é uma plataforma de <Strong>software como serviço (SaaS) multi-tenant</Strong>: cada
          lojista que se cadastra recebe sua própria vitrine de e-commerce (catálogo de produtos,
          carrinho, checkout, painel de gestão de pedidos) para vender diretamente aos seus clientes,
          sob sua própria marca.
        </P>
        <P>
          Estes Termos de Uso regem o uso da plataforma tanto por <Strong>lojistas</Strong> (quem
          contrata um plano e opera uma loja) quanto por <Strong>compradores</Strong> (quem navega e
          compra em uma loja hospedada na Nexo). Ao criar uma conta, contratar um plano ou finalizar
          uma compra em qualquer loja da Nexo, você concorda com o que está descrito aqui.
        </P>
        <Sub>O que a Nexo fornece</Sub>
        <Bullets
          items={[
            'A infraestrutura técnica da vitrine: catálogo, carrinho, checkout, cálculo de frete, cupons e páginas da loja.',
            'O painel de gestão do vendedor: cadastro de produtos, pedidos, avaliações, perguntas e relatórios.',
            'O processamento da assinatura do lojista junto ao meio de pagamento utilizado pela plataforma.',
            'Notificações, rastreamento de pedidos e demais recursos descritos no plano contratado.',
          ]}
        />
        <Sub>O que a Nexo não faz</Sub>
        <Bullets
          items={[
            'A Nexo não fabrica, não estoca, não embala e não entrega os produtos anunciados pelos lojistas.',
            'A Nexo não define preços, prazos de entrega ou políticas comerciais das lojas — isso é decisão de cada lojista.',
            'A Nexo não é vendedora nem parte no contrato de compra e venda entre a loja e o comprador final (ver seção 05).',
          ]}
        />
      </>
    ),
  },
  {
    id: 'cadastro',
    title: 'Cadastro e responsabilidades do lojista',
    content: (
      <>
        <P>
          Para operar uma loja é preciso criar uma conta informando nome, e-mail, WhatsApp e, no
          fluxo de contratação do plano, um CPF ou CNPJ válido. Ao se cadastrar, o lojista declara
          que:
        </P>
        <Bullets
          items={[
            'As informações fornecidas são verdadeiras, completas e serão mantidas atualizadas.',
            'É maior de idade e tem capacidade legal para contratar, ou representa uma pessoa jurídica regularmente constituída.',
            'É responsável por manter a senha da conta em sigilo e por toda atividade realizada com seu login.',
            'Vai notificar a Nexo imediatamente em caso de suspeita de uso não autorizado da conta.',
            'Cada CPF ou CNPJ pode estar vinculado a uma conta de lojista — contas duplicadas usadas para burlar limites de plano ou período de teste podem ser suspensas.',
          ]}
        />
        <P>
          O lojista é o único responsável pela veracidade dos dados da sua loja (nome, endereço,
          horário de funcionamento, canais de contato) e pelo conteúdo que publica — ver seção 04.
        </P>
      </>
    ),
  },
  {
    id: 'planos-pagamento',
    title: 'Planos, assinatura e pagamento',
    content: (
      <>
        <P>
          O acesso ao painel do vendedor e à vitrine pública da loja depende de uma assinatura ativa
          em um dos planos disponíveis. A cobrança é recorrente, conforme o ciclo do plano contratado,
          e o pagamento é processado por um meio de pagamento terceiro integrado à plataforma — os
          dados do cartão ou boleto não passam pelos servidores da Nexo.
        </P>
        <Callout title="Carência de 7 dias em caso de atraso">
          Se um pagamento da assinatura falhar, a loja <Strong>não é suspensa imediatamente</Strong>.
          A Nexo concede um período de carência de <Strong>7 dias corridos</Strong> a partir do
          vencimento, durante o qual a loja e o painel continuam funcionando normalmente enquanto o
          lojista regulariza o pagamento. Encerrado esse prazo sem regularização, a loja e o painel
          podem ser suspensos até que a pendência seja resolvida.
        </Callout>
        <Sub>Cancelamento</Sub>
        <P>
          O lojista pode cancelar a assinatura a qualquer momento pelo painel. O cancelamento produz
          efeito ao final do ciclo de cobrança já pago — não há reembolso proporcional pelo período
          já iniciado, salvo quando exigido pela legislação aplicável (por exemplo, direito de
          arrependimento em até 7 dias da primeira contratação, conforme o Código de Defesa do
          Consumidor).
        </P>
      </>
    ),
  },
  {
    id: 'conteudo-loja',
    title: 'Conteúdo da loja e uso aceitável',
    content: (
      <>
        <P>
          O lojista é o único responsável pelas informações, fotos, descrições, preços, categorias e
          políticas que publica em sua vitrine. A Nexo não revisa previamente o conteúdo de cada
          loja, mas pode remover conteúdo ou suspender uma loja que viole a lei ou estas regras.
        </P>
        <Sub>É proibido usar a Nexo para vender ou divulgar</Sub>
        <Bullets
          items={[
            'Produtos ilegais, falsificados, roubados ou cuja venda seja restrita sem a autorização exigida.',
            'Conteúdo discriminatório, ofensivo, difamatório ou que incite violência ou ódio.',
            'Material que viole direitos autorais, marcas ou outra propriedade intelectual de terceiros.',
            'Práticas fraudulentas, golpes, pirâmides financeiras ou informações enganosas sobre o produto.',
            'Spam, phishing ou qualquer uso que comprometa a segurança da plataforma ou de outros usuários.',
          ]}
        />
        <P>
          Denúncias de conteúdo abusivo podem ser enviadas pelos canais de suporte (seção 12). Quando
          possível, a Nexo avisa o lojista antes de remover conteúdo ou suspender a loja; em casos
          graves (fraude, ilegalidade evidente), a remoção pode ocorrer imediatamente.
        </P>
      </>
    ),
  },
  {
    id: 'relacao-comprador',
    title: 'Relação comercial entre a loja e o comprador final',
    content: (
      <>
        <P>
          Toda compra feita em uma loja hospedada na Nexo é um contrato de compra e venda firmado{' '}
          <Strong>diretamente entre o lojista e o comprador</Strong>. A Nexo fornece a tecnologia que
          viabiliza essa venda (vitrine, checkout, registro do pedido), mas não é vendedora,
          intermediária financeira da venda de produtos, nem parte nesse contrato.
        </P>
        <P>
          Combinar pagamento, prazo e forma de entrega, tirar dúvidas sobre o produto e resolver
          problemas do pedido são etapas que acontecem entre o comprador e a loja, normalmente pelo
          canal de contato que o lojista cadastrar (WhatsApp, e-mail, redes sociais). Por isso é
          responsabilidade do lojista manter pelo menos um canal de contato ativo e atualizado no
          painel, para que o comprador consiga falar com a loja após finalizar a compra.
        </P>
      </>
    ),
  },
  {
    id: 'reembolso',
    title: 'Reembolso, trocas, garantia e entrega',
    content: (
      <>
        <P>
          Prazos e formas de entrega, política de troca, devolução, reembolso e garantia dos produtos
          vendidos são definidos e executados por <Strong>cada lojista individualmente</Strong>,
          respeitadas as regras mínimas do Código de Defesa do Consumidor (como o direito de
          arrependimento em compras à distância). A Nexo é a plataforma que hospeda a loja — não
          processa reembolsos de vendas realizadas pelos lojistas, não garante prazos de entrega e
          não retém valores das vendas para cobrir eventuais reembolsos.
        </P>
        <P>
          Se um pedido não chegar, vier com defeito ou divergir do anunciado, o comprador deve
          procurar a loja diretamente pelos canais de contato divulgados na vitrine. A Nexo pode
          intermediar reclamações sobre falhas <Strong>da plataforma em si</Strong> (indisponibilidade
          do site, erro no checkout, falha no processamento do pedido), mas não sobre o cumprimento do
          pedido pela loja.
        </P>
      </>
    ),
  },
  {
    id: 'suspensao',
    title: 'Suspensão e encerramento de conta',
    content: (
      <>
        <P>A Nexo pode suspender ou encerrar o acesso de uma loja ao painel e à vitrine pública quando:</P>
        <Bullets
          items={[
            'A assinatura ficar inadimplente após o fim do período de carência de 7 dias (seção 03).',
            'For identificado conteúdo abusivo, ilegal ou fraudulento (seção 04).',
            'Houver violação repetida ou grave destes Termos de Uso.',
            'O próprio lojista solicitar o encerramento voluntário da conta.',
          ]}
        />
        <P>
          Enquanto suspensa, a loja fica inacessível na vitrine pública e o painel pode ficar
          bloqueado ou disponível apenas em modo de leitura. Os dados são mantidos pelo prazo
          necessário para cumprir obrigações legais (por exemplo, fiscais) antes de qualquer exclusão
          definitiva — ver seção 08 da{' '}
          <Link href="/privacidade" className="font-semibold text-nxp hover:text-nxp/80">
            Política de Privacidade
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: 'limitacao-responsabilidade',
    title: 'Limitação de responsabilidade da Nexo',
    content: (
      <>
        <P>Nos limites permitidos pela legislação brasileira, a Nexo não se responsabiliza por:</P>
        <Bullets
          items={[
            'Qualidade, legalidade, veracidade ou adequação dos produtos anunciados pelos lojistas.',
            'Cumprimento de prazos de entrega, política de troca ou garantia definidos por cada lojista.',
            'Disputas comerciais entre um lojista e um comprador final.',
            'Indisponibilidades causadas por caso fortuito, força maior, ou por falhas de terceiros dos quais a plataforma depende (meio de pagamento, provedores de nuvem e de infraestrutura).',
          ]}
        />
        <P>
          A responsabilidade da Nexo perante o lojista, quando aplicável, fica limitada ao valor
          efetivamente pago pela assinatura do plano no período de{' '}
          <Fill>prazo considerado para o teto de responsabilidade, ex.: últimos 12 meses</Fill>{' '}
          anterior ao fato gerador.
        </P>
      </>
    ),
  },
  {
    id: 'propriedade-intelectual',
    title: 'Propriedade intelectual',
    content: (
      <>
        <P>
          A marca Nexo, o software da plataforma, seu design e código-fonte pertencem à{' '}
          <Fill>razão social e CNPJ da empresa responsável pela Nexo</Fill> e são protegidos por leis
          de propriedade intelectual. Nenhuma disposição destes Termos transfere ao lojista ou ao
          comprador qualquer direito sobre a plataforma além do uso descrito aqui.
        </P>
        <P>
          O lojista mantém a titularidade sobre sua própria marca, fotos, textos e demais conteúdos
          que publica em sua loja, e concede à Nexo uma licença limitada, não exclusiva, para hospedar
          e exibir esse conteúdo exclusivamente para operar a vitrine.
        </P>
      </>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações destes termos',
    content: (
      <>
        <P>
          Estes Termos podem ser atualizados para refletir mudanças na plataforma ou na legislação.
          Alterações relevantes são comunicadas por e-mail ou por aviso no painel do vendedor com
          antecedência razoável. O uso continuado da plataforma após a nova versão entrar em vigor
          representa aceite das mudanças.
        </P>
        <P>Esta versão está em vigor desde a data indicada no topo desta página.</P>
      </>
    ),
  },
  {
    id: 'lei-foro',
    title: 'Legislação aplicável e foro',
    content: (
      <P>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
        comarca de <Fill>comarca/cidade eleita como foro</Fill> para dirimir quaisquer controvérsias
        decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja —
        ressalvado o foro de domicílio do consumidor, quando a lei assim exigir.
      </P>
    ),
  },
  {
    id: 'contato',
    title: 'Contato e suporte',
    content: (
      <>
        <P>Dúvidas sobre estes Termos de Uso ou sobre a plataforma podem ser enviadas para:</P>
        <Bullets
          items={[
            <>
              E-mail: <Fill>e-mail de suporte/atendimento da Nexo</Fill>
            </>,
            <>
              Endereço da empresa: <Fill>endereço completo da sede</Fill>
            </>,
          ]}
        />
        <P>
          Para dúvidas sobre um pedido específico, fale diretamente com a loja pelos canais de
          contato exibidos na própria vitrine (ver seção 05).
        </P>
      </>
    ),
  },
]

export default function TermosPage() {
  return (
    <LegalDoc
      eyebrow="Documento legal"
      title="Termos de Uso"
      summary="Regras de uso da plataforma Nexo para lojistas que criam e operam sua vitrine de e-commerce, e para quem compra nessas lojas."
      updatedAt="9 de agosto de 2026"
      sections={sections}
      related={{ href: '/privacidade', label: 'Política de Privacidade' }}
    />
  )
}
