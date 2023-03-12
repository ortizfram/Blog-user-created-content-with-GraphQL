import styles from "../styles/Slug.modules.css"
import { GraphQLClient, gql } from 'graphql-request';


const graphcms = new GraphQLClient("https://api-sa-east-1.hygraph.com/v2/clf4izifj4o1a01t7f0c3e6m0/master");

// query specific post that the slug matches
const QUERY = gql`
query Post($slug: String!){
    post(where: {slug: $slug}){
        id,
        title,
        slug,
        datePublished,
        author {
            id,
            name,
            avatar {
                url
            }
        }
        content {
            html
        }
        coverPhoto {
            id,
            url
        }
    }
}
`;

const SLUGLIST = gql`
    {
        posts {
            slug
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
