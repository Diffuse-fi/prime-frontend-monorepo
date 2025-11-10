import type { Story } from "@ladle/react";
import { Navbar } from "./Navbar";
import { Button } from "@/atoms";

export const Default: Story = () => (
  <Navbar
    logo={<div className="font-bold text-xl">Logo</div>}
    navigation={
      <nav className="flex gap-4">
        <a href="#" className="text-sm hover:text-primary">
          Home
        </a>
        <a href="#" className="text-sm hover:text-primary">
          About
        </a>
        <a href="#" className="text-sm hover:text-primary">
          Contact
        </a>
      </nav>
    }
    wallet={<Button size="sm">Connect</Button>}
  />
);

export const WithLogoImage: Story = () => (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full" />
        <span className="font-bold">Diffuse</span>
      </div>
    }
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="text-sm font-medium hover:text-primary">
          Markets
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Dashboard
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Docs
        </a>
      </nav>
    }
    wallet={<Button>Connect Wallet</Button>}
  />
);

export const WithActiveState: Story = () => (
  <Navbar
    logo={<div className="font-bold text-xl">DeFi App</div>}
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="text-sm font-medium text-primary border-b-2 border-primary">
          Lend
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Borrow
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Stake
        </a>
      </nav>
    }
    wallet={
      <div className="flex items-center gap-2">
        <span className="text-sm">0x1234...5678</span>
        <Button size="sm" variant="ghost">
          Disconnect
        </Button>
      </div>
    }
  />
);

export const Minimal: Story = () => (
  <Navbar
    logo={<div className="font-bold text-xl">App</div>}
    wallet={<Button size="sm">Sign In</Button>}
  />
);

export const WithIcons: Story = () => (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        <span className="font-bold">Crypto App</span>
      </div>
    }
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
          <span>📊</span> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
          <span>💰</span> Markets
        </a>
        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
          <span>⚙️</span> Settings
        </a>
      </nav>
    }
    wallet={
      <Button size="sm">
        <span>👛</span> Connect
      </Button>
    }
  />
);

export const WithDropdown: Story = () => (
  <Navbar
    logo={<div className="font-bold text-xl">Platform</div>}
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="text-sm font-medium hover:text-primary">
          Products ▾
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Solutions ▾
        </a>
        <a href="#" className="text-sm font-medium hover:text-primary">
          Resources
        </a>
      </nav>
    }
    wallet={
      <div className="flex gap-2">
        <Button size="sm" variant="ghost">
          Sign In
        </Button>
        <Button size="sm">Get Started</Button>
      </div>
    }
  />
);
