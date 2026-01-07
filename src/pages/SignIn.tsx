import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Mail, Lock, Loader2 } from "lucide-react";

const SignIn = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
            });

            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <Leaf className="h-8 w-8" />
                        <span>Green Future Connect</span>
                    </Link>
                </div>

                {/* Sign In Card */}
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your email and password to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/reset-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    By signing in, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
