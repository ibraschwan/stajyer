export interface StajyerConfig {
  project: ProjectConfig;
  agents: Record<string, AgentConfig>;
  protected?: ProtectedPath[];
  rules?: Rules;
}

export interface ProjectConfig {
  name: string;
  description?: string;
}

export interface AgentConfig {
  adapter: 'claude-code' | 'codex' | 'custom';
  config?: AgentRuntimeConfig;
  role?: string;
  owns?: string[];
}

export interface AgentRuntimeConfig {
  model?: string;
  effort?: 'low' | 'medium' | 'high';
  max_turns?: number;
  command?: string; // For custom adapters
}

export interface ProtectedPath {
  path: string;
  requires: 'lead' | 'build-pass' | 'never';
}

export interface Rules {
  build_runner?: string;
  max_ci_rounds?: number;
  local_lint_on_save?: boolean;
  phantom_task_audit?: boolean;
  auto_assign?: boolean;
  require_build_on_complete?: boolean;
}
