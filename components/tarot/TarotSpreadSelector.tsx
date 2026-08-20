import {
  READING_TAROT_SPREADS,
  type ReadingTarotSpreadId,
} from "../../src/application/tarotFlow";

interface TarotSpreadSelectorProps {
  readonly value: ReadingTarotSpreadId;
  readonly onChange: (spread: ReadingTarotSpreadId) => void;
}

export function TarotSpreadSelector({ value, onChange }: TarotSpreadSelectorProps) {
  return <fieldset className="tarot-spread-selector">
    <legend>카드 수와 펼침 방식</legend>
    <div>
      {READING_TAROT_SPREADS.map((option) => <label key={option.id}>
        <input
          type="radio"
          name="tarotSpread"
          value={option.id}
          checked={value === option.id}
          onChange={() => onChange(option.id)}
        />
        <span className="tarot-spread-option">
          <small>{option.countLabel}</small>
          <strong>{option.title}</strong>
          <em>{option.description}</em>
          <i>{option.positionLabels.join(" · ")}</i>
        </span>
      </label>)}
    </div>
  </fieldset>;
}
