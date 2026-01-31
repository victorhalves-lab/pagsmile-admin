import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SimulatedActionButton({ 
  children, 
  actionLabel = "Ação executada com sucesso",
  variant = "default",
  size = "default",
  className,
  icon: Icon,
  onSimulatedAction
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleClick = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      toast.success(actionLabel + " (simulado)", {
        description: "Esta é uma demonstração da funcionalidade.",
      });
      
      if (onSimulatedAction) {
        onSimulatedAction();
      }

      setTimeout(() => setIsDone(false), 3000);
    }, 1500);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isProcessing || isDone}
    >
      {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {isDone && <Check className="w-4 h-4 mr-2" />}
      {!isProcessing && !isDone && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}