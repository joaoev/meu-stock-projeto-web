import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import imageIlustration from '../assets/stock-ilustration.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../contexts/auth'
import { Package2 } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:3333/login', {
        email,
        password,
      })

      const { token } = response.data
      login(token)

      navigate('/home')
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.')
    }
  }
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex content-center justify-center">
              <Package2 className="h-10 w-10 text-violet-600 mr-2" />
              <h1 className="text-3xl font-bold italic text-violet-600">
                MeuStock
              </h1>
            </div>

            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-balance text-muted-foreground">
              Insira seu e-mail abaixo para fazer login em sua conta
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500"
              >
                Entrar
              </Button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/sign-up" className="underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full p-36 flex justify-center align-middle bg-violet-100">
          <img
            src={imageIlustration}
            alt="background for login"
            className="w-96"
          />
        </div>
      </div>
    </div>
  )
}
