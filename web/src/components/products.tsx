import { Navbar } from './navbar'
import { ProductCreate } from './product-create'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ProductEdit } from './product-edit'
import { ProductDelete } from './product-delete'
import { useAxios } from '../utils/request-axios'
import { useEffect, useState } from 'react'
import { format, toZonedTime } from 'date-fns-tz'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

function convertDateToTimeZone(date: string) {
  const utcDateString = date
  const timeZone = 'America/Sao_Paulo'
  let formattedDate: string

  try {
    const utcDate = new Date(utcDateString)
    const zonedDate = toZonedTime(utcDate, timeZone)
    formattedDate = format(zonedDate, 'dd/MM/yyyy - HH:mm', { timeZone })
  } catch (error) {
    formattedDate = 'Erro Data'
  }

  return formattedDate
}

export function Products() {
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

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/products')
        setProducts(response.data.data)
      } catch (error) {
        console.error('Erro ao carregar os produtos', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [axios, updated])

  console.log(products)

  const handleProductCreated = () => {
    setUpdated(prev => !prev) // Alterna o valor de 'updated' para forçar o useEffect
  }

  const handleProductUpdated = () => {
    setUpdated(prev => !prev) // Alterna o valor de 'updated' para forçar o useEffect
  }

  const handleProductDeleted = () => {
    setUpdated(prev => !prev) // Alterna o valor de 'updated' para forçar o useEffect
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <Navbar title="Produtos">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Estoque</h1>
            <div className="ml-auto flex items-center gap-8">
              <ProductCreate onProductCreated={handleProductCreated} />
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0" className="">
              <CardHeader>
                <CardTitle>Produtos</CardTitle>
                <CardDescription>
                  Aqui está seus produtos cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cód.</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Preço
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Qtd. Estoque
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Cadastrado-em
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id ?? ''}>
                        <TableCell className="font-medium">
                          {product.code}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.quantity > 0
                              ? 'Disponível'
                              : 'Indisponível'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          R$ {product.price}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {convertDateToTimeZone(product.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell ">
                          <div className="flex align-middle justify-center gap-1">
                            <ProductEdit
                              id={product.id}
                              onProductUpdated={handleProductUpdated}
                            />
                            <ProductDelete
                              id={product.id}
                              onProductDeleted={handleProductDeleted}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                {/* <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div> */}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Navbar>
  )
}
