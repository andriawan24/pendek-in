'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

function CustomThemeProvider({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
