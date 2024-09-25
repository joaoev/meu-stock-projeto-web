import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createProduct } from '../../functions/create-product';
import prisma from '../../db';
export const createProductRoute: FastifyPluginAsyncZod = async app => {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof z.ZodError) {
      const simplifiedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return reply.status(400).send({ success: false, errors: simplifiedErrors });
    }
    console.error(error);
    reply.status(500).send({ success: false, message: 'Internal Server Error' });
  });

  app.post(
    '/products',
    {
      schema: {
        body: z.object({
          cod: z.string().length(13, "Código deve ter exatamente 13 caracteres"),
          name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome pode ter no máximo 100 caracteres"),
          description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(255, "Descrição pode ter no máximo 255 caracteres"),
          price: z.number().positive("Preço deve ser positivo"),
          quantity: z.number().positive("Quantidade deve ser positiva").min(1, "Quantidade mínima é 1"),
          url_image: z.string().url("URL da imagem inválida").optional(),
        }),
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

      const { cod, name, description, price, quantity, url_image } = request.body as {
        cod: string,
        name: string,
        description: string,
        price: number,
        quantity: number,
        url_image?: string;
      };
      
      await createProduct({
        id_user: request.user.id,
        code: cod, name, description, price, quantity, url_image: url_image ?? '',
      });

      reply.send({ success: true });
    }
  );


  app.get('/products', async (request, reply) => {
    await request.jwtVerify()
  
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

    try {
      const products = await prisma.product.findMany({
        where: { id_user: request.user.id }, 
      });
      reply.send({ success: true, data: products });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao obter produtos' });
    }
  });
  
  // Rota para obter um produto por ID
  app.get('/products/:id', async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

    const { id } = request.params as { id: string };
    
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      
      if (!product) {
        return reply.status(404).send({ success: false, message: 'Produto não encontrado' });
      }
  
      reply.send({ success: true, data: product });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao obter produto' });
    }
  });

  app.put(
    '/products/:id',
    {
      schema: {
        body: z.object({
          cod: z.string().length(13, "Código deve ter exatamente 13 caracteres"),
          name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome pode ter no máximo 100 caracteres"),
          description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(255, "Descrição pode ter no máximo 255 caracteres"),
          price: z.number().positive("Preço deve ser positivo"),
          quantity: z.number().positive("Quantidade deve ser positiva").min(1, "Quantidade mínima é 1"),
          url_image: z.string().url("URL da imagem inválida").optional(),
        }),
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

      const { id } = request.params as { id: string };
      const { code, name, description, price, quantity, url_image } = request.body as {
        code: string,
        name: string,
        description: string,
        price: number,
        quantity: number,
        url_image?: string;
      };
  
      try {
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: { code, name, description, price, quantity, url_image: url_image ?? '' },
        });
  
        reply.send({ success: true, data: updatedProduct });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ success: false, message: 'Erro ao atualizar produto' });
      }
    }
  );

  app.delete('/products/:id', async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

    const { id } = request.params as { id: string };
    
    try {
      await prisma.product.delete({ where: { id } });
      reply.send({ success: true, message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao excluir produto' });
    }
  });
};
