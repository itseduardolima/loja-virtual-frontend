import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Retorna uma imagem de teste do Picsum para verificar se a API está funcionando
    const testImageUrl = `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`
    
    return NextResponse.json({ 
      imageUrl: testImageUrl,
      message: 'Imagem de teste carregada com sucesso'
    })
  } catch (error) {
    console.error('Erro na API de teste:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
