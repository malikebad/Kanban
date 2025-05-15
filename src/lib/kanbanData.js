export const initialData = {
  columns: [
    { id: "column-1", title: "To Do", color: "#6366f1" },
    { id: "column-2", title: "In Progress", color: "#8b5cf6" },
    { id: "column-3", title: "Done", color: "#10b981" }
  ],
  cards: [
    { id: "card-1", columnId: "column-1", title: "Research competitors", description: "Analyze top 5 competitors and create a report", priority: "high", tags: ["research", "marketing"], assignedUsers: [], comments: [], attachments: [], videoLinks: [] },
    { id: "card-2", columnId: "column-1", title: "Design new landing page", description: "Create wireframes and mockups for the new homepage", priority: "medium", tags: ["design", "ui/ux"], assignedUsers: [], comments: [], attachments: [], videoLinks: [] },
    { id: "card-3", columnId: "column-2", title: "Implement authentication", description: "Add login and registration functionality", priority: "high", tags: ["development", "security"], assignedUsers: [], comments: [], attachments: [], videoLinks: [] },
  ],
  users: [
    { id: "user1", name: "Alice" },
    { id: "user2", name: "Bob" },
    { id: "user3", name: "Charlie" },
  ]
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem("kanbanBoard", JSON.stringify(data));
};

export const loadFromLocalStorage = () => {
  const savedData = localStorage.getItem("kanbanBoard");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    return {
      ...initialData,
      ...parsedData,
      cards: parsedData.cards ? parsedData.cards.map(card => ({
        ...card,
        assignedUsers: card.assignedUsers || [],
        comments: card.comments || [],
        attachments: card.attachments || [],
        videoLinks: card.videoLinks || [],
      })) : initialData.cards.map(card => ({...card, attachments: [], videoLinks: []})),
      users: parsedData.users || initialData.users,
    };
  }
  return initialData;
};

export const getRandomColor = () => {
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#0ea5e9", "#f59e0b"];
  return colors[Math.floor(Math.random() * colors.length)];
};