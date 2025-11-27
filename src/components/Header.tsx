import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-800 px-4 py-4">
      <h1 className="text-2xl font-bold">I AM THE ONE</h1>
      <p className="text-sm text-neutral-300">Multi-Store Commerce Engine</p>
      <p className="text-xs text-neutral-400">Catalog · Cart · Checkout</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
        <span>Cart · 0</span>
        <span>Store: Main · Dev · Sandbox</span>
        <span className="font-semibold">FRONT-END · FULLY OPERATIONAL</span>
      </div>

      {/* YOUR NAME + COPYRIGHT, VISIBLY STAMPED */}
      <div className="mt-2 text-xs text-neutral-500">
        Built by <span className="font-medium">Andrew Wolverton</span> ·{" "}
        <span>
          © 2025 Andrew Wolverton. "I Am The One" Multi-Store Commerce Engine.
          All rights reserved.
        </span>
      </div>
    </header>
  );
};
