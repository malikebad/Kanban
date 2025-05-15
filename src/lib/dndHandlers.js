export const handleDragStartLogic = (event, setActiveCard) => {
  const { active } = event;
  setActiveCard(active.id);
};

export const handleDragEndLogic = (event, data, setData, setActiveCard, toast) => {
  const { active, over } = event;
  
  if (!over) {
    setActiveCard(null);
    return;
  }

  const activeIsCard = active.id.startsWith("card-");
  const overIsColumn = over.id.startsWith("column-");
  const overIsCard = over.id.startsWith("card-");

  if (activeIsCard) {
    if (overIsColumn) {
      setData(prevData => {
        const updatedCards = prevData.cards.map(card => {
          if (card.id === active.id) {
            toast({
              title: "Card moved",
              description: `Card moved to ${prevData.columns.find(col => col.id === over.id)?.title}`,
              duration: 2000,
            });
            return { ...card, columnId: over.id };
          }
          return card;
        });
        return { ...prevData, cards: updatedCards };
      });
    } else if (overIsCard) {
      const activeCardData = data.cards.find(card => card.id === active.id);
      const overCardData = data.cards.find(card => card.id === over.id);
      
      if (activeCardData && overCardData) {
        if (activeCardData.columnId === overCardData.columnId) {
          setData(prevData => {
            const columnCards = prevData.cards.filter(card => card.columnId === overCardData.columnId);
            const otherCards = prevData.cards.filter(card => card.columnId !== overCardData.columnId);
            
            const activeIndex = columnCards.findIndex(card => card.id === active.id);
            const overIndex = columnCards.findIndex(card => card.id === over.id);
            
            const newColumnCards = [...columnCards];
            const [movedCard] = newColumnCards.splice(activeIndex, 1);
            newColumnCards.splice(overIndex, 0, movedCard);
            
            toast({ title: "Card reordered", description: "Card position updated", duration: 2000 });
            return { ...prevData, cards: [...otherCards, ...newColumnCards] };
          });
        } else {
          setData(prevData => {
            const updatedCards = prevData.cards.map(card => {
              if (card.id === active.id) {
                toast({
                  title: "Card moved",
                  description: `Card moved to ${prevData.columns.find(col => col.id === overCardData.columnId)?.title}`,
                  duration: 2000,
                });
                return { ...card, columnId: overCardData.columnId };
              }
              return card;
            });
            return { ...prevData, cards: updatedCards };
          });
        }
      }
    }
  }
  setActiveCard(null);
};