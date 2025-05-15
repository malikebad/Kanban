import React from "react";
import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanCard from "@/components/KanbanCard";

const KanbanColumn = ({ 
  column, 
  cards, 
  activeCardId, 
  onAddCard, 
  onEditColumn, 
  onDeleteColumn,
  onOpenCardDetail,
  onDeleteCard
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="kanban-column"
      style={{ borderTop: `4px solid ${column.color}` }}
    >
      <div className="column-header">
        <div className="flex items-center gap-2">
          <h3 className="column-title">{column.title}</h3>
          <span className="card-count">{cards.length}</span>
        </div>
        <div className="relative group">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical size={16} />
          </Button>
          <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              onClick={onEditColumn}
            >
              <Edit size={14} />
              Edit Column
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              onClick={() => onDeleteColumn(column.id)}
            >
              <Trash2 size={14} />
              Delete Column
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] space-y-3 overflow-y-auto pr-1">
        {cards.map((card) => (
          <KanbanCard 
            key={card.id} 
            card={card} 
            isActive={card.id === activeCardId}
            onOpenDetail={() => onOpenCardDetail(card)}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>

      <button 
        className="add-card-button"
        onClick={onAddCard}
      >
        <Plus size={16} className="mr-1" />
        Add Card
      </button>
    </div>
  );
};

export default KanbanColumn;