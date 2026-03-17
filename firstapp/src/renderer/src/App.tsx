// src/App.tsx – Spelling Star: spelling practice app for primary school children
import { useState, useEffect, useRef, JSX } from 'react'
import './App.css'

interface WordList {
  grade: number
  label: string
  words: string[]
}

const WORD_LISTS: WordList[] = [
  {
    grade: 1,
    label: 'Grade 1 – Easy',
    words: [
      'cat', 'dog', 'hat', 'run', 'big', 'red', 'sun', 'map', 'box', 'cup',
      'bed', 'sit', 'hop', 'fan', 'leg', 'win', 'net', 'bug', 'top', 'kit'
    ]
  },
  {
    grade: 2,
    label: 'Grade 2 – Medium',
    words: [
      'apple', 'bread', 'chair', 'drink', 'every', 'floor', 'green', 'house',
      'juice', 'knife', 'light', 'mouse', 'night', 'ocean', 'plant', 'queen',
      'river', 'storm', 'tiger', 'uncle'
    ]
  },
  {
    grade: 3,
    label: 'Grade 3 – Harder',
    words: [
      'animal', 'butter', 'castle', 'dinner', 'engine', 'finger', 'garden',
      'hammer', 'island', 'jungle', 'kitten', 'ladder', 'magnet', 'napkin',
      'oyster', 'pillow', 'rabbit', 'silver', 'tunnel', 'velvet'
    ]
  }
]

const ROUNDS = 10
type Screen = 'home' | 'playing' | 'results'

function speak(word: string): void {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(word)
  utter.rate = 0.85
  utter.pitch = 1.0
  window.speechSynthesis.speak(utter)
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedGrade, setSelectedGrade] = useState(1)
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-speak new word when it appears
  useEffect(() => {
    if (screen === 'playing' && words.length > 0 && feedback === null) {
      setTimeout(() => speak(words[currentIndex]), 400)
      inputRef.current?.focus()
    }
  }, [currentIndex, screen])

  const startGame = (): void => {
    const list = WORD_LISTS.find((w) => w.grade === selectedGrade)!
    const picked = shuffle(list.words).slice(0, ROUNDS)
    setWords(picked)
    setCurrentIndex(0)
    setScore(0)
    setInput('')
    setFeedback(null)
    setScreen('playing')
  }

  const submitAnswer = (): void => {
    if (!input.trim() || feedback !== null) return
    const correct = input.trim().toLowerCase() === words[currentIndex].toLowerCase()
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 1)
  }

  const nextWord = (): void => {
    if (currentIndex + 1 >= words.length) {
      setScreen('results')
    } else {
      setCurrentIndex((i) => i + 1)
      setInput('')
      setFeedback(null)
    }
  }

  const percent = words.length > 0 ? Math.round((score / words.length) * 100) : 0

  const gradeMessage = (): string => {
    if (percent === 100) return "🏆 Perfect score! You're a spelling champion!"
    if (percent >= 80) return '🌟 Amazing work! Almost perfect!'
    if (percent >= 60) return '👍 Good effort! Keep practising!'
    return '💪 Keep going! Practice makes perfect!'
  }

  /* ── Home Screen ── */
  if (screen === 'home') {
    return (
      <div className="app home">
        <div className="logo">📚</div>
        <h1>Spelling Star!</h1>
        <p className="subtitle">Practise your spelling and become a star!</p>
        <div className="grade-select">
          <p>Choose your level:</p>
          <div className="grade-buttons">
            {WORD_LISTS.map((wl) => (
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
        <button className="start-btn" onClick={startGame}>
          ▶ Start Quiz
        </button>
      </div>
    )
  }

  /* ── Results Screen ── */
  if (screen === 'results') {
    return (
      <div className="app results">
        <div className="logo">🎉</div>
        <h1>Quiz Complete!</h1>
        <div className="score-circle">
          <span className="score-big">
            {score}/{words.length}
          </span>
          <span className="score-pct">{percent}%</span>
        </div>
        <p className="grade-msg">{gradeMessage()}</p>
        <div className="result-actions">
          <button className="start-btn" onClick={startGame}>
            🔄 Try Again
          </button>
          <button className="home-btn" onClick={() => setScreen('home')}>
            🏠 Home
          </button>
        </div>
      </div>
    )
  }

  /* ── Playing Screen ── */
  const word = words[currentIndex]
  return (
    <div className="app playing">
      <div className="top-bar">
        <span className="progress">
          Word {currentIndex + 1} of {words.length}
        </span>
        <span className="score-display">⭐ {score}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentIndex / words.length) * 100}%` }}
        />
      </div>

      <div className="word-section">
        <p className="listen-label">Listen carefully, then spell the word:</p>
        <button className="listen-btn" onClick={() => speak(word)}>
          🔊 Listen Again
        </button>
      </div>

      {feedback === null ? (
        <div className="input-section">
          <input
            ref={inputRef}
            className="spell-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            placeholder="Type the word here..."
            autoFocus
          />
          <button className="submit-btn" onClick={submitAnswer}>
            ✅ Check
          </button>
        </div>
      ) : (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <>
              <div className="feedback-icon">✅</div>
              <p className="feedback-text">Correct! Well done!</p>
              <p className="correct-word">{word}</p>
            </>
          ) : (
            <>
              <div className="feedback-icon">❌</div>
              <p className="feedback-text">Not quite! The correct spelling is:</p>
              <p className="correct-word">{word}</p>
              <p className="your-answer">
                You typed: <em>{input}</em>
              </p>
            </>
          )}
          <button className="next-btn" onClick={nextWord}>
            {currentIndex + 1 >= words.length ? '🏁 See Results' : '➡ Next Word'}
          </button>
        </div>
      )}
    </div>
  )
}