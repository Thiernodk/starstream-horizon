import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick?: () => void;
}

const CategoryCard = ({ title, description, icon: Icon, gradient, onClick }: CategoryCardProps) => {
  return (
    <Button
      variant="card"
      onClick={onClick}
      className={`h-32 w-full p-6 flex flex-col items-start justify-between bg-gradient-to-br ${gradient} hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-white/60 ml-auto" />
      </div>
      
      <div className="text-left">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </Button>
  );
};

export default CategoryCard;