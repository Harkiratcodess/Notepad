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
          h1: ({ ...props }) => (
            <h1 className="brutal-border mb-4 bg-arcio-accent px-2 py-1 text-xl font-black brutal-shadow" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="brutal-border mb-3 inline-block bg-arcio-accent-green/20 px-2 py-0.5 text-lg font-bold" {...props} />
          ),
          h3: ({ ...props }) => <h3 className="mb-2 text-[16px] font-extrabold underline decoration-2 underline-offset-4" {...props} />,
          p: ({ ...props }) => <p className="mb-3 leading-relaxed text-arcio-text" {...props} />,
          ul: ({ ...props }) => <ul className="mb-3 list-disc list-inside space-y-1 ml-1" {...props} />,
          ol: ({ ...props }) => <ol className="mb-3 list-decimal list-inside space-y-1 ml-1" {...props} />,
          li: ({ ...props }) => <li className="font-ui text-[13px]" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="brutal-border my-4 border-l-8 bg-arcio-surface p-3 italic brutal-shadow" {...props} />
          ),
          code: ({ ...props }) => (
            <code className="brutal-border rounded-sm bg-arcio-bg px-1.5 py-0.5 font-code text-[11px] font-bold text-arcio-accent" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="font-bold text-arcio-accent-green underline decoration-2 hover:bg-arcio-accent-green/10" {...props} />
          ),
          hr: () => <hr className="my-6 border-2 border-dashed border-arcio-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
