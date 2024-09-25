import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createProductRoute } from './routes/create-product'
import { createUserRoute } from './routes/create-user'
import { createSalesRoute } from './routes/create-sale'
import { fastifyJwt } from '@fastify/jwt'
import { loginRoute } from './routes/login'

import cors from '@fastify/cors';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
})

app.register(cors, {
  origin: true, 
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(loginRoute)
app.register(createProductRoute)
app.register(createUserRoute)
app.register(createSalesRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
