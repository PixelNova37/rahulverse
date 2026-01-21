
export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export enum CorePillar {
  DISCOVER = 'DISCOVER',
  INVENT = 'INVENT',
  DESTROY = 'DESTROY'
}
