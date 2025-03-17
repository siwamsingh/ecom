'use client'

import { Collection, SubCollection } from "@/components/types";

type Category = {
  _id: number;
  category_name: string;
  url_slug: string;
  parent_categorie_id: number | null;
  status: string;
};

export function buildCategoryTree(categories: any[]): Collection[] {
  // Filter out any inactive categories
  const activeCategories = categories.filter(cat => cat.status === 'active');
  
  // Create our three predefined collections
  const collections: Collection[] = [
    {
      id: "educational",
      name: "Educational",
      slug: "educational",
      children: []
    },
    {
      id: "fiction",
      name: "Fiction",
      slug: "fiction",
      children: []
    },
    {
      id: "others",
      name: "Others",
      slug: "others",
      children: []
    }
  ];

  // Find the Educational and Fiction parent categories
  const educationalParent = activeCategories.find(
    cat => cat.category_name.toLowerCase() === "educational"
  );
  
  const fictionParent = activeCategories.find(
    cat => cat.category_name.toLowerCase() === "fiction"
  );

  // Process all categories and assign to appropriate collection
  activeCategories.forEach(category => {
    // Skip parent categories themselves
    if (category._id === educationalParent?._id || category._id === fictionParent?._id) {
      return;
    }

    const subCollection: SubCollection = {
      id: category._id.toString(),
      name: category.category_name,
      slug: category.url_slug,
      types: []
    };

    // Determine which collection this category belongs to
    if (category.parent_categorie_id === educationalParent?._id) {
      // Add to Educational collection
      collections[0].children.push(subCollection);
    } else if (category.parent_categorie_id === fictionParent?._id) {
      // Add to Fiction collection
      collections[1].children.push(subCollection);
    } else {
      // If it's not a child of Educational or Fiction, add to Others
      // Only add categories that aren't parent categories themselves
      if (category.parent_categorie_id !== null || 
          (category.parent_categorie_id === null && 
           category.category_name.toLowerCase() !== "educational" && 
           category.category_name.toLowerCase() !== "fiction")) {
        collections[2].children.push(subCollection);
      }
    }
  });

  // Filter out any collections that have no children
  return collections.filter(collection => collection.children.length > 0);
}