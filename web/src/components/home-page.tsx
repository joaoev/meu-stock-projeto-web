import { CreditCard, DollarSign, Package, Receipt } from 'lucide-react'

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
import { Navbar } from './navbar'
import { useEffect, useState } from 'react'
import { useAxios } from '@/utils/request-axios'
interface Item {
  id: string
  id_sale: string
  order: number
  cod: string
  name_product: string
  unit_value: number
  quantity: number
  total: number
  createdAt: string
}

interface Sale {
  id: string
  id_user: string
  sub_total: number
  discounts: number
  total: number
  payment_method: string
  createdAt: string
  Item: Item[]
}

export function HomePage() {
  const [vendas, setVendas] = useState<Sale[]>([])
  const [receita, setReceita] = useState(0)
  const [qtdProdutos, setQtdProdutos] = useState(0)
  const [qtdVendas, setQtdVendas] = useState(0)

  const axios = useAxios()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get('http://localhost:3333/products')

        console.log('Dados do produto:', response.data)

        const totalProducts = response.data.data.length
        setQtdProdutos(totalProducts)
      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error)
      }
    }

    const fetchSaleData = async () => {
      try {
        const response = await axios.get('http://localhost:3333/sales')

        console.log('Dados das vendas:', response.data.data)
        setVendas(response.data.data)
        const receitaDasVendas = response.data.data
        const totalVendas = response.data.data.length
        const totalArrecadado = receitaDasVendas.reduce(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (acc: any, venda: { total: any }) => acc + venda.total,
          0
        )

        totalArrecadado.toFixed(2)
        setQtdVendas(totalVendas)
        setReceita(totalArrecadado)
      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error)
      }
    }

    fetchProductData()
    fetchSaleData()
  }, [axios, qtdProdutos, qtdVendas])

  return (
    <>
      <Navbar title="Painel">
        <div className="flex max-h-screen w-full flex-col">
          <main className="flex flex-1 flex-col gap-2 p-2 md:gap-">
            <div className="grid gap-2 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Receita total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {receita}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de receita gerada
                  </p>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-01-chunk-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{qtdVendas}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de vendas realizadas
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Produtos
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{qtdProdutos}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de produtos no estoque
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="">
              <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Transações</CardTitle>
                    <CardDescription>
                      Transações recentes da sua loja.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Detalhe</TableHead>
                        <TableHead>Tipo</TableHead>

                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Quantia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendas.map(venda => (
                        <TableRow key={venda.id}>
                          <TableCell>
                            <div className="flex content-center">
                              <div className="flex items-center justify-center w-10 h-10 mr-4 bg-green-200 rounded-full">
                                {' '}
                                <Receipt color="#22c55e" />
                              </div>

                              <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                  {venda.payment_method}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Venda de produtos
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Venda</TableCell>

                          <TableCell className="">{venda.createdAt}</TableCell>
                          <TableCell className="text-right">
                            R$ {venda.total}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </Navbar>
    </>
  )
}
