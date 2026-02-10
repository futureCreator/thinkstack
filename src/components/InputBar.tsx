interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  pinned: boolean;
  togglePin: () => void;
  onFocus: () => void;
}

export function InputBar({
  input,
  setInput,
  onKeyDown,
  inputRef,
  pinned,
  togglePin,
  onFocus,
}: InputBarProps) {
  return (
    <div className="input-bar">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Type and press Enter..."
      />
      <button
        className={`pin-btn ${pinned ? "active" : ""}`}
        onClick={togglePin}
        title={pinned ? "Unpin (Ctrl+Shift+P)" : "Pin to top (Ctrl+Shift+P)"}
      >
        📌
      </button>
    </div>
  );
}
