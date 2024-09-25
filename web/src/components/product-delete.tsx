import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAxios } from '@/utils/request-axios'

export function ProductDelete({
  id,
  onProductDeleted,
}: { id: string; onProductDeleted: () => void }) {
  const axios = useAxios()
  const [open, setOpen] = useState(false)

  async function onClickDelete() {
    try {
      const result = await axios
        .delete(`http://localhost:3333/products/${id}`)
        .then(() => {
          alert('Produto deletado com sucesso')
          console.log('Produto deletado com sucesso')
          onProductDeleted()
          setOpen(false)
        })

      console.log(result)
    } catch (error) {
      alert('Erro ao deletar produto')
      console.error(error)
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="h-8 gap-1 bg-red-600 hover:bg-red-500"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Produto?</DialogTitle>
            <DialogDescription>
              Todos os dados do produto sera perdido.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            Tem certeza que deseja excluir o produto?
            <p>{id}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={onClickDelete}
              className="bg-red-600 hover:bg-red-500"
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
