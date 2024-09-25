import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Edit } from 'lucide-react'
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
import { useAxios } from '@/utils/request-axios'

const formSchema = z.object({
  cod: z
    .string()
    .length(13, { message: 'O código deve ter exatamente 13 dígitos' })
    .regex(/^\d+$/, {
      message: 'O código deve conter apenas dígitos numéricos',
    }),
  nome: z
    .string()
    .min(1, { message: 'O nome é obrigatório' })
    .max(100, { message: 'O nome não pode exceder 100 caracteres' }),
  descricao: z
    .string()
    .min(10, { message: 'A descrição deve ter no mínimo 10 letras.' })
    .max(255, { message: 'A descrição não pode exceder 255 caracteres' }),
  url_img: z.string().url({ message: 'URL da imagem inválida' }).optional(),
  qtd: z
    .number()
    .int()
    .nonnegative()
    .min(1, { message: 'A quantidade deve ser maior que 0' }),
  valor_unitario: z
    .number()
    .positive({ message: 'O valor unitário deve ser maior que 0' }),
})

export function ProductEdit({
  id,
  onProductUpdated,
}: { id: string; onProductUpdated: () => void }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cod: '',
      nome: '',
      descricao: '',
      qtd: undefined,
      valor_unitario: undefined,
    },
  })

  const axios = useAxios()

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/products/${id}`)

      console.log('Dados do produto:', response.data.data)

      const productData = {
        cod: response.data.data.code,
        name: response.data.data.name,
        description: response.data.data.description,
        quantity: response.data.data.quantity,
        price: response.data.data.price,
      }

      console.log(productData)

      console.log(productData.cod)
      form.setValue('cod', productData.cod)
      form.setValue('nome', productData.name)
      form.setValue('descricao', productData.description)
      form.setValue('qtd', productData.quantity)
      form.setValue('valor_unitario', productData.price)

      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar dados do produto:', error)
    }
  }

  // Carrega os dados do produto ao abrir o diálogo
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (open) {
      fetchProductData()
    } else {
      setIsLoading(true) // Reset loading state when dialog is closed
    }
  }, [open])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const product = {
        cod: values.cod,
        name: values.nome,
        description: values.descricao,
        price: values.valor_unitario,
        quantity: values.qtd,
      }

      const response = await axios.put(
        `http://localhost:3333/products/${id}`,
        product
      )
      console.log('Produto atualizado com sucesso:', response.data)
      form.reset()
      alert('Produto atualizado com sucesso!')
      setOpen(false)
      onProductUpdated()
    } catch (error) {
      alert('Erro ao atualizar o produto!')
      console.error('Erro ao atualizar o produto:', error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="h-8 gap-1 bg-sky-600 hover:bg-sky-500"
            onClick={() => setOpen(true)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Dados Produto: {id}</DialogTitle>
            <DialogDescription>
              Preencha os campos que deseja alterar e clique em Salvar.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <div className="grid gap-4 py-4">
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
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/\D/g, '')
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição */}
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Descrição do produto"
                            {...field}
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
                            placeholder="Quantidade em estoque"
                            {...field}
                            onChange={e => {
                              const value = e.target.value
                              field.onChange(
                                value === '' ? undefined : Number(value)
                              )
                            }}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Valor Unitário */}
                  <FormField
                    control={form.control}
                    name="valor_unitario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Unitário</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Valor unitário"
                            {...field}
                            onChange={e => {
                              const value = e.target.value
                              field.onChange(
                                value === ''
                                  ? undefined
                                  : Number.parseFloat(value)
                              )
                            }}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      className="bg-green-600 hover:bg-green-500"
                      type="submit"
                    >
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
