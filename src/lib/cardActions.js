export const addCard = (columnId, setData, toast) => {
  const newCard = {
    id: `card-${Date.now()}`,
    columnId,
    title: "New Card",
    description: "Add description here",
    priority: "medium",
    tags: [],
    assignedUsers: [],
    comments: [],
    attachments: [],
    videoLinks: []
  };
  setData(prevData => ({ ...prevData, cards: [...prevData.cards, newCard] }));
  toast({ title: "Card added", description: "New card has been added. You can edit it now.", duration: 2000 });
  return newCard;
};

export const saveCard = (editingCard, setData, toast) => {
  if (!editingCard.title.trim()) {
    toast({ title: "Error", description: "Card title cannot be empty", variant: "destructive", duration: 3000 });
    return;
  }
  setData(prevData => ({
    ...prevData,
    cards: prevData.cards.map(card => card.id === editingCard.id ? editingCard : card)
  }));
  toast({ title: "Card updated", description: "Card has been updated successfully", duration: 2000 });
};

export const deleteCard = (cardId, setData, toast) => {
  setData(prevData => ({
    ...prevData,
    cards: prevData.cards.filter(card => card.id !== cardId)
  }));
  toast({ title: "Card deleted", description: "Card has been deleted", variant: "destructive", duration: 2000 });
};

export const addTagToCard = (cardId, tag, setData, setSelectedCard) => {
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        const newTags = card.tags.includes(tag) ? card.tags : [...card.tags, tag];
        return { ...card, tags: newTags };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
};

export const removeTagFromCard = (cardId, tagToRemove, setData, setSelectedCard) => {
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, tags: card.tags.filter(tag => tag !== tagToRemove) };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
};

export const addCommentToCard = (cardId, commentText, author, setData, setSelectedCard, toast) => {
  if (!commentText.trim()) {
    toast({ title: "Error", description: "Comment cannot be empty.", variant: "destructive" });
    return;
  }
  const newComment = { id: `comment-${Date.now()}`, text: commentText, author, timestamp: new Date().toISOString() };
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, comments: [...(card.comments || []), newComment] };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "Comment added", description: "Your comment has been posted." });
};

export const assignUserToCard = (cardId, userId, setData, setSelectedCard, toast) => {
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        const newAssignedUsers = card.assignedUsers?.includes(userId) 
          ? card.assignedUsers 
          : [...(card.assignedUsers || []), userId];
        return { ...card, assignedUsers: newAssignedUsers };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "User Assigned", description: `User assigned to card.` });
};

export const inviteUserToCard = (cardId, email, setData, setSelectedCard, toast) => {
  toast({ title: "Invitation Sent (Mock)", description: `Invitation sent to ${email} for this card.` });
};

export const addAttachmentToCard = (cardId, attachmentName, setData, setSelectedCard, toast) => {
  if (!attachmentName.trim()) {
    toast({ title: "Error", description: "Attachment name cannot be empty.", variant: "destructive" });
    return;
  }
  const newAttachment = { id: `attachment-${Date.now()}`, name: attachmentName, url: "#" }; // URL is placeholder
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, attachments: [...(card.attachments || []), newAttachment] };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "Attachment Added", description: `Attachment "${attachmentName}" added.` });
};

export const removeAttachmentFromCard = (cardId, attachmentId, setData, setSelectedCard, toast) => {
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, attachments: (card.attachments || []).filter(att => att.id !== attachmentId) };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "Attachment Removed", description: "Attachment has been removed." });
};

export const addVideoLinkToCard = (cardId, videoUrl, setData, setSelectedCard, toast) => {
  if (!videoUrl.trim()) {
    toast({ title: "Error", description: "Video URL cannot be empty.", variant: "destructive" });
    return;
  }
  try {
    new URL(videoUrl); 
  } catch (_) {
    toast({ title: "Error", description: "Invalid video URL.", variant: "destructive" });
    return;
  }
  const newVideoLink = { id: `video-${Date.now()}`, url: videoUrl, title: `Video ${ ( ( (prevData) => prevData.cards.find(c => c.id === cardId)?.videoLinks?.length || 0 ) (setData(prevData => prevData)) ) + 1}` };
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, videoLinks: [...(card.videoLinks || []), newVideoLink] };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "Video Link Added", description: "Video link has been added." });
};

export const removeVideoLinkFromCard = (cardId, videoId, setData, setSelectedCard, toast) => {
  setData(prevData => {
    const updatedCards = prevData.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, videoLinks: (card.videoLinks || []).filter(vid => vid.id !== videoId) };
      }
      return card;
    });
    if (setSelectedCard) {
      setSelectedCard(updatedCards.find(c => c.id === cardId));
    }
    return { ...prevData, cards: updatedCards };
  });
  toast({ title: "Video Link Removed", description: "Video link has been removed." });
};