import prisma from "../db"

interface CreateProductRequest {
  id_user: string,
        code: string,
          name: string,
          description:string,
          price: number,
          quantity: number,
          url_image: string,
}

export async function createProduct({
    id_user, code, name, description, price, quantity, url_image
}: CreateProductRequest) {
   
const result = await prisma.product.create({
  data: { id_user, code: code, name, description, price, quantity, url_image }
})
    
return result
}
