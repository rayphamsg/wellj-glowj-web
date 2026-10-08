import { Fragment } from "react";

type HeadlineProps = {
  headline: string;
  /** The last word, set in coral. */
  accent: string;
  /** Manual line breaks per breakpoint. Each set joined with spaces equals `headline`. */
  lines: { wide: string[]; narrow: string[] };
};

/** Indexes of the words after which a line ends (the last word never breaks). */
function breakAfter(lines: string[]): Set<number> {
  const set = new Set<number>();
  let count = 0;
  for (const line of lines.slice(0, -1)) {
    count += line.split(" ").length;
    set.add(count - 1);
  }
  return set;
}

/**
 * The headline: Be Vietnam Pro Bold, with the accent word in Fraunces Medium Italic, coral.
 * Set on manual line breaks: two lines from the desktop breakpoint,
 * the narrow arrangement below it. One heading in the DOM; the breaks are <br>s
 * shown per breakpoint, so assistive technology reads a single sentence.
 */
export function Headline({ headline, accent, lines }: HeadlineProps) {
  const words = headline.split(" ");
  const wide = breakAfter(lines.wide);
  const narrow = breakAfter(lines.narrow);

  return (
    <h1 className="headline">
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const w = word === accent ? <span className="headline-accent text-coral">{word}</span> : word;
        let separator: React.ReactNode = null;
        if (!isLast) {
          if (wide.has(i) && narrow.has(i)) separator = <br />;
          else if (narrow.has(i)) separator = (<><br className="lg:hidden" /><span className="hidden lg:inline"> </span></>);
          else if (wide.has(i)) separator = (<><span className="lg:hidden"> </span><br className="hidden lg:inline" /></>);
          else separator = " ";
        }
        return (
          <Fragment key={i}>
            {w}
            {separator}
          </Fragment>
        );
      })}
    </h1>
  );
}
