import fs from 'node:fs';
import matter from 'gray-matter';

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'done' | 'failed' | 'needs_human';

export interface TaskFrontmatter {
  id: string;
  title: string;
  status: TaskStatus;
  assigned_to?: string;
  created_by?: string;
  session_id?: string;
  created_at: string;
  completed_at?: string;
  tokens_used?: number;
}

export interface TaskFile {
  frontmatter: TaskFrontmatter;
  body: string;
  filePath: string;
}

export function parseTaskFile(filePath: string): TaskFile {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: data as TaskFrontmatter,
    body: content.trim(),
    filePath,
  };
}

export function writeTaskFile(filePath: string, task: TaskFile): void {
  const content = matter.stringify('\n' + task.body + '\n', task.frontmatter);
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function createTaskContent(
  id: string,
  title: string,
  description: string,
  options?: { assigned_to?: string; created_by?: string }
): TaskFile {
  const status: TaskStatus = options?.assigned_to ? 'assigned' : 'pending';

  return {
    frontmatter: {
      id,
      title,
      status,
      assigned_to: options?.assigned_to,
      created_by: options?.created_by ?? 'user',
      created_at: new Date().toISOString(),
    },
    body: `# ${title}\n\n${description}\n\n## Agent Notes\n`,
    filePath: '', // Set by caller
  };
}
