import styles from "../styles/Slug.module.css";
// importing dependencies
import { GraphQLClient, gql } from "graphql-request";

// API
const graphcms = new GraphQLClient(
  "https://api-sa-east-1.hygraph.com/v2/clf6r3qlm5z9n01t5061l3pnt/master"
);

// query specific post that slug matches
const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
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

// go to slug's post in each post, else 404
export async function getStaticPaths() {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

// request the query and return statics posts
export async function getStaticProps() {
  const { posts } = await graphcms.request(QUERY);
  return {
    props: {
      posts,
    },
    // regenerate static pages in case it gets updated
    revalidate: 10,
  };
}
