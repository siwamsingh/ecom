import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description || "Default description"} />
      <meta name="keywords" content={keywords || "books, online bookstore, best books, cbse books, icse books, neet books, jee, jee mains, jee advance, upsc, wbjee, productivity books"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || "Default description"} />
      <meta property="og:image" content={image || "/default-image.jpg"} />
      {/* put from the image directory */}
      <meta property="og:url" content={url || "/favicon.ico"} /> 
      {/* put the link of the particular page */}
      <link rel="canonical" href={url || "https://example.com"} />
    </Head>
  );
};

export default SEO;
