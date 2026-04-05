"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";

interface PreviewPaneProps {
  content: string;
}

// 닫히지 않은 코드 펜스를 이스케이프 처리
function escapeUnclosedCodeFences(text: string): string {
  const lines = text.split("\n");
  let insideCodeBlock = false;
  let openIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) {
      if (!insideCodeBlock) {
        insideCodeBlock = true;
        openIndex = i;
      } else {
        insideCodeBlock = false;
        openIndex = -1;
      }
    }
  }

  // 닫히지 않은 코드 펜스가 있으면 백슬래시로 이스케이프
  if (insideCodeBlock && openIndex >= 0) {
    lines[openIndex] = lines[openIndex].replace(/^```/, "\\`\\`\\`");
    return lines.join("\n");
  }

  return text;
}

export function PreviewPane({ content }: PreviewPaneProps) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
        >
          {escapeUnclosedCodeFences(content)}
        </ReactMarkdown>
      </article>
    </div>
  );
}
