import type { TarotCardInterpretation } from "../../src/interpretation/tarot/types";
import { tarotCardImagePath } from "../../src/ui/tarotCardImage";

export function TarotCards({ cards }: { readonly cards: readonly TarotCardInterpretation[] }) {
  return <div className="cards" aria-live="polite">{cards.map((card, index) => <article className="tarot-card" aria-label={`${card.position.label}, ${card.cardName}`} key={`${card.cardId}-${index}`}>
    <div className="card-face">
      <img className={card.orientation === "reversed" ? "reversed" : undefined} src={tarotCardImagePath(card.cardId)} alt={`${card.cardName} ${card.orientation === "reversed" ? "역방향" : "정방향"} 타로 카드`}/>
      <small>{String(index + 1).padStart(2, "0")}</small>
      <em>{card.orientation === "reversed" ? "역방향" : "정방향"}</em>
    </div>
    <p className="position">{card.position.label}</p>
    <h3>{card.cardName}</h3>
    <p className="position-prompt">{card.position.prompt}</p>
    <p className="card-reading">{card.text}</p>
    <div className="tarot-keywords" aria-label="카드 핵심 단어">{card.keywords.map((word) => <span key={word}>#{word}</span>)}</div>
  </article>)}</div>;
}
