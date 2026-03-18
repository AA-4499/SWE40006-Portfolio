// src/App.tsx – Spelling Star: spelling practice app for primary school children
// Refactored to use multiple React components with external dependency (chart.js)
import { useState, JSX } from 'react'
import './App.css'

import GradeSelector from './components/GradeSelector'
import QuizGame from './components/QuizGame'
import ResultsScreen from './components/ResultsScreen'

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

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('home')
  const [words, setWords] = useState<string[]>([])
  const [finalScore, setFinalScore] = useState(0)

  const handleStartGame = (selectedGrade: number): void => {
    const list = WORD_LISTS.find((w) => w.grade === selectedGrade)!
    const picked = shuffle(list.words).slice(0, ROUNDS)
    setWords(picked)
    setScreen('playing')
  }

  const handleQuizComplete = (score: number): void => {
    setFinalScore(score)
    setScreen('results')
  }

  const handleRestart = (): void => {
    setScreen('home')
    setWords([])
    setFinalScore(0)
  }

  /* ──────────────────────────────────────────────────────────────── */
  /* Render based on current screen state, delegating to child components */
  /* ──────────────────────────────────────────────────────────────── */

  if (screen === 'home') {
    return <GradeSelector wordLists={WORD_LISTS} onStart={handleStartGame} />
  }

  if (screen === 'playing') {
    return <QuizGame words={words} onComplete={handleQuizComplete} />
  }

  if (screen === 'results') {
    return (
      <ResultsScreen
        score={finalScore}
        totalWords={words.length}
        onRestart={handleRestart}
      />
    )
  }

  return <div>Error: Invalid screen state</div>
}