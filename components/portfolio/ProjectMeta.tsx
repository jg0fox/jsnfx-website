import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ProjectMetaProps {
  company: string;
  role: string;
  timeline: string;
  tools: string[];
  className?: string;
}

export function ProjectMeta({
  company,
  role,
  timeline,
  tools,
  className,
}: ProjectMetaProps) {
  return (
    <aside
      className={cn(
        "rounded-lg bg-soft-linen-light border border-soft-linen-dark p-6",
        className
      )}
    >
      <h3 className="font-display font-bold text-lg text-text-primary mb-4">
        Project details
      </h3>

      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Company
          </dt>
          <dd className="mt-1 text-text-primary font-medium">{company}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Role
          </dt>
          <dd className="mt-1 text-text-secondary">{role}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Timeline
          </dt>
          <dd className="mt-1 text-text-secondary">{timeline}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
            Tools & methods
          </dt>
          <dd className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Tag key={tool} size="sm">
                {tool}
              </Tag>
            ))}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
