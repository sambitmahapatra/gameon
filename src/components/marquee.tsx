type MarqueeItem = { text: string; strong?: string; dot?: boolean };

/**
 * The ticker between hero and zones. The track holds the items twice and
 * translates -50%, which is what makes the loop seamless — change one copy
 * and you have to change both, so they are rendered from one array.
 *
 * Decorative: the whole strip is aria-hidden, and every figure in it appears
 * somewhere else on the page in real text.
 */
export function Marquee({ items }: { items: MarqueeItem[] }) {
  return (
    <section className="marquee above-grain" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) =>
          items.map((item, index) => (
            <span className="marquee__item" key={`${copy}-${index}`}>
              {item.dot ? <span className="marquee__dot" /> : null}
              {item.strong ? <b>{item.strong}</b> : null}
              {item.text}
            </span>
          )),
        )}
      </div>
    </section>
  );
}
