import { prisma } from "../prisma";

export async function getProducts({
  page = 1,
  name,
  minPrice,
  category,
}: {
  page?: number;
  name?: string;
  minPrice?: string;
  category?: string;
}) {
  const resultsPerPage = 5;
  const skip = (page - 1) * resultsPerPage;
  const filterCategory = category !== "all";
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        images: true,
        reviews: true,
      },
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
        ...(filterCategory && { category }),
        ...(minPrice && {
          price: {
            gte: parseInt(minPrice),
          },
        }),
      },
      skip,
      take: resultsPerPage,
    });

    const products = allProducts.map((product) => ({
      ...product,
      rating:
        Math.floor(
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
        ) || 0,
      image: product.images[0]?.url,
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
