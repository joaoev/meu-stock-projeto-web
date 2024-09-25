import { Button } from './ui/button'

import { PlusCircle } from 'lucide-react'
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
import { useAxios } from '../utils/request-axios'
import { useState } from 'react'

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
    .min(10, { message: 'A descrição é deve ter no minimo 10 letras.' })
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

export function ProductCreate({
  onProductCreated,
}: { onProductCreated: () => void }) {
  const [open, setOpen] = useState(false)
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedPrice = Number(values.valor_unitario.toFixed(2))

    try {
      const product = {
        cod: values.cod,
        name: values.nome,
        description: values.descricao,
        price: formattedPrice,
        quantity: values.qtd,
      }
      // Enviar os dados do produto para a API
      const response = await axios.post(
        'http://localhost:3333/products',
        product
      )
      console.log('Produto cadastrado com sucesso:', response.data)
      form.reset()
      alert('Produto cadastrado com sucesso!')
      onProductCreated()
      setOpen(false)
    } catch (error) {
      alert(`Erro ao cadastrar! - ${typeof formattedPrice}`)
      console.error('Erro ao cadastrar o produto:', error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Produto
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Produto</DialogTitle>
            <DialogDescription>
              Preencha todos os campos e clique em cadastrar.
            </DialogDescription>
          </DialogHeader>
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
                          placeholder="Descrição do produto (opcional)"
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
                            // Se o campo estiver vazio, define como undefined para não mostrar "0"
                            field.onChange(
                              value === '' ? undefined : Number(value)
                            )
                          }}
                          value={field.value === undefined ? '' : field.value} // Mostra vazio se o valor for undefined
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
                            // Se o campo estiver vazio, define como undefined
                            field.onChange(
                              value === ''
                                ? undefined
                                : Number.parseFloat(value)
                            )
                          }}
                          value={field.value === undefined ? '' : field.value} // Mostra vazio se o valor for undefined
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
                    Cadastrar Produto
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
