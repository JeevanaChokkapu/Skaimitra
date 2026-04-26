type ToggleSwitchProps = {
  checked: boolean
  onChange: () => void
  label: string
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      className={`permissions-toggle ${checked ? 'is-on' : ''}`}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
    >
      <span className="permissions-toggle-thumb" />
    </button>
  )
}

export default ToggleSwitch
