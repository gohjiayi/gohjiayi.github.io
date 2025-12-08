import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Playfair Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  },
  colors: {
    brand: {
      50: "#ffe6ef",
      100: "#fbd0e0",
      200: "#f7bcd0",
      300: "#ee8fb0",
      400: "#e46290",
      500: "#c02559", // primary accent used across site
      600: "#a41f4c",
      700: "#87193f",
      800: "#6b1332",
      900: "#4f0d25",
    },
  },
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        bg: "#0f0f0f",
        color: "#EBEEEE",
      },
      '::selection': {
        background: 'brand.200',
        color: '#1f1f1f',
      },
      "a:hover": {
        color: "brand.300",
      },
    },
  },
  shadows: {
    glow: "0 0 20px rgba(255,255,255,0.35), 0 0 30px rgba(226, 0, 115, 0.25)",
    card: "0 8px 24px rgba(0,0,0,0.15)",
  },
  radii: {
    xl: '16px',
    pill: '9999px',
  },
  layerStyles: {
    card: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'gray.100',
      borderRadius: 'md',
      boxShadow: 'card',
      transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
      _hover: { transform: 'translateY(-4px)', borderColor: 'brand.500', boxShadow: '0 12px 28px rgba(0,0,0,0.18)' },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        pill: {
          borderRadius: 'pill',
          px: 5,
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.400' },
          _active: { bg: 'brand.600' },
        },
      },
    },
    Link: {
      baseStyle: { _hover: { color: 'brand.300', textDecoration: 'none' } },
      variants: {
        nav: {
          position: 'relative',
          _after: {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: '-6px',
            width: '100%',
            height: '1px',
            bg: 'currentColor',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
          },
          _hover: { _after: { transform: 'scaleX(1)' } },
        },
      },
    },
  },
});

export default theme;
