import type { Story, StoryDefault } from "@ladle/react";

import { Button } from "@/atoms";

import { Navbar } from "./Navbar";

export default {
  title: "Molecules/Navigation/Navbar",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Navbar
    logo={<div className="text-xl font-bold">Logo</div>}
    navigation={
      <nav className="flex gap-4">
        <a className="hover:text-primary text-sm" href="#">
          Home
        </a>
        <a className="hover:text-primary text-sm" href="#">
          About
        </a>
        <a className="hover:text-primary text-sm" href="#">
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
        <a className="hover:text-primary text-sm font-medium" href="#">
          Markets
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
          Dashboard
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
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
          className="text-primary border-primary border-b-2 text-sm font-medium"
          href="#"
        >
          Lend
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
          Borrow
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
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
        <a className="hover:text-primary flex items-center gap-2 text-sm" href="#">
          <span>📊</span> Dashboard
        </a>
        <a className="hover:text-primary flex items-center gap-2 text-sm" href="#">
          <span>💰</span> Markets
        </a>
        <a className="hover:text-primary flex items-center gap-2 text-sm" href="#">
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
        <a className="hover:text-primary text-sm font-medium" href="#">
          Products ▾
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
          Solutions ▾
        </a>
        <a className="hover:text-primary text-sm font-medium" href="#">
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
