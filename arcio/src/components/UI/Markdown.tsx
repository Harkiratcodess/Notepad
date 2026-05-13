import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

export function Markdown({ content, className = "" }: Props) {
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-xl font-black mb-2 border-b-2 border-arcio-border pb-1" {...props} />,
          h2: ({ ...props }) => <h2 className="text-lg font-bold mb-2 border-b-2 border-arcio-border/50" {...props} />,
          h3: ({ ...props }) => <h3 className="text-[16px] font-bold mb-1" {...props} />,
          p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
          li: ({ ...props }) => <li className="mb-0.5" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-arcio-accent bg-arcio-surface pl-3 py-1 my-2 italic" {...props} />
          ),
          code: ({ ...props }) => (
            <code className="bg-arcio-surface brutal-border px-1 font-code text-[12px]" {...props} />
          ),
          a: ({ ...props }) => <a className="text-arcio-accent underline hover:opacity-80" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
