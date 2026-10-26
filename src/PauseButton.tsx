type PauseButtonProps = {
  paused: boolean
  onClick: () => void
}

export default function PauseButton({ paused, onClick }: PauseButtonProps) {
  return (
    <button
      type="button"
      className="pause-button"
      aria-pressed={paused}
      onClick={onClick}
    >
      {paused ? 'Resume' : 'Pause'}
    </button>
  )
}
