import { Button, Icon, IconType } from "@gitcoin/ui";
import { GitcoinLogo } from "@gitcoin/ui/logos";

import BuilderIcon from "./icons/BuilderIcon";
import Discord from "./icons/Discord";
import Gitbook from "./icons/Gitbook";
import Github from "./icons/Github";
import ManagerIcon from "./icons/ManagerIcon";

// Note: Footer Navigation items
const navigation = [
  // note: the Manager and Builder icons are white... so they are not visible on the white background of the footer
  {
    name: "Manager",
    href: "https://manager.gitcoin.co",
    testid: "support",
    icon: ManagerIcon,
  },
  {
    name: "Builder",
    href: "https://builder.gitcoin.co",
    testid: "support",
    icon: BuilderIcon,
  },
  {
    name: "Discord",
    href: "https://discord.gg/gitcoin",
    testid: "discord",
    icon: Discord,
  },
  {
    name: "GitHub",
    href: "https://github.com/gitcoinco",
    testid: "github",
    icon: Github,
  },
  {
    name: "Knowledge Base",
    href: "https://support.gitcoin.co/gitcoin-knowledge-base",
    testid: "knowledgebase",
    icon: Gitbook,
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto px-4 py-3 sm:px-6 lg:px-20 ">
      <div className="flex flex-row justify-between overflow-hidden py-6 items-center">
        <div className="flex flex-col items-center justify-start ">
          <div className="text-lg text-gray-900 font-medium">Powered by</div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">Gitcoin</div>
            <Icon type={IconType.GITCOIN} className="size-5" />
          </div>
        </div>
        <div className="flex justify-around space-x-4 md:order-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-500 hover:text-gray-500"
              data-testid={item.testid}
            >
              <span className="sr-only hidden">{item.name}</span>
              <item.icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
