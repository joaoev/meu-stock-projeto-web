import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Item {
  order: number;
  cod: string;
  name_product: string;
  unit_value: number;
  quantity: number;
  total: number;
}

interface CreateSaleRequest {
  id_user: string;
  items: Item[];
  sub_total: number;
  discounts?: number;
  total: number;
  payment_method: 'card' | 'money' | 'pix';
}

export async function createSale({

  id_user,
  items,
  sub_total,
  discounts,
  total,
  payment_method,
}: CreateSaleRequest) {
  return prisma.sale.create({
    data: {

      id_user,
      sub_total,
      discounts,
      total,
      payment_method,
      Item: {
        create: items.map(item => ({
          order: item.order,
          cod: item.cod,
          name_product: item.name_product,
          unit_value: item.unit_value,
          quantity: item.quantity,
          total: item.total,
        })),
      },
    },
  });
}
