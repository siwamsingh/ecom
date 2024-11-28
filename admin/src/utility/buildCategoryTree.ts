
type Category = {
  _id: number;
  category_name: string;
  parent_categorie_id: number | null;
  status: string;
  url_slug: string;
};


const buildCategoryTree = (categories: Category[] ) => {
  // Sort categories based on _id
  categories.sort((a, b) => a._id - b._id);

  const categoryMap = new Map<number, any>();
  const tree: Category[] = [];

  for (const category of categories) {
    // Add category to the map
    categoryMap.set(category._id, { ...category, children: [] });

    if (category.parent_categorie_id === null) {
      // Top-level category
      tree.push(categoryMap.get(category._id));
    } else {
      // Find parent and add category as a child
      const parent = categoryMap.get(category.parent_categorie_id);
      if (parent) {
        parent.children.push(categoryMap.get(category._id));
      }
    }
  }

  return tree;
};

export default buildCategoryTree