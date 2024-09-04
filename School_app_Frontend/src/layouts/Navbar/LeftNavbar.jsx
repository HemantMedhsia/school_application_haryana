import aradhyaTechLogo from "../../assets/pngegg.png";
import { FaHome, FaUsers, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa"; // Import icons

const navigation = [
  { name: "Dashboard", href: "#", icon: FaHome, current: true },
  { name: "Team", href: "#", icon: FaUsers, current: false },
  { name: "Projects", href: "#", icon: FaProjectDiagram, current: false },
  { name: "Calendar", href: "#", icon: FaCalendarAlt, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LeftNavbar = () => {
  return (
    <div className="w-1/6 min-h-screen h-full bg-[#283046]">
      <div className="flex flex-col h-screen bg-[#283046] text-white">
        <div className="flex items-center justify-center h-16 bg-[#283046]">
          <img src={aradhyaTechLogo} alt="Logo" className="h-16 w-auto mt-2" />
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                "flex items-center px-4 py-2 rounded-md",
                item.current ? "bg-[#635bcc]" : "hover:bg-[#635bcc]"
              )}
            >
              <item.icon className="mr-2" /> {/* Add the icon here */}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LeftNavbar;
