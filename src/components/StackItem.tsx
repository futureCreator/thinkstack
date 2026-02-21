import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { open } from "@tauri-apps/plugin-shell";
import type { StackItem as StackItemType } from "../types";
import { formatAge } from "../utils/timeAge";

interface StackItemProps {
  item: StackItemType;
  index: number;
  editingId: number | null;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  startEditing: (id: number) => void;
  saveEdit: (id: number, newText: string) => void;
  handleEditKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => void;
  deleteItem: (index: number) => void;
}

// URL 정규식 패턴 (capturing group 없음)
const URL_REGEX = /https?:\/\/[^\s]+/g;

/**
 * 텍스트에서 URL을 감지하여 클릭 가능한 링크로 렌더링
 * 일반 텍스트와 URL이 섞인 경우에도 정상 동작
 */
function renderTextWithLinks(text: string): React.ReactNode {
  if (!text) return text;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // 정규식 lastIndex 초기화
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    // 매치 이전의 텍스트가 있으면 추가
    if (match.index > lastIndex) {
      result.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    // URL 링크 추가
    const url = match[0];
    result.push(
      <a
        key={`link-${match.index}`}
        href={url}
        className="url-link"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          open(url);
        }}
        title={url}
      >
        {url}
      </a>
    );

    lastIndex = match.index + url.length;
  }

  // 남은 텍스트 추가
  if (lastIndex < text.length) {
    result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return result;
}

export function SortableItem({
  item,
  index,
  editingId,
  editInputRef,
  startEditing,
  saveEdit,
  handleEditKeyDown,
  deleteItem,
}: StackItemProps) {
  const [age, setAge] = useState(() => formatAge(item.createdAt));

  useEffect(() => {
    const timer = setInterval(() => setAge(formatAge(item.createdAt)), 60_000);
    return () => clearInterval(timer);
  }, [item.createdAt]);

  const isEditing = editingId === item.id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString(), disabled: isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`stack-item ${isEditing ? "editing" : ""} ${transform ? "sorting" : ""}`}
      onDoubleClick={() => startEditing(item.id)}
    >
      <span className="drag-handle" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="number">{index + 1}</span>
      {isEditing ? (
        <input
          ref={editInputRef}
          className="edit-input"
          defaultValue={item.text}
          onKeyDown={(e) => handleEditKeyDown(e, item.id)}
          onBlur={(e) => saveEdit(item.id, e.currentTarget.value)}
        />
      ) : (
        <span className="content">{renderTextWithLinks(item.text)}</span>
      )}
      <span className="age">{age}</span>
      <button
        className="delete-btn"
        onClick={() => deleteItem(index)}
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
