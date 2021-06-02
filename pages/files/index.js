/** @jsx jsx */
import { jsx, Flex, Heading, Box, Text } from "theme-ui";
import Link from "next/link";
import { getSortedPosts } from "../../lib/posts";


const BlogIndex = ({ allPostsData }) => {
  return (
    <>
      <Box sx={{ variant: "containers.page" }}>
        <Heading sx={{ fontWeight: 400 }}>Files</Heading>
        <Flex
          sx={{
            flexWrap: "wrap",
            mt: "2rem",
            direction: "column",
            
          }}
        >
          {allPostsData.map(({ slug, date, title, excerpt }) => (
            <Box variant="containers.postCard" sx={{ my: "0.5rem", backgroundColor: "#EBEBFF" }} key={slug}>
              <li
                sx={{
                  display: "flex",
                  flexDirection: ["column", "row"],
                  my: "1rem",
               
                }}
              >
                <Box>
                  <Link key={slug} href="/files/[slug]" as={`/files/${slug}`}>
                    <a>
                      <Heading
                        sx={{
                          fontSize: "calc(1.6rem + 0.2vw)",
                          fontWeight: "300",
                        
                        }}
                      >
                        {slug}.md
                      </Heading>
                    </a>
                  </Link>
                </Box>
              </li>
            </Box>
          ))}
        </Flex>
      </Box>
    </>
  );
};
export default BlogIndex;
export async function getStaticProps() {
  const allPostsData = getSortedPosts();
  return {
    props: {
      allPostsData,
    },
  };
}
