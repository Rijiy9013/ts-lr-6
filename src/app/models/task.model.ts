export interface Task {
    id?: string;
    type: 'bug' | 'task';
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: string;
    title: string;
    description: string;
    assignee: string;
    creator: string;
    createdAt: string;
    updatedAt: string;
  }