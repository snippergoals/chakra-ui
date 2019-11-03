import { useTheme } from "../ThemeProvider";
import { useColorMode, Props } from "../ColorModeProvider";
import { get } from "styled-system";
import { Theme } from "../theme/theme";

interface StyleProps {
  theme: Theme;
  colorMode: Props["value"];
  focusBorderColor: string;
  errorBorderColor: string;
}

type VariantProps = StyleProps & { variant: string };

type InputStyleProps = VariantProps & {
  isFullWidth?: boolean;
  size: InputSizes;
};

const outlinedStyle = ({
  theme,
  colorMode,
  focusBorderColor,
  errorBorderColor,
}: StyleProps) => {
  const bg = { light: "white", dark: "whiteAlpha.100" };
  const borderColor = { light: "inherit", dark: "whiteAlpha.50" };
  const hoverColor = { light: "gray.300", dark: "whiteAlpha.200" };

  /**
   * styled-system's get takes 3 args
   * - object or array to read from
   * - key to get
   * - fallback value
   */
  const _focusBorderColor = get(
    theme.colors,
    focusBorderColor,
    focusBorderColor, // If color doesn't exist in theme, use it's raw value
  );
  const _errorBorderColor = get(
    theme.colors,
    errorBorderColor,
    errorBorderColor,
  );

  return {
    ...readOnly,
    border: "1px",
    borderColor: borderColor[colorMode],
    bg: bg[colorMode],
    _hover: {
      borderColor: hoverColor[colorMode],
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed",
    },
    _focus: {
      borderColor: _focusBorderColor,
      boxShadow: `0 0 0 1px ${_focusBorderColor}`,
    },
    _invalid: {
      borderColor: _errorBorderColor,
      boxShadow: `0 0 0 1px ${_errorBorderColor}`,
    },
  };
};

const readOnly = {
  _readOnly: {
    bg: "transparent",
    boxShadow: "none !important",
    userSelect: "all",
  },
};

const filledStyle = ({
  theme,
  focusBorderColor,
  errorBorderColor,
  colorMode,
}: StyleProps) => {
  const bg = { light: "gray.100", dark: "whiteAlpha.50" };
  const hoverColor = { light: "gray.200", dark: "whiteAlpha.100" };

  const _focusBorderColor = get(
    theme.colors,
    focusBorderColor,
    focusBorderColor,
  );
  const _errorBorderColor = get(
    theme.colors,
    errorBorderColor,
    errorBorderColor,
  );

  return {
    ...readOnly,
    border: "2px",
    borderColor: "transparent",
    bg: bg[colorMode],
    _hover: {
      bg: hoverColor[colorMode],
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed",
    },
    _focus: {
      bg: "transparent",
      borderColor: _focusBorderColor,
    },
    _invalid: {
      borderColor: _errorBorderColor,
    },
  };
};

const flushedStyle = ({
  theme,
  focusBorderColor,
  errorBorderColor,
}: StyleProps): any => {
  const _focusBorderColor = get(
    theme.colors,
    focusBorderColor,
    focusBorderColor,
  );
  const _errorBorderColor = get(
    theme.colors,
    errorBorderColor,
    errorBorderColor,
  );

  return {
    ...readOnly,
    borderBottom: "2px",
    borderColor: "inherit",
    rounded: 0,
    px: undefined,
    bg: "transparent",
    _focus: {
      borderColor: _focusBorderColor,
    },
    _invalid: {
      borderColor: _errorBorderColor,
    },
  };
};

const unstyledStyle = {
  bg: "transparent",
  px: undefined,
  height: undefined,
} as any;

const variantProps = (props: VariantProps) => {
  switch (props.variant) {
    case "flushed":
      return flushedStyle(props);
    case "unstyled":
      return unstyledStyle;
    case "filled":
      return filledStyle(props);
    case "outline":
      return outlinedStyle(props);
    default:
      return {};
  }
};

const baseProps = {
  display: "flex",
  alignItems: "center",
  position: "relative",
  transition: "all 0.2s",
  outline: "none",
};

export const inputSizes = {
  lg: {
    fontSize: "lg",
    px: 4,
    height: "12",
    lineHeight: "3rem",
    rounded: "md",
  },
  md: {
    fontSize: "md",
    px: 4,
    height: "10",
    lineHeight: "2.5rem",
    rounded: "md",
  },
  sm: {
    fontSize: "sm",
    px: 3,
    height: "8",
    lineHeight: "2rem",
    rounded: "sm",
  },
};

export type InputSizes = keyof typeof inputSizes;

const sizeProps = (props: InputStyleProps) =>
  inputSizes[props.size as InputSizes];

const useInputStyle = (props: any) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const _props = { ...props, theme, colorMode };

  return {
    width: props.isFullWidth ? "100%" : undefined,
    ...baseProps,
    ...sizeProps(_props),
    ...variantProps(_props),
    // pb: "1px"
  };
};

export default useInputStyle;
