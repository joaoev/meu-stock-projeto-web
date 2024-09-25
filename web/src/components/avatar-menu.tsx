import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { CircleUser } from 'lucide-react'

import { Button } from '@/components/ui/button'
export function AvatarMenu({ user }: { user: string }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-700">Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
