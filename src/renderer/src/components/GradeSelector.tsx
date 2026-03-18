// GradeSelector.tsx – Grade selection screen component
import { useState, JSX } from 'react'

interface WordList {
  grade: number
  label: string
  words: string[]
}

interface GradeSelectorProps {
  wordLists: WordList[]
  onStart: (selectedGrade: number) => void
}

export default function GradeSelector({ wordLists, onStart }: GradeSelectorProps): JSX.Element {
  const [selectedGrade, setSelectedGrade] = useState(1)

  const handleStart = (): void => {
    onStart(selectedGrade)
  }

  return (
    <div className="app home">
      <div className="logo">📚</div>
      <h1>Spelling Star!</h1>
      <p className="subtitle">Practise your spelling and become a star!</p>
      <div className="grade-select">
        <p>Choose your level:</p>
        <div className="grade-buttons">
          {wordLists.map((wl) => (
            <button
              key={wl.grade}
              className={`grade-btn ${selectedGrade === wl.grade ? 'active' : ''}`}
              onClick={() => setSelectedGrade(wl.grade)}
            >
              {wl.label}
            </button>
          ))}
        </div>
      </div>
      <button className="start-btn" onClick={handleStart}>
        ▶ Start Quiz
      </button>
    </div>
  )
}
