import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createSale } from '../../functions/create-sale';
import prisma from '../../db';

export const createSalesRoute: FastifyPluginAsyncZod = async app => {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof z.ZodError) {
      const simplifiedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      console.log(simplifiedErrors);
      return reply.status(400).send({ success: false, errors: simplifiedErrors });
    }
    console.error(error);
    reply.status(500).send({ success: false, message: 'Internal Server Error' });
  });

  app.post(
    '/sales',
    {
      schema: {
        body: z.object({
          items: z.array(z.object({
            order: z.number().positive("Ordem deve ser um número positivo"),
            cod: z.string().length(13, "Código do produto deve ter 13 caracteres"),
            name_product: z.string().min(2, "Nome do produto deve ter no mínimo 2 caracteres"),
            unit_value: z.number().positive("Valor unitário deve ser positivo"),
            quantity: z.number().positive("Quantidade deve ser um número positivo"),
            total: z.number().positive("Total deve ser positivo"),
          })).nonempty("A venda deve conter pelo menos um item"),
          sub_total: z.number().positive("Subtotal deve ser positivo"),
          discounts: z.number().min(0, "Descontos não podem ser negativos").optional(),
          total: z.number().positive("Total deve ser positivo"),
          payment_method: z.enum(['card', 'money', 'pix'])
            .refine(value => ['card', 'money', 'pix'].includes(value), {
              message: "Método de pagamento inválido"
            })
        }),
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
  
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

      const { items, sub_total, discounts, total, payment_method } = request.body as {
        items: Array<{
          order: number,
          cod: string,
          name_product: string,
          unit_value: number,
          quantity: number,
          total: number
        }>,
        sub_total: number,
        discounts?: number,
        total: number,
        payment_method: 'card' | 'money' | 'pix'
      };

      await createSale({
       id_user: request.user.id, items, sub_total, discounts, total, payment_method,
      });

      reply.send({ success: true });
    }
  );

  app.get('/sales', async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }
    try {
      const sales = await prisma.sale.findMany({
        where: { id_user: request.user.id },
        include: {
          Item: true, // Incluir os itens da venda
        },
      });
      reply.send({ success: true, data: sales });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao listar vendas' });
    }
  });

  app.get('/sales/:id', async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

    const { id } = request.params as { id: string };
  
    try {
      const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          Item: true, // Incluir os itens da venda
        },
      });
  
      if (!sale) {
        return reply.status(404).send({ success: false, message: 'Venda não encontrada' });
      }
  
      reply.send({ success: true, data: sale });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao buscar a venda' });
    }
  });

  app.delete('/sales/:id', async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }
      
    const { id } = request.params as { id: string };
  
    try {
      await prisma.item.deleteMany({
        where: { id_sale: id },
      });

      const sale = await prisma.sale.delete({
        where: { id },
      });
  
      reply.send({ success: true, message: 'Venda excluída com sucesso', data: sale });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao excluir a venda' });
    }
  });
};
