import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const PasswordField = ({
  label,
  value,
  onChange,
  name,
  required = false,
  fullWidth = true,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      fullWidth={fullWidth}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
