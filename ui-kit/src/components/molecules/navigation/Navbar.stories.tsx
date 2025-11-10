import type { Story } from "@ladle/react";
import { Navbar } from "./Navbar";
import { Button } from "@/atoms";

export const Default: Story = () => (
  <Navbar
    logo={<div className="text-xl font-bold">Logo</div>}
    navigation={
      <nav className="flex gap-4">
        <a href="#" className="hover:text-primary text-sm">
          Home
        </a>
        <a href="#" className="hover:text-primary text-sm">
          About
        </a>
        <a href="#" className="hover:text-primary text-sm">
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
        <div className="bg-primary h-8 w-8 rounded-full" />
        <span className="font-bold">Diffuse</span>
      </div>
    }
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="hover:text-primary text-sm font-medium">
          Markets
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
          Dashboard
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
          Docs
        </a>
      </nav>
    }
    wallet={<Button>Connect Wallet</Button>}
  />
);

export const WithActiveState: Story = () => (
  <Navbar
    logo={<div className="text-xl font-bold">DeFi App</div>}
    navigation={
      <nav className="flex gap-6">
        <a
          href="#"
          className="text-primary border-primary border-b-2 text-sm font-medium"
        >
          Lend
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
          Borrow
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
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
    logo={<div className="text-xl font-bold">App</div>}
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
        <a href="#" className="hover:text-primary flex items-center gap-2 text-sm">
          <span>📊</span> Dashboard
        </a>
        <a href="#" className="hover:text-primary flex items-center gap-2 text-sm">
          <span>💰</span> Markets
        </a>
        <a href="#" className="hover:text-primary flex items-center gap-2 text-sm">
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
    logo={<div className="text-xl font-bold">Platform</div>}
    navigation={
      <nav className="flex gap-6">
        <a href="#" className="hover:text-primary text-sm font-medium">
          Products ▾
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
          Solutions ▾
        </a>
        <a href="#" className="hover:text-primary text-sm font-medium">
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
