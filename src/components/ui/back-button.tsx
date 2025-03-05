
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to: string;
  label?: string;
}

const BackButton = ({ to, label = "Back" }: BackButtonProps) => {
  return (
    <Link to={to}>
      <Button variant="ghost" className="pl-0 group transition-all duration-300 hover:translate-x-[-5px]">
        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
        {label}
      </Button>
    </Link>
  );
};

export default BackButton;
