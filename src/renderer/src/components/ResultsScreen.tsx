// ResultsScreen.tsx – Results screen with chart.js visualization
import { JSX } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

interface ResultsScreenProps {
  score: number
  totalWords: number
  onRestart: () => void
}

export default function ResultsScreen({ score, totalWords, onRestart }: ResultsScreenProps): JSX.Element {
  const percent = Math.round((score / totalWords) * 100)
  const incorrect = totalWords - score

  const gradeMessage = (): string => {
    if (percent === 100) return "🏆 Perfect score! You're a spelling champion!"
    if (percent >= 80) return '🌟 Amazing work! Almost perfect!'
    if (percent >= 60) return '👍 Good effort! Keep practising!'
    return '💪 Keep going! Practice makes perfect!'
  }

  // Chart data for results visualization
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [score, incorrect],
        backgroundColor: ['#4fd89a', '#ff6b6b'],
        borderColor: ['#2d9d6e', '#c02d38'],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: function (context: { label: string; parsed: number }): string {
            return `${context.label}: ${context.parsed}`
          }
        }
      }
    }
  }

  return (
    <div className="app results">
      <div className="logo">🎉</div>
      <h1>Quiz Complete!</h1>
      <div className="score-circle">
        <span className="score-big">
          {score}/{totalWords}
        </span>
        <span className="score-pct">{percent}%</span>
      </div>
      <p className="grade-msg">{gradeMessage()}</p>

      {/* Chart visualization */}
      <div className="chart-container">
        <div className="pie-chart">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      <button className="restart-btn" onClick={onRestart}>
        ↻ Try Again
      </button>
    </div>
  )
}
