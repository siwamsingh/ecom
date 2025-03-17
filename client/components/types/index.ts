export interface SubCollection {
    id: string;
    name: string;
    slug: string;
    types: string[]; // Types that this sub-collection belongs to
  }
  
  export interface Collection {
    id: string;
    name: string;
    slug: string;
    children: SubCollection[];
  }
  
  export type Collections = Collection[] | undefined;
  