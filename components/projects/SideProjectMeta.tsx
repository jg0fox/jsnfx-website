import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SideProjectMetaProps {
  status: string;
  category: string;
  technologies: string[];
  className?: string;
}

const statusStyles: Record<string, string> = {
  Active: "bg-palm-leaf/10 text-palm-leaf-3",
  Complete: "bg-bronze-spice/10 text-bronze-spice",
  "In development": "bg-palm-leaf-2/10 text-palm-leaf-3",
  Archived: "bg-soft-linen-dark text-text-muted",
};

export function SideProjectMeta({
  status,
  category,
  technologies,
  className,
}: SideProjectMetaProps) {
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
            Status
          </dt>
          <dd className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 text-sm font-medium rounded-full ${
                statusStyles[status] || statusStyles["Active"]
              }`}
            >
              {status}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Category
          </dt>
          <dd className="mt-1 text-text-secondary">{category}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
            Technologies
          </dt>
          <dd className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Tag key={tech} size="sm">
                {tech}
              </Tag>
            ))}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
