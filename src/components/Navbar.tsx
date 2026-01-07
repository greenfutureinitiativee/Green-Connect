import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, User, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Explore LGAs", path: "/explore" },
        { name: "Ministries", path: "/ministries" },
        { name: "News", path: "/news" },
        { name: "Donate Waste", path: "/donate" },
        { name: "Dashboard", path: "/dashboard" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
                isScrolled
                    ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b shadow-sm h-16"
                    : "bg-transparent h-20"
            )}
        >
            <div className="container h-full flex items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                        Green Future Connect
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "relative py-1 transition-colors hover:text-primary",
                                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full border-2 border-transparent hover:border-primary/20 hover:bg-primary/5">
                                        <User className="h-5 w-5 text-primary" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">My Account</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to="/profile">
                                        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                                    </Link>
                                    <Link to="/dashboard">
                                        <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600">
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link to="/signin">
                                    <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" variant="shine" className="rounded-full px-6 shadow-lg shadow-primary/20">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg animate-in slide-in-from-top-5 duration-300">
                    <div className="container py-4 px-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                                    isActive(link.path)
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-border my-2" />
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-3 px-4 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="py-3 px-4 rounded-lg text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 p-2">
                                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center">Sign In</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="shine" className="w-full justify-center">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
