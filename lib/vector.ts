import { Index } from '@upstash/vector';

// Initialize Upstash Vector client
export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Simple vector creation function (creates a deterministic vector from text)
// In production, you should use OpenAI embeddings or similar
function createSimpleVector(text: string): number[] {
  const dimension = 1536; // Standard embedding dimension
  const vector = new Array(dimension).fill(0);
  
  // Create a simple hash-based vector
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = (charCode * i) % dimension;
    vector[index] += charCode / 1000;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

// Data types for vector storage
export interface ResumeItem {
  id: string;
  section: string;
  title: string;
  description: string;
  dateRange: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  githubLink: string;
  demoLink: string | null;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  [key: string]: any;
}

export interface AiMemory {
  id: string;
  topic: string;
  content: string;
  lastInteraction: string;
  [key: string]: any;
}

// Helper functions for vector database operations
export const vectorHelpers = {
  // Resume data operations
  async getResume(): Promise<ResumeItem[]> {
    try {
      // Use range to scan all vectors and filter for resume entries
      const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
      
      if (!allData || !allData.vectors || allData.vectors.length === 0) {
        return [];
      }
      
      const resumeItems = allData.vectors
        .filter(v => v && v.metadata && (v.metadata as any).section)
        .map(v => v!.metadata as ResumeItem)
        .sort((a, b) => a.order - b.order);
      
      return resumeItems;
    } catch (error) {
      console.error('Error fetching resume:', error);
      return [];
    }
  },

  async addResumeItem(item: Omit<ResumeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResumeItem> {
    const newItem = {
      ...item,
      id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ResumeItem;

    const text = `${newItem.section} ${newItem.title} ${newItem.description} ${newItem.dateRange}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: newItem.id,
      vector,
      metadata: newItem,
    });

    return newItem;
  },

  async updateResumeItem(id: string, updates: Partial<ResumeItem>): Promise<void> {
    const items = await this.getResume();
    const item = items.find(i => i.id === id);
    
    if (!item) {
      throw new Error(`Resume item ${id} not found`);
    }

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const text = `${updatedItem.section} ${updatedItem.title} ${updatedItem.description} ${updatedItem.dateRange}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: updatedItem.id,
      vector,
      metadata: updatedItem,
    });
  },

  async deleteResumeItem(id: string): Promise<void> {
    await vectorIndex.delete(id);
  },

  // Projects data operations
  async getProjects(): Promise<Project[]> {
    try {
      // Use range to scan all vectors and filter for project entries
      const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
      
      if (!allData || !allData.vectors || allData.vectors.length === 0) {
        return [];
      }
      
      const projects = allData.vectors
        .filter(v => v && v.metadata && (v.metadata as any).title && (v.metadata as any).techStack)
        .map(v => v!.metadata as Project)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject = {
      ...project,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Project;

    const text = `${newProject.title} ${newProject.description} ${newProject.techStack}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: newProject.id,
      vector,
      metadata: newProject,
    });

    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const projects = await this.getProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error(`Project ${id} not found`);
    }

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const text = `${updatedProject.title} ${updatedProject.description} ${updatedProject.techStack}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: updatedProject.id,
      vector,
      metadata: updatedProject,
    });
  },

  async deleteProject(id: string): Promise<void> {
    await vectorIndex.delete(id);
  },

  // Contact messages
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
      
      if (!allData || !allData.vectors || allData.vectors.length === 0) {
        return [];
      }
      
      const messages = allData.vectors
        .filter(v => v && v.metadata && (v.metadata as any).name && (v.metadata as any).email)
        .map(v => v!.metadata as ContactMessage)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return messages;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  },

  async addContactMessage(message: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const newMessage = {
      ...message,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    } as ContactMessage;

    const text = `contact message from ${newMessage.name} ${newMessage.email}: ${newMessage.message}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: newMessage.id,
      vector,
      metadata: newMessage,
    });

    return newMessage;
  },

  // AI Memory operations
  async getAiMemory(sessionId: string): Promise<AiMemory[]> {
    try {
      const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
      
      if (!allData || !allData.vectors || allData.vectors.length === 0) {
        return [];
      }
      
      const memories = allData.vectors
        .filter(v => v && v.metadata && (v.metadata as any).topic && (v.metadata as any).id?.includes(sessionId))
        .map(v => v!.metadata as AiMemory)
        .sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
      
      return memories;
    } catch (error) {
      console.error('Error fetching AI memory:', error);
      return [];
    }
  },

  async addAiMemory(sessionId: string, memory: { topic: string; content: string }): Promise<AiMemory> {
    const newMemory: AiMemory = {
      id: `memory-${sessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic: memory.topic,
      content: memory.content,
      lastInteraction: new Date().toISOString(),
    };

    const text = `ai memory session ${sessionId} topic ${newMemory.topic}: ${newMemory.content}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: newMemory.id,
      vector,
      metadata: newMemory,
    });

    return newMemory;
  },

  // Chat messages operations
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
      
      if (!allData || !allData.vectors || allData.vectors.length === 0) {
        return [];
      }
      
      const messages = allData.vectors
        .filter(v => v && v.metadata && (v.metadata as any).role && (v.metadata as any).id?.includes(sessionId))
        .map(v => v!.metadata as ChatMessage)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      return messages;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  },

  async addChatMessage(sessionId: string, message: { role: 'user' | 'assistant'; content: string }): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `chat-${sessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString(),
    };

    const text = `chat session ${sessionId} ${newMessage.role}: ${newMessage.content}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: newMessage.id,
      vector,
      metadata: newMessage,
    });

    return newMessage;
  },

  async clearChatMessages(sessionId: string): Promise<void> {
    const messages = await this.getChatMessages(sessionId);
    const deletePromises = messages.map(m => this.deleteChatMessage(m.id));
    await Promise.all(deletePromises);
  },

  async deleteChatMessage(id: string): Promise<void> {
    await vectorIndex.delete(id);
  },

  // Semantic search across all data
  async semanticSearch(query: string, topK: number = 10) {
    try {
      // Since our vector index doesn't have an embedding model configured,
      // we'll fetch all data and do keyword-based matching in memory
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
      
      // Fetch all data types
      const [resume, projects] = await Promise.all([
        this.getResume(),
        this.getProjects(),
      ]);
      
      // Combine all items with their searchable text
      const allItems = [
        ...resume.map(item => ({
          id: item.id,
          metadata: item,
          text: `${item.section} ${item.title} ${item.description} ${item.dateRange}`.toLowerCase(),
        })),
        ...projects.map(item => ({
          id: item.id,
          metadata: item,
          text: `${item.title} ${item.description} ${item.techStack}`.toLowerCase(),
        })),
      ];
      
      // Score each item based on keyword matches
      const scoredItems = allItems.map(item => {
        let score = 0;
        
        // Check for exact query match (highest score)
        if (item.text.includes(queryLower)) {
          score += 10;
        }
        
        // Check for individual word matches
        queryWords.forEach(word => {
          if (item.text.includes(word)) {
            score += 1;
          }
        });
        
        return {
          id: item.id,
          score,
          metadata: item.metadata,
        };
      });
      
      // Filter items with score > 0 and sort by score
      const results = scoredItems
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      
      return results;
    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  },
};
