import BrandedContentClient from "@/components/BrandedContentClient";
import type { Metadata } from "next";
import { dbConnect } from "@/lib/db";
import { BrandedCategory } from "@/models/BrandedCategory";
import { BrandedBrand } from "@/models/BrandedBrand";

export const metadata: Metadata = {
  title: "Branded Content | Cineplus Studio",
  description:
    "Empower your brand through organic integration. Explore how Cineplus Studio collaborates with global partners to weave impactful stories.",
  keywords: "Cineplus, branded content, sponsor, partner brands, partnership",
};

export default async function Page() {
  await dbConnect();

  // Fetch categories and brands on the server
  const categories = await BrandedCategory.find().lean();
  const brands = await BrandedBrand.find().lean();

  // Group brands dynamically under categories
  const groupedCategories = categories
    .map((cat: any) => {
      const catBrands = brands
        .filter((brand: any) => {
          const brandCatId =
            typeof brand.category === "object"
              ? brand.category?._id
              : brand.category;
          return brandCatId?.toString() === cat._id.toString();
        })
        .map((brand: any) => ({
          _id: brand._id.toString(),
          name: brand.name,
          logo: brand.logo,
          category:
            typeof brand.category === "object"
              ? {
                  _id: brand.category._id.toString(),
                  name: brand.category.name,
                }
              : brand.category.toString(),
        }));
      return {
        _id: cat._id.toString(),
        name: cat.name,
        brands: catBrands,
      };
    })
    .filter((g) => g.brands.length > 0);

  return <BrandedContentClient initialGroupedCategories={groupedCategories} />;
}
