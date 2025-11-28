'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useProfileMapping } from '@/hooks/useProfileMapping'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Shield, ShoppingBag, Users } from 'lucide-react'

export function ProfileInfo() {
  const { user } = useAuth()
  const { PROFILE_IDS } = useProfileMapping()

  if (!user) return null

  const profileIcon = {
    [PROFILE_IDS.Administrador]: Shield,
    [PROFILE_IDS.Vendedor]: ShoppingBag,
    [PROFILE_IDS.Cliente]: Users,
  }

  const ProfileIcon = profileIcon[user.profile_id as keyof typeof profileIcon] || User

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Informações do Perfil
        </CardTitle>
        <ProfileIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Perfil:</strong> {user.profile}</p>
          <p><strong>ID do Perfil:</strong> {user.profile_id}</p>
          <p><strong>Primeiro Acesso:</strong> {user.first_access ? 'Sim' : 'Não'}</p>
          
          {/* Exemplo de uso do mapeamento */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Mapeamento de IDs:</p>
            <div className="text-xs space-y-1">
              <p>• Administrador: ID {PROFILE_IDS.Administrador}</p>
              <p>• Vendedor: ID {PROFILE_IDS.Vendedor}</p>
              <p>• Cliente: ID {PROFILE_IDS.Cliente}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
