import { GraphQLClient, gql } from 'graphql-request';
import BlogCard from "../components/BlogCard"


const graphcms = new GraphQLClient("https://api-sa-east-1.hygraph.com/v2/clf4izifj4o1a01t7f0c3e6m0/master");

const QUERY = gql`
{
  posts {
    title,
    coverPhoto {
      url 
    },
    content {
      html
    },
    datePublished,
    author {
      avatar {
        url
      },
      name
      
    }
    
  }
}
`;


// this is the fetch. API request then NextJS generates staticPages, already is generated when page is charged
export async function getStaticProps(){
  const { posts } = await graphcms.request(QUERY);
  return{
    props: {
      posts,
    },
    // when you visit website it gets updated every 10s
    revalidate: 10,
  };
}



export default function Home({posts}) {


  return (
    <>
     <main>
      {/* loop each post */}
      {posts.map((post) => (
        <BlogCard title={post.title} author={post.author} coverPhoto={post.coverPhoto} content={post.content}
         datePublished={post.datePublished} slug={post.slug} key={post.id} />
      ))}
     </main>
    </>
  );
};
