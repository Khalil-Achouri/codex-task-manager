export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: User | null;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  owner: User;
  members: User[];
  tasks: Task[];
}
