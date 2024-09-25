import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignUpPage() {
  return (
    <Card className="mx-auto max-w-sm mt-24">
      <CardHeader>
        <CardTitle className="text-xl">Cadastre-se</CardTitle>
        <CardDescription>
          Insira suas informações para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Primeiro nome</Label>
              <Input id="first-name" placeholder="João" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Sobrenome</Label>
              <Input id="last-name" placeholder="Alves" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite aqui sua senha"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500"
          >
            Criar conta
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Você já possui uma conta?{' '}
          <Link to="/home" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
