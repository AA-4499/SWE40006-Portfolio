import { JSX, useMemo, useState } from 'react'

interface CustomListScreenProps {
  onBack: () => void
  onStartCustomQuiz: (words: string[]) => void
}

function parseWords(rawInput: string): string[] {
  return rawInput
    .split(/[\n,]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .filter((word, index, allWords) => allWords.indexOf(word) === index)
}

export default function CustomListScreen({ onBack, onStartCustomQuiz }: CustomListScreenProps): JSX.Element {
  const [rawInput, setRawInput] = useState('')

  const parsedWords = useMemo(() => parseWords(rawInput), [rawInput])
  const canStart = parsedWords.length >= 3

  const handleStart = (): void => {
    if (!canStart) return
    onStartCustomQuiz(parsedWords)
  }

  return (
    <div className="app custom-list">
      <div className="logo">📝</div>
      <h1>Create Custom List</h1>
      <p className="subtitle">Add at least 3 words. Use commas or new lines.</p>

      <div className="custom-list-form">
        <textarea
          className="custom-list-input"
          placeholder="Example: apple, banana, cherry"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
        />

        <p className="custom-list-hint">
          {canStart
            ? `${parsedWords.length} words ready`
            : `Add ${3 - parsedWords.length} more word${3 - parsedWords.length === 1 ? '' : 's'} to start`}
        </p>
      </div>

      <div className="result-actions">
        <button className="home-btn" type="button" onClick={onBack}>
          ← Back to Home
        </button>
        <button className="start-btn custom-list-btn" type="button" onClick={handleStart} disabled={!canStart}>
          ▶ Start Custom Quiz
        </button>
      </div>
    </div>
  )
}
