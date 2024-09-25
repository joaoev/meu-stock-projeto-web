import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import prisma from '../../db';
import bcrypt from 'bcryptjs';

export const loginRoute: FastifyPluginAsyncZod = async app => {
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
    '/login',
    {
      schema: {
        body: z.object({
          email: z.string().email("E-mail inválido"),
          password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(400).send({ success: false, message: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(400).send({ success: false, message: 'Senha incorreta' });
      }

      const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '1h' });

      reply.send({ success: true, token });
    }
  );
};
