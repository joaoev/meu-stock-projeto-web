import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Home, Package, Package2, ShoppingCart } from 'lucide-react'

import { ToggleMenu } from './toggle-menu'
import { AvatarMenu } from './avatar-menu'

interface NavbarProps {
  title: string
  children: ReactNode
}

export function Navbar({ title, children }: NavbarProps) {
  const titlePage = title
  console.log(titlePage)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/home" className="flex items-center gap-2 font-semibold">
              <div className="flex content-center justify-center">
                <Package2 className="h-8 w-8 text-violet-600 mr-2" />
                <h1 className="text-2xl font-bold italic text-violet-600">
                  MeuStock
                </h1>
              </div>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/home"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Painel
              </Link>
              <Link
                to="/sales"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Vendas
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-3 rounded-lg  px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Produtos{' '}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* menu lateral */}
          <ToggleMenu />
          <p className="font-semibold text-lg text-gray-800">Nome Loja</p>
          <div className="w-full flex-1" />

          <AvatarMenu user={'s'} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* Pagina Abaixo */}
          <div>{children}</div> {/* Aqui o conteúdo específico será inserido */}
        </main>
      </div>
    </div>
  )
}
