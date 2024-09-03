import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LeftNavbar = () => {
  return (
    <div>
      <div className="flex flex-col h-screen bg-gray-800 text-white">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <img src="/path/to/logo.png" alt="Logo" className="h-8" />
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                "flex items-center px-4 py-2 rounded-md",
                item.current ? "bg-gray-700" : "hover:bg-gray-700"
              )}
            >
              <span className="mr-2">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LeftNavbar;
