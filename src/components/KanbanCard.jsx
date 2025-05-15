import React from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MoreVertical, Edit, Trash2, Tag, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const KanbanCard = ({ card, isActive, onOpenDetail, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const priorityVariant = {
    low: "success",
    medium: "warning",
    high: "destructive",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card priority-${card.priority} ${isActive ? 'dragging-card' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={onOpenDetail}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 dark:text-gray-100">{card.title}</h4>
        <div className="relative group">
          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1.5 -mt-1.5" onClick={(e) => e.stopPropagation()}>
            <MoreVertical size={14} />
          </Button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
            >
              <Edit size={14} />
              Details
            </button>
            <button 
              className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{card.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {card.tags && card.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            <Tag size={12} className="mr-1" />
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <Badge variant={priorityVariant[card.priority]} className="capitalize">
          {card.priority}
        </Badge>
        <div className="flex items-center gap-2">
          {card.assignedUsers && card.assignedUsers.length > 0 && (
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <div className="flex -space-x-2">
                {card.assignedUsers.slice(0, 2).map(userId => (
                  <Avatar key={userId} className="h-5 w-5 border-2 border-white dark:border-gray-700">
                    <AvatarFallback>{userId.substring(0,1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {card.assignedUsers.length > 2 && (
                  <Avatar className="h-5 w-5 border-2 border-white dark:border-gray-700">
                    <AvatarFallback>+{card.assignedUsers.length - 2}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          )}
          {card.comments && card.comments.length > 0 && (
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{card.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KanbanCard;