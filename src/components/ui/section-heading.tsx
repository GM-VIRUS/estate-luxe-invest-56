
import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  rightElement?: ReactNode;
}

const SectionHeading = ({ title, description, rightElement }: SectionHeadingProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      {rightElement && (
        <div className="flex items-center gap-2">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
