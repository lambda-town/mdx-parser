import micro, { RequestHandler, text } from "micro";
import { parse as parseUrl } from "url";
import { parse as parseQueryString } from "querystring";
import { createMdxAstCompiler } from "@mdx-js/mdx";
import packageJson from "../package.json";

type Attribute = {};

interface Node {
  children?: Node[];
  type: "mdxBlockElement" | string;
  name?: string;
  attributes: Attribute[];
}

interface ParsedNode {
  type: "mdxBlockElement";
  name?: string;
  attributes: Attribute[];
}

const astCompiler = createMdxAstCompiler({
  rehypePlugins: [],
  remarkPlugins: [],
});

const findElements = async (ast: Node, filteredNames: string[]) => {
  const retrieveElements = (nodes: Node[] = []): ParsedNode[] =>
    nodes.reduce((acc, node) => {
      if (
        node.type === "mdxBlockElement" &&
        filteredNames.includes(node.name)
      ) {
        const parsedNode: ParsedNode = {
          type: "mdxBlockElement",
          name: node.name,
          attributes: node.attributes,
        };
        const parsedChildren =
          node.children && node.children.length
            ? retrieveElements(node.children)
            : [];
        return [...acc, parsedNode, ...parsedChildren];
      }
      return acc;
    }, []);

  return retrieveElements(ast.children);
};

const handler: RequestHandler = async (req) => {
  const url = parseUrl(req.url);
  const qs = parseQueryString(url.query);

  if (req.method === "POST") {
    const body = await text(req);
    // @ts-ignore
    const result: Node = astCompiler.parse(body);

    if (url.pathname === "/elements") {
      const { names } = qs;

      return findElements(result, typeof names === "string" ? [names] : names);
    }

    return result;
  }

  return `MDX Parser API v.${packageJson.version}`;
};

const server = micro(handler);

const port = process.env.PORT ? Number(process.env.PORT) : 4545;
console.log(`MDX Parser Starting on port ${port}`);
server.listen(port);
