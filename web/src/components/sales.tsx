import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Navbar } from './navbar'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCreditCard,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import { faPix } from '@fortawesome/free-brands-svg-icons'
import { AddItemInSale } from './product-search'
import { useAxios } from '@/utils/request-axios'
import { useEffect, useState } from 'react'

export function Sales() {
  const pixIcon = (
    <FontAwesomeIcon
      className="w-6 h-6"
      icon={faPix}
      style={{ color: '#32bcad' }}
    />
  )
  const cardIcon = <FontAwesomeIcon className="w-6 h-6" icon={faCreditCard} />
  const moneyIcon = (
    <FontAwesomeIcon className="w-6 h-6" icon={faMoneyBillWave} />
  )

  const formSchema = z.object({
    discount_amount: z
      .number()
      .positive({ message: 'O valor unitário deve ser maior que 0' })
      .optional(),
    payment_method: z
      .string()
      .min(1, { message: 'O método de pagamento não pode estar vazio' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discount_amount: undefined,
      payment_method: 'money',
    },
  })

  const axios = useAxios()

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

  function getBrazilianTime() {
    const now = new Date()

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Para 24 horas
    }

    // Formata a data e hora
    return now.toLocaleString('pt-BR', options)
  }

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [desconto, setDesconto] = useState(0)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const currentTime = getBrazilianTime()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/products')
        setProducts(response.data.data)
      } catch (error) {
        console.error('Erro ao carregar os produtos', error)
      }
    }

    fetchProducts()
  }, [axios])

  const handleAddProduct = (product: Product) => {
    setSelectedProducts(prevSelected => [...prevSelected, product])
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const saleData = {
      items: selectedProducts.map((product, index) => ({
        order: index + 1,
        cod: product.code,
        name_product: product.name,
        unit_value: product.price,
        quantity: product.quantity,
        total: product.price * product.quantity,
      })),
      sub_total: subtotal,
      discounts: values.discount_amount ?? 0,
      total: subtotal - (values.discount_amount ?? 0),
      payment_method: values.payment_method,
    }
    console.log(saleData)

    try {
      // Enviar os dados do produto para a API
      const response = await axios.post('http://localhost:3333/sales', saleData)
      console.log('Venda Realizada com sucesso!:', response.data)
      form.reset()
      setSelectedProducts([])
      setDesconto(0)
      setSelectedValue(null)
      alert('Venda Realizada com sucesso!')
    } catch (error) {
      alert('Erro ao realizar venda!')
      console.error('Erro ao cadastrar o produto:', error)
    }
  }

  // biome-ignore lint/style/useConst: <explanation>
  let subtotal = selectedProducts.reduce((total, product) => {
    return total + product.quantity * product.price
  }, 0)

  const paymentMethodDisplay = (method: string | null) => {
    switch (method) {
      case 'money':
        return 'Dinheiro em espécie'
      case 'card':
        return 'Cartão de crédito'
      case 'pix':
        return 'PIX'
      default:
        return 'Nenhuma'
    }
  }

  return (
    <>
      <Navbar title="Painel">
        <div className="flex max-h-screen w-full flex-col">
          <main className="flex flex-1 flex-col gap-2 p-2 md:gap-2">
            <div className="grid gap-4 md:gap-2 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Itens Selecionados</CardTitle>
                    <CardDescription>
                      Adicione itens para concluir a venda.
                    </CardDescription>
                  </div>

                  <AddItemInSale
                    onAddProduct={handleAddProduct}
                    products={products}
                  />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Cód</TableHead>
                        <TableHead>Nome do produto</TableHead>
                        <TableHead>Valor Uni.</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={product.id ?? ''}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>R$ {product.price}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell className="text-right">
                            R$ {(product.quantity * product.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-05-chunk-4"
                >
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Detalhes da venda
                      </CardTitle>
                      <CardDescription>Data: {currentTime}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>R$ {subtotal.toFixed(2)}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Descontos
                          </span>
                          <span>R${desconto}</span>
                        </li>

                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>R$ {(subtotal - desconto).toFixed(2)}</span>
                        </li>
                      </ul>
                    </div>
                    <Separator className="my-4" />

                    <div className="grid gap-3">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="display grid gap-2"
                        >
                          <FormField
                            control={form.control}
                            name="payment_method"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Formas de pagamento</FormLabel>
                                <FormControl>
                                  <dl className="grid gap-3">
                                    <ToggleGroup
                                      size={'lg'}
                                      type="single"
                                      variant="outline"
                                      value={field.value} // valor selecionado
                                      onValueChange={value => {
                                        field.onChange(value) // atualiza o valor no form
                                        setSelectedValue(value) // atualiza o estado do valor selecionado (opcional)
                                      }}
                                    >
                                      <ToggleGroupItem
                                        value="card"
                                        aria-label="Toggle card"
                                      >
                                        {cardIcon}
                                      </ToggleGroupItem>
                                      <ToggleGroupItem
                                        value="money"
                                        aria-label="Toggle money"
                                      >
                                        {moneyIcon}
                                      </ToggleGroupItem>
                                      <ToggleGroupItem
                                        value="pix"
                                        aria-label="Toggle pix"
                                      >
                                        {pixIcon}
                                      </ToggleGroupItem>
                                    </ToggleGroup>
                                  </dl>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {paymentMethodDisplay(selectedValue)}
                          {/* Valor Unitário */}
                          <FormField
                            control={form.control}
                            name="discount_amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor do desconto</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="R$ 0,00"
                                    {...field}
                                    onChange={e => {
                                      const value = e.target.value
                                      // Se o campo estiver vazio, define como undefined
                                      field.onChange(
                                        value === ''
                                          ? undefined
                                          : Number.parseFloat(value)
                                      )
                                      setDesconto(
                                        value === ''
                                          ? 0
                                          : Number.parseFloat(value)
                                      )
                                    }}
                                    value={
                                      field.value === undefined
                                        ? ''
                                        : field.value
                                    } // Mostra vazio se o valor for undefined
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Finalizar Venda</Button>
                        </form>
                      </Form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </Navbar>
    </>
  )
}
