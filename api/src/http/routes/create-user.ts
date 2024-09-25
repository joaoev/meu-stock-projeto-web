import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createUser } from '../../functions/create-user';
import prisma from '../../db';

export const createUserRoute: FastifyPluginAsyncZod = async app => {
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
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(50, "Nome pode ter no máximo 50 caracteres"),
          store_name: z.string().min(2, "Nome da loja deve ter no mínimo 2 caracteres").max(50, "Nome da loja pode ter no máximo 50 caracteres"),
          email: z.string().email("E-mail inválido"),
          password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

      const { name, store_name, email, password } = request.body as {
        name: string,
        store_name: string,
        email: string,
        password: string;
      };

      await createUser({
        name, store_name, email, password,
      });

      reply.send({ success: true });
    }
  );

  // Rota para obter todos os usuários
app.get('/users', async (request, reply) => {
  await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }

  try {
    const users = await prisma.user.findMany();
    reply.send({ success: true, data: users });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ success: false, message: 'Erro ao obter usuários' });
  }
});

// Rota para obter um usuário por ID
app.get('/users/:id', async (request, reply) => {

  await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }
  const { id } = request.params as { id: string };

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      return reply.status(404).send({ success: false, message: 'Usuário não encontrado' });
    }

    reply.send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ success: false, message: 'Erro ao obter usuário' });
  }
});

app.put(
  '/users/:id',
  {
    schema: {
      body: z.object({
        name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(50, "Nome pode ter no máximo 50 caracteres"),
        store_name: z.string().min(2, "Nome da loja deve ter no mínimo 2 caracteres").max(50, "Nome da loja pode ter no máximo 50 caracteres"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional(),
      }),
    },
  },
  async (request, reply) => {
    await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }
    const { id } = request.params as { id: string };
    const { name, store_name, email, password } = request.body as 
    { name: string, store_name: string, email: string, password?: string };

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          store_name,
          email,
          password,
        },
      });

      reply.send({ success: true, data: updatedUser });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: 'Erro ao atualizar usuário' });
    }
  }
);

app.delete('/users/:id', async (request, reply) => {
  await request.jwtVerify()
      
      if (!request.user) {
        return reply.status(401).send({ success: false, message: 'Usuário não autenticado' });
      }
  const { id } = request.params as { id: string };

  try {
    await prisma.user.delete({ where: { id } });
    reply.send({ success: true });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ success: false, message: 'Erro ao deletar usuário' });
  }
});
};
