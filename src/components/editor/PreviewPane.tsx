"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";

interface PreviewPaneProps {
  content: string;
}

export function PreviewPane({ content }: PreviewPaneProps) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
