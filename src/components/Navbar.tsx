
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, User, MessageSquare, HelpCircle, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" },
    { name: "About", path: "/about" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-xl shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tight relative z-10 flex items-center"
        >
          <span className="text-accent">Estate</span>
          <span>Luxe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`relative py-2 text-sm font-medium transition-all duration-300 
                    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full 
                    after:origin-bottom-right after:scale-x-0 after:bg-accent 
                    after:transition-transform after:duration-300 after:ease-in-out 
                    hover:after:origin-bottom-left hover:after:scale-x-100
                    ${location.pathname === item.path ? "text-accent after:scale-x-100" : ""}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 relative">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user?.profileImage || '/placeholder.svg'} />
                      <AvatarFallback>
                        {user?.walletAddress ? user.walletAddress.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <span className="block truncate w-48">
                      {user?.walletAddress ? 
                        `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : 
                        'My Account'}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/portfolio')}>
                    <User className="h-4 w-4 mr-2" /> My Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/support')}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Support
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/faq')}>
                    <HelpCircle className="h-4 w-4 mr-2" /> FAQ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-full transition-all">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full bg-accent text-white hover:bg-accent/90 transition-all">
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.profileImage || '/placeholder.svg'} />
                    <AvatarFallback>
                      {user?.walletAddress ? user.walletAddress.substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <button
            onClick={toggleMenu}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-accent/20 rounded-full"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-40 flex flex-col justify-center items-center transition-all duration-300 md:hidden ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col space-y-6 text-center">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`text-xl font-medium ${
                    location.pathname === item.path ? "text-accent" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-4 pt-4">
              {isAuthenticated ? (
                <Button onClick={handleLogout} className="w-full bg-accent hover:bg-accent/90">
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
