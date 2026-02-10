import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { StackItem as StackItemType } from "../types";

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
        <span className="content">{item.text}</span>
      )}
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
