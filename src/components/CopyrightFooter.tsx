// src/components/CopyrightFooter.tsx
import React from "react";

const CURRENT_YEAR = new Date().getFullYear();

export const CopyrightFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-neutral-800 pt-6 pb-8 text-center text-xs text-neutral-400">
      <p>
        © {CURRENT_YEAR} Andrew Wolverton. "I Am The One" Multi-Store Commerce
        Engine. All rights reserved.
      </p>
    </footer>
  );
};
