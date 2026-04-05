"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  label: string;
  value: string;
  onValueChange: (nextValue: string) => void;
  placeholder: string;
  autoComplete?: string;
  disabled?: boolean;
};

export function PasswordField({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  autoComplete,
  disabled = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className="pr-10"
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
          aria-label={isVisible ? "Hide password" : "Show password"}
          disabled={disabled}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
