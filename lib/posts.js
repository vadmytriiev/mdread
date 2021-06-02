import fs from "fs";
import path from "path";
import matter from "gray-matter";

//Finding directory named "posts" from the current working directory of Node.
const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)


    // Combine the data with the id
    return {
      id,
      ...matterResult
    }
  })
  // getMatchedLines(allPostsData, 'hello');
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
export function getMatchedLines(array, value) {
  // Get file names under /posts
  var result = [];
  for(var item of array){
    var result_line = '';
    var res = {id: item.id}
    var match_index = item.content.indexOf(value);
    
    if(match_index){
      var lines = item.content.split(/\r\n|\r|\n/g);
      console.log(lines)
      lines = lines.filter(line => line.toLowerCase().includes(value))
      if(lines.length){
        res.content = lines[0];
      }else{
        res.content = '';
      }
      
    }
    // 
    console.log(res)
  }
  return result;
}
export const getSortedPosts = () => {
  //Reads all the files in the post directory
  const fileNames = fs.readdirSync(postDirectory);

  const allPostsData = fileNames.map((filename) => {
    //const slug = filename.replace(".mdx", "");
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postDirectory, filename);

    //Extracts contents of the MDX file
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = new Date(data.date).toLocaleDateString(
      "en-IN",
      options
    );

    const frontmatter = {
      ...data,
      date: formattedDate
    };
    return {
      slug,
      ...frontmatter
    };
  });
  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
};

//Get Slugs
export const getAllPostSlugs = () => {
  const fileNames = fs.readdirSync(postDirectory);

  return fileNames.map((filename) => {
    return {
      params: {
       // slug: filename.replace(".mdx", "")
        slug: filename.replace(".md", "")
      }
    };
  });
};

//Get Post based on Slug
export const getPostdata = async (slug) => {
  //const fullPath = path.join(postDirectory, `${slug}.mdx`);
  const fullPath = path.join(postDirectory, `${slug}.md`);
  const postContent = fs.readFileSync(fullPath, "utf8");

  return postContent;
};
