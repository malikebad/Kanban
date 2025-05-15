import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectOption } from "@/components/ui/select";
import { X, UserPlus, MessageSquare, Send, Paperclip, Users, Video, FileText, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { addAttachmentToCard, removeAttachmentFromCard, addVideoLinkToCard, removeVideoLinkFromCard } from "@/lib/cardActions";


const CardDetailModal = ({ 
  isOpen, 
  onClose, 
  card, 
  onSave, 
  columns, 
  onAddTag, 
  onRemoveTag, 
  onAddComment, 
  onAssignUser, 
  onInviteUser, 
  users,
  setData, 
  setSelectedCard
}) => {
  const [editedCard, setEditedCard] = useState(card);
  const [newTag, setNewTag] = useState("");
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  if (!card) return null;

  const handleChange = (field, value) => {
    setEditedCard(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !editedCard.tags.includes(newTag.trim().toLowerCase())) {
      onAddTag(editedCard.id, newTag.trim().toLowerCase());
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    onRemoveTag(editedCard.id, tagToRemove);
  };

  const handleCommentAdd = () => {
    if (newComment.trim()) {
      onAddComment(editedCard.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleUserAssign = () => {
    if (assignUserId) {
      onAssignUser(editedCard.id, assignUserId);
      setAssignUserId("");
    }
  };

  const handleUserInvite = () => {
    if (inviteEmail.trim()) {
      onInviteUser(editedCard.id, inviteEmail.trim());
      setInviteEmail("");
    }
  };

  const handleAttachmentAdd = () => {
    addAttachmentToCard(editedCard.id, newAttachmentName, setData, setSelectedCard, toast);
    setNewAttachmentName("");
  };
  
  const handleAttachmentRemove = (attachmentId) => {
    removeAttachmentFromCard(editedCard.id, attachmentId, setData, setSelectedCard, toast);
  };

  const handleVideoLinkAdd = () => {
    addVideoLinkToCard(editedCard.id, newVideoUrl, setData, setSelectedCard, toast);
    setNewVideoUrl("");
  };

  const handleVideoLinkRemove = (videoId) => {
    removeVideoLinkFromCard(editedCard.id, videoId, setData, setSelectedCard, toast);
  };


  const handleSave = () => {
    onSave(editedCard);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId;
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4 overflow-y-auto flex-grow pr-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input value={editedCard.title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea value={editedCard.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={editedCard.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                <SelectOption value="low">Low</SelectOption>
                <SelectOption value="medium">Medium</SelectOption>
                <SelectOption value="high">High</SelectOption>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Column</label>
              <Select value={editedCard.columnId} onChange={(e) => handleChange('columnId', e.target.value)}>
                {columns.map(col => <SelectOption key={col.id} value={col.id}>{col.title}</SelectOption>)}
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCard.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleTagRemove(tag)} className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5">
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
              />
              <Button onClick={handleTagAdd} variant="outline" size="sm">Add Tag</Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Assigned Users</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCard.assignedUsers?.map(userId => {
                const user = users.find(u => u.id === userId);
                return (
                  <Badge key={userId} variant="outline" className="flex items-center gap-1">
                    <Avatar className="h-4 w-4 mr-1">
                      <AvatarFallback>{user ? user.name.substring(0,1).toUpperCase() : '?'}</AvatarFallback>
                    </Avatar>
                    {user ? user.name : userId}
                  </Badge>
                );
              })}
            </div>
            <div className="flex gap-2 items-center">
              <Select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}>
                <SelectOption value="">Select user to assign</SelectOption>
                {users.filter(u => !editedCard.assignedUsers?.includes(u.id)).map(user => (
                  <SelectOption key={user.id} value={user.id}>{user.name}</SelectOption>
                ))}
              </Select>
              <Button onClick={handleUserAssign} variant="outline" size="sm" disabled={!assignUserId}>
                <Users size={16} className="mr-1"/> Assign
              </Button>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <Input placeholder="Invite user by email (mock)" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <Button onClick={handleUserInvite} variant="outline" size="sm" disabled={!inviteEmail.trim()}>
                <UserPlus size={16} className="mr-1"/> Invite
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Attachments</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCard.attachments?.map(att => (
                <Badge key={att.id} variant="outline" className="flex items-center gap-1">
                  <FileText size={12} className="mr-1" />
                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{att.name}</a>
                  <button onClick={() => handleAttachmentRemove(att.id)} className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5">
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Attachment name (mock)" value={newAttachmentName} onChange={(e) => setNewAttachmentName(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAttachmentAdd()}
              />
              <Button onClick={handleAttachmentAdd} variant="outline" size="sm" disabled={!newAttachmentName.trim()}>
                <Paperclip size={16} className="mr-1"/> Add File
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Video Links</label>
            <div className="space-y-2 mb-2">
              {editedCard.videoLinks?.map(video => {
                const embedUrl = getYouTubeEmbedUrl(video.url);
                return (
                  <div key={video.id} className="p-2 border rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1">
                        <LinkIcon size={12}/> {video.title || video.url}
                      </a>
                      <button onClick={() => handleVideoLinkRemove(video.id)} className="rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                    {embedUrl && (
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title={video.title || "YouTube video player"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded"
                        ></iframe>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input placeholder="YouTube Video URL" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleVideoLinkAdd()}
              />
              <Button onClick={handleVideoLinkAdd} variant="outline" size="sm" disabled={!newVideoUrl.trim()}>
                <Video size={16} className="mr-1"/> Add Video
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Comments & Chat</label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50 dark:bg-gray-700 mb-2">
              {editedCard.comments?.map(comment => (
                <div key={comment.id} className="text-xs p-2 rounded bg-white dark:bg-gray-600 shadow-sm">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold">{comment.author || 'Anonymous'}</span>
                    <span className="text-gray-500 dark:text-gray-400">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
              {(!editedCard.comments || editedCard.comments.length === 0) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">No comments yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder={currentUser ? "Add a comment..." : "Sign in to comment"} 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentAdd()}
                disabled={!currentUser}
              />
              <Button onClick={handleCommentAdd} variant="outline" size="sm" disabled={!newComment.trim() || !currentUser}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailModal;