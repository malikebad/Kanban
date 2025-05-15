import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast.jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import KanbanColumn from "@/components/KanbanColumn";
import { useAuth } from "@/contexts/AuthContext";
import { initialData, loadFromLocalStorage, saveToLocalStorage } from "@/lib/kanbanData";
import { handleDragStartLogic, handleDragEndLogic } from "@/lib/dndHandlers";
import { addColumn, editColumn, deleteColumn } from "@/lib/columnActions";
import { 
  addCard, 
  saveCard, 
  deleteCard, 
  addTagToCard, 
  removeTagFromCard, 
  addCommentToCard, 
  assignUserToCard, 
  inviteUserToCard
} from "@/lib/cardActions";
import CardDetailModal from "@/components/CardDetailModal";

const KanbanBoard = () => {
  const [data, setData] = useState(() => loadFromLocalStorage());
  const [activeCard, setActiveCard] = useState(null);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    saveToLocalStorage(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => handleDragStartLogic(event, setActiveCard);
  const handleDragEnd = (event) => handleDragEndLogic(event, data, setData, setActiveCard, toast);

  const handleAddColumn = () => addColumn(newColumnTitle, setData, setNewColumnTitle, setIsAddingColumn, toast);
  const handleEditColumnSubmit = () => editColumn(editingColumn, setData, setIsEditingColumn, setEditingColumn, toast);
  const handleDeleteColumn = (columnId) => deleteColumn(columnId, setData, toast);

  const handleAddCard = (columnId) => {
    const newCard = addCard(columnId, setData, toast);
    setSelectedCard(newCard);
    setIsCardDetailOpen(true);
  };
  
  const handleSaveCard = (updatedCard) => {
    saveCard(updatedCard, setData, toast);
    setIsCardDetailOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId) => {
    deleteCard(cardId, setData, toast);
    if (selectedCard && selectedCard.id === cardId) {
      setIsCardDetailOpen(false);
      setSelectedCard(null);
    }
  };

  const handleOpenCardDetail = (card) => {
    setSelectedCard(card);
    setIsCardDetailOpen(true);
  };

  const handleAddTag = (cardId, tag) => addTagToCard(cardId, tag, setData, setSelectedCard);
  const handleRemoveTag = (cardId, tag) => removeTagFromCard(cardId, tag, setData, setSelectedCard);
  const handleAddComment = (cardId, commentText) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to comment.", variant: "destructive" });
      return;
    }
    addCommentToCard(cardId, commentText, user.username, setData, setSelectedCard, toast);
  };
  const handleAssignUser = (cardId, userId) => assignUserToCard(cardId, userId, setData, setSelectedCard, toast);
  const handleInviteUser = (cardId, email) => inviteUserToCard(cardId, email, setData, setSelectedCard, toast);


  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Kanban Board</h1>
          <p className="text-gray-600 dark:text-gray-300">Organize your tasks, {user?.username || 'Guest'}</p>
        </div>
        {user && (
          <Button variant="outline" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        )}
      </header>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 flex-grow">
          <AnimatePresence>
            {data.columns.map(column => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <KanbanColumn
                  column={column}
                  cards={data.cards.filter(card => card.columnId === column.id)}
                  activeCardId={activeCard}
                  onAddCard={() => handleAddCard(column.id)}
                  onEditColumn={() => { setEditingColumn(column); setIsEditingColumn(true); }}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                  onOpenCardDetail={handleOpenCardDetail}
                  onDeleteCard={handleDeleteCard}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0 w-[300px] h-16 flex items-center justify-center"
          >
            <Button
              variant="outline"
              className="w-full h-full border-dashed border-2 flex items-center justify-center gap-2 text-gray-500 hover:text-primary hover:border-primary"
              onClick={() => setIsAddingColumn(true)}
            >
              <Plus size={20} />
              <span>Add Column</span>
            </Button>
          </motion.div>
        </div>
      </DndContext>

      <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Column</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input placeholder="Column Title" value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} className="mb-4" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingColumn(false)}>Cancel</Button>
            <Button onClick={handleAddColumn}>Add Column</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Column</DialogTitle></DialogHeader>
          {editingColumn && (
            <div className="py-4">
              <Input placeholder="Column Title" value={editingColumn.title} onChange={(e) => setEditingColumn({ ...editingColumn, title: e.target.value })} className="mb-4" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: editingColumn.color }}></div>
                <Input type="color" value={editingColumn.color} onChange={(e) => setEditingColumn({ ...editingColumn, color: e.target.value })} className="w-20 h-10 p-1" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingColumn(false)}>Cancel</Button>
            <Button onClick={handleEditColumnSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedCard && (
        <CardDetailModal
          isOpen={isCardDetailOpen}
          onClose={() => { setIsCardDetailOpen(false); setSelectedCard(null); }}
          card={selectedCard}
          onSave={handleSaveCard}
          columns={data.columns}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onAddComment={handleAddComment}
          onAssignUser={handleAssignUser}
          onInviteUser={handleInviteUser}
          users={data.users || []}
          setData={setData}
          setSelectedCard={setSelectedCard}
        />
      )}
    </div>
  );
};

export default KanbanBoard;