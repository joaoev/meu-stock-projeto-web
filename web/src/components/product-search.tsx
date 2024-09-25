import { Button } from './ui/button'
import { Plus, PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'

const formSchema = z.object({
  cod: z
    .string()
    .length(13, { message: 'O código deve ter exatamente 13 dígitos' })
    .regex(/^\d+$/, {
      message: 'O código deve conter apenas dígitos numéricos',
    }),
  qtd: z
    .number()
    .int()
    .nonnegative()
    .min(1, { message: 'A quantidade deve ser maior que 0' }),
})

interface Product {
  id: string
  code: string
  name: string
  description: string
  price: number
  quantity: number
  url_image: string
  createdAt: string
}

interface AddItemInSaleProps {
  products: Product[]
  onAddProduct: (product: Product) => void
}

export function AddItemInSale({ products, onAddProduct }: AddItemInSaleProps) {
  const [searchStatus, setSearchStatus] = useState('') // Estado para armazenar o status da pesquisa
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cod: '',
      qtd: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const product = products.find(p => p.code === values.cod) ?? null
    const quantityProduct = product?.quantity ?? 0

    if (!product) {
      alert('Produto não encontrado')
      return
    }

    if (values.qtd > quantityProduct) {
      alert('Quantidade indisponível')
      return
    }

    // Chama a função para adicionar o produto à lista no componente pai
    onAddProduct({ ...product, quantity: values.qtd }) // Passa a quantidade selecionada
    alert(`Produto ${product.name} adicionado com quantidade: ${values.qtd}`)
    // Reseta o formulário e os estados
    form.reset()

    setSearchStatus('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1">
          <PlusCircle className="h-4 w-4" />
          Adicionar Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesquisar item</DialogTitle>
          <DialogDescription>Procure um item pelo código</DialogDescription>
        </DialogHeader>
        <div className="h-full grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="display grid gap-2"
            >
              {/* Código */}
              <FormField
                control={form.control}
                name="cod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cód. do produto"
                        {...field}
                        maxLength={13}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onInput={e => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /\D/g,
                            ''
                          )
                          const product = products.find(
                            p => p.code === e.currentTarget.value
                          )
                          if (product) {
                            console.log(`Item - ${product.name}`)
                            setSearchStatus(
                              `Produto encontrado: ${product.name}`
                            ) // Produto encontrado
                          } else {
                            console.log('Produto não encontrado')
                            setSearchStatus('Produto não encontrado') // Produto não encontrado
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantidade */}
              <FormField
                control={form.control}
                name="qtd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantidade"
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(
                            value === '' ? undefined : Number(value)
                          ) // Mostra vazio se o valor for undefined
                        }}
                        value={field.value === undefined ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p>Item selecionado: {searchStatus}</p>
              <DialogFooter>
                <Button type="submit" size="sm" className="ml-4">
                  <Plus className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
