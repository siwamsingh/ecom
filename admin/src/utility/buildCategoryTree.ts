
type Category = {
  _id: number;
  category_name: string;
  parent_categorie_id: number | null;
  status: string;
  url_slug: string;
};

const cat: Category[] = [
  { _id: 1, category_name: "Root 1", parent_categorie_id: null, status: "active", url_slug: "root-1" },
  { _id: 2, category_name: "Root 2", parent_categorie_id: null, status: "active", url_slug: "root-2" },
  { _id: 3, category_name: "Child 1.1", parent_categorie_id: 1, status: "active", url_slug: "child-1-1" },
  { _id: 4, category_name: "Child 1.2", parent_categorie_id: 1, status: "active", url_slug: "child-1-2" },
  { _id: 5, category_name: "Child 2.1", parent_categorie_id: 2, status: "active", url_slug: "child-2-1" },
  { _id: 6, category_name: "Child 1.1.1", parent_categorie_id: 3, status: "active", url_slug: "child-1-1-1" },
  { _id: 7, category_name: "Child 1.1.2", parent_categorie_id: 3, status: "active", url_slug: "child-1-1-2" },
  { _id: 8, category_name: "Child 1.2.1", parent_categorie_id: 4, status: "active", url_slug: "child-1-2-1" },
  { _id: 9, category_name: "Child 1.2.2", parent_categorie_id: 4, status: "active", url_slug: "child-1-2-2" },
  { _id: 10, category_name: "Child 2.1.1", parent_categorie_id: 5, status: "active", url_slug: "child-2-1-1" },
  { _id: 11, category_name: "Child 2.1.2", parent_categorie_id: 5, status: "active", url_slug: "child-2-1-2" },
  { _id: 12, category_name: "Books", parent_categorie_id: null, status: "active", url_slug: "books" },
  { _id: 13, category_name: "Electronics", parent_categorie_id: null, status: "active", url_slug: "electronics" },
  { _id: 14, category_name: "Fiction", parent_categorie_id: 12, status: "active", url_slug: "fiction" },
  { _id: 15, category_name: "Non-Fiction", parent_categorie_id: 12, status: "active", url_slug: "non-fiction" },
  { _id: 16, category_name: "Smartphones", parent_categorie_id: 13, status: "active", url_slug: "smartphones" },
  { _id: 17, category_name: "Laptops", parent_categorie_id: 13, status: "active", url_slug: "laptops" },
  { _id: 18, category_name: "Sci-Fi", parent_categorie_id: 14, status: "active", url_slug: "sci-fi" },
  { _id: 19, category_name: "Fantasy", parent_categorie_id: 14, status: "active", url_slug: "fantasy" },
  { _id: 20, category_name: "Biography", parent_categorie_id: 15, status: "active", url_slug: "biography" },
];


const buildCategoryTree = (categories: Category[] = cat) => {
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