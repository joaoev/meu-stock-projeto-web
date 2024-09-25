import { Link } from 'react-router-dom'
import { Home, Menu, Package, Package2, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function ToggleMenu() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/home"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <div className="flex content-center justify-center">
                <Package2 className="h-8 w-8 text-violet-600 mr-2" />
                <h1 className="text-2xl font-bold italic text-violet-600">
                  MeuStock
                </h1>
              </div>
            </Link>
            <Link
              to="/home"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Painel
            </Link>
            <Link
              to="/sales"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Vendas
            </Link>
            <Link
              to="/products"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Produtos
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
