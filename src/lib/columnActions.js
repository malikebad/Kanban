import { getRandomColor } from './kanbanData';

export const addColumn = (newColumnTitle, setData, setNewColumnTitle, setIsAddingColumn, toast) => {
  if (!newColumnTitle.trim()) {
    toast({ title: "Error", description: "Column title cannot be empty", variant: "destructive", duration: 3000 });
    return;
  }
  const newColumn = { id: `column-${Date.now()}`, title: newColumnTitle, color: getRandomColor() };
  setData(prevData => ({ ...prevData, columns: [...prevData.columns, newColumn] }));
  setNewColumnTitle("");
  setIsAddingColumn(false);
  toast({ title: "Column added", description: `New column "${newColumnTitle}" has been added`, duration: 2000 });
};

export const editColumn = (editingColumn, setData, setIsEditingColumn, setEditingColumn, toast) => {
  if (!editingColumn || !editingColumn.title.trim()) {
    toast({ title: "Error", description: "Column title cannot be empty", variant: "destructive", duration: 3000 });
    return;
  }
  setData(prevData => ({
    ...prevData,
    columns: prevData.columns.map(column => column.id === editingColumn.id ? editingColumn : column)
  }));
  setIsEditingColumn(false);
  setEditingColumn(null);
  toast({ title: "Column updated", description: "Column has been updated successfully", duration: 2000 });
};

export const deleteColumn = (columnId, setData, toast) => {
  setData(prevData => ({
    columns: prevData.columns.filter(column => column.id !== columnId),
    cards: prevData.cards.filter(card => card.columnId !== columnId)
  }));
  toast({ title: "Column deleted", description: "Column and all its cards have been deleted", variant: "destructive", duration: 2000 });
};