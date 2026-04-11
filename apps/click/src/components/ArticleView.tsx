/** @jsxImportSource hono/jsx */

type ArticleViewProps = {
  html: string;
};

export function ArticleView({ html }: ArticleViewProps) {
  return <section class="article-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
