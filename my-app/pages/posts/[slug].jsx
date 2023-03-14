import styles from "../../styles/Slug.module.css";
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

// have access to post URL
export async function getStaticPaths() {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

// request the query and return statics posts
export async function getStaticProps({ params }) {
  const slug = params.slug;
  const { data } = await graphcms.request(QUERY, { slug });
  console.log(data); // add this line to check the data object
  const post = data?.post;
  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function BlogPost({ post }) {
  return (
    <main className={styles.blog}>
      <img src={post.coverPhoto.url} className={styles.cover} alt="" />
      <div className={styles.title}>
        <img src={post.author.avatar.url} alt="" />
        <div className={styles.authtext}>
          <h6>By {post.author.name}</h6>
          <h6 className={styles.date}>{post.datePublished}</h6>
        </div>
      </div>
      <h2>{post.title}</h2>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
    </main>
  );
}
