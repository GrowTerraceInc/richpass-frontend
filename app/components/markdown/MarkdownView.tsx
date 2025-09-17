"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownView.module.css";

type Props = {
  markdown: string;
  /** 段落が <strong>だけ</strong> または <strong>＋本文</strong> の場合に h2 + p として描画する */
  strongAsH2?: boolean;
};

/** ReactMarkdown の code 用に inline/className/children を明示した型 */
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** p レンダラの props 型（children を確実に持たせる） */
type ParaProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  children?: React.ReactNode;
  node?: unknown;
};

/** 先頭が <strong>…</strong> かを判定し、見出し部分と残り本文を返す */
function splitStrongPrefix(children: React.ReactNode): {
  heading: React.ReactNode | null;
  rest: React.ReactNode[];
} {
  const arr = React.Children.toArray(children);
  if (arr.length === 0) return { heading: null, rest: [] };

  const first = arr[0];
  if (
    React.isValidElement(first) &&
    typeof first.type === "string" &&
    first.type.toLowerCase() === "strong"
  ) {
    const heading = (first.props as { children?: React.ReactNode }).children ?? null;
    const rest = arr.slice(1);
    return { heading, rest };
  }
  return { heading: null, rest: [] };
}

/** ---- code レンダラ（命名しておくことで p レンダラ側で検出可能に） ---- */
function CodeBlock({ inline, className, children, ...rest }: CodeProps) {
  const isBlock = inline === false; // ← 明示 false のときだけブロック扱い
  if (isBlock) {
    return (
      <pre className={styles.pre}>
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    );
  }
  // それ以外（undefined / true）は常にインライン
  return (
    <code className={styles.code} {...rest}>
      {children}
    </code>
  );
}

/** 子にブロック要素（pre/table/hr/ul/ol/blockquote/details or CodeBlock( inline=false )）が含まれるか */
function hasBlockChild(children: React.ReactNode): boolean {
  const arr = React.Children.toArray(children);
  return arr.some((ch) => {
    if (!React.isValidElement(ch)) return false;

    // CodeBlock コンポーネントで inline=false の場合
    if (ch.type === CodeBlock && (ch.props as CodeProps).inline === false) return true;

    const t = ch.type;
    if (typeof t === "string") {
      if (
        t === "pre" ||
        t === "table" ||
        t === "hr" ||
        t === "ul" ||
        t === "ol" ||
        t === "blockquote" ||
        t === "details"
      ) {
        return true;
      }
    }
    // 子孫も調べる（any禁止のため props を局所型に）
    const props = ch.props as { children?: React.ReactNode } | undefined;
    return props?.children ? hasBlockChild(props.children) : false;
  });
}

/** 共通Markdownレンダラ（GFM対応） */
export default function MarkdownView({ markdown, strongAsH2 = false }: Props) {
  const components: Components = {
    h1: (props) => <h1 className={styles.h1} {...props} />,
    h2: (props) => <h2 className={styles.h2} {...props} />,
    h3: (props) => <h3 className={styles.h3} {...props} />,

    p: (pProps: ParaProps) => {
      const children = pProps.children;

      // 子にブロック要素が含まれる場合は <p> で包まない（<p><pre> を根絶）
      if (hasBlockChild(children)) {
        return <>{children}</>;
      }

      if (strongAsH2 && children) {
        const { heading, rest } = splitStrongPrefix(children);

        // <p><strong>見出し</strong></p> → 見出し化
        if (heading && rest.length === 0) {
          return <h2 className={styles.h2}>{heading}</h2>;
        }

        // <p><strong>見出し</strong> 本文…</p> → 見出し＋本文
        if (heading && rest.length > 0) {
          const restHasBlock = hasBlockChild(rest);
          return (
            <>
              <h2 className={styles.h2}>{heading}</h2>
              {restHasBlock ? <>{rest}</> : <p className={styles.p}>{rest}</p>}
            </>
          );
        }
      }

      return <p className={styles.p} {...pProps} />;
    },

    ul: (props) => <ul className={styles.ul} {...props} />,
    ol: (props) => <ol className={styles.ol} {...props} />,
    li: (props) => <li className={styles.li} {...props} />,
    a: (props) => (
      <a className={styles.a} target="_blank" rel="noreferrer" {...props} />
    ),
    hr: (props) => <hr className={styles.hr} {...props} />,
    blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,

    // ← 命名した CodeBlock を渡す（inline=false のときのみ <pre>）
    code: (props) => <CodeBlock {...(props as CodeProps)} />,
  };

  return (
    <div className={styles.mdRoot}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
