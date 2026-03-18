// QuizGame.tsx – Active quiz gameplay component
import { useState, useEffect, useRef, JSX, KeyboardEvent } from 'react'

interface QuizGameProps {
  words: string[]
  onComplete: (finalScore: number) => void
}

function speak(word: string): void {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(word)
  utter.rate = 0.85
  utter.pitch = 1.0
  window.speechSynthesis.speak(utter)
}

export default function QuizGame({ words, onComplete }: QuizGameProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-speak new word when it appears
  useEffect(() => {
    if (words.length > 0 && feedback === null) {
      setTimeout(() => speak(words[currentIndex]), 400)
      inputRef.current?.focus()
    }
  }, [currentIndex])

  const submitAnswer = (): void => {
    if (!input.trim() || feedback !== null) return
    const correct = input.trim().toLowerCase() === words[currentIndex].toLowerCase()
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 1)
  }

  const nextWord = (): void => {
    if (currentIndex + 1 >= words.length) {
      onComplete(score + (feedback === 'correct' ? 1 : 0))
    } else {
      setCurrentIndex((i) => i + 1)
      setInput('')
      setFeedback(null)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (feedback === null) {
        submitAnswer()
      } else {
        nextWord()
      }
    }
  }

  const isLast = currentIndex + 1 >= words.length

  return (
    <div className="app playing">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      <div className="quiz-container">
        <p className="progress-text">
          Word {currentIndex + 1} of {words.length}
        </p>

        <div className="word-display">
          <p className="current-word">Listen carefully and type what you hear</p>
          <button className="speak-btn" onClick={() => speak(words[currentIndex])}>
            🔊 Hear again
          </button>
        </div>

        <div className="answer-section">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={feedback !== null}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {feedback && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct' ? '✓ Correct!' : `✗ Wrong! It's "${words[currentIndex]}"`}
          </div>
        )}

        {feedback === null ? (
          <button className="submit-btn" onClick={submitAnswer}>
            Submit
          </button>
        ) : (
          <button className="next-btn" onClick={nextWord}>
            {isLast ? 'See Results' : 'Next Word'}
          </button>
        )}
      </div>
    </div>
  )
}
