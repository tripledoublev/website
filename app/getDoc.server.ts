import fs from "fs";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import rehypeHighlight from "rehype-highlight";

export type MdxDoc = {
  title: string;
  description: string;
  code: string;
};

export default async function getDoc(
  section: string,
  slug: string,
): Promise<MdxDoc | undefined> {
  const docPath = path.resolve(`./docs/${section}/${slug}.mdx`);

  const docExists = fs.existsSync(docPath);

  if (!docExists) {
    return undefined;
  }

  const { default: remarkToc } = await import("remark-toc");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const mdxResult = await bundleMDX({
    file: docPath,
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.

      options.remarkPlugins = [
        [remarkToc, { tight: true }],
        ...(options.remarkPlugins ?? []),
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ];

      return options;
    },
  });

  if (mdxResult.errors.length > 0) {
    for (const err in mdxResult.errors) {
      console.error(err);
    }
  }

  console.log(mdxResult);

  return {
    title: mdxResult.frontmatter.meta.title,
    description: mdxResult.frontmatter.meta.description,
    code: mdxResult.code,
  };
}
