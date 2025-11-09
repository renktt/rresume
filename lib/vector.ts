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
      const results = await vectorIndex.query({
        data: 'resume education experience skills certifications',
        topK: 100,
        includeMetadata: true,
      });
      
      if (!results || results.length === 0) {
        return [];
      }
      
      return results
        .map(r => r.metadata as ResumeItem)
        .sort((a, b) => a.order - b.order);
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
      const results = await vectorIndex.query({
        data: 'project application system website development software',
        topK: 100,
        includeMetadata: true,
      });
      
      if (!results || results.length === 0) {
        return [];
      }
      
      return results
        .map(r => r.metadata as Project)
        .filter(p => p.title) // Filter out non-project items
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      const results = await vectorIndex.query({
        data: 'contact message inquiry email',
        topK: 100,
        includeMetadata: true,
      });
      
      if (!results || results.length === 0) {
        return [];
      }
      
      return results
        .map(r => r.metadata as ContactMessage)
        .filter(m => m.name && m.email) // Filter contact messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      const results = await vectorIndex.query({
        data: `ai memory session ${sessionId}`,
        topK: 50,
        includeMetadata: true,
      });
      
      if (!results || results.length === 0) {
        return [];
      }
      
      return results
        .map(r => r.metadata as AiMemory)
        .filter(m => m.topic) // Filter AI memory items
        .sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
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
      const results = await vectorIndex.query({
        data: `chat messages session ${sessionId}`,
        topK: 100,
        includeMetadata: true,
      });
      
      if (!results || results.length === 0) {
        return [];
      }
      
      return results
        .map(r => r.metadata as ChatMessage)
        .filter(m => m.role) // Filter chat messages
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
      const results = await vectorIndex.query({
        data: query,
        topK,
        includeMetadata: true,
        includeData: true,
      });
      
      return results;
    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  },
};
