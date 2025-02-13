"use server";

import { revalidateTag } from "next/cache";

import { prisma } from "@/lib/prisma";

interface CreateReviewInput {
  name: string;
  rating: number;
  content: string;
  productId: number;
}

export async function createReview(input: CreateReviewInput) {
  try {
    const newReview = await prisma.review.create({
      data: {
        name: input.name,
        content: input.content,
        rating: input.rating,
        product: {
          connect: {
            id: input.productId,
          },
        },
      },
    });
    revalidateTag("Product");
    return newReview;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
}
