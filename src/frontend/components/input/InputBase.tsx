
  id?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  type?: "email" | "number" | "password" | "search" | "text" | "url";
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
};
