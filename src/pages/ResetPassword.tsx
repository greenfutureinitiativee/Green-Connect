import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Mail, Loader2, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setSent(true);
            toast({
                title: "Check your email",
                description: "We've sent you a password reset link.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send reset email. Please try again.",
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

                {/* Reset Password Card */}
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription>
                            {sent
                                ? "Check your email for a password reset link"
                                : "Enter your email address and we'll send you a reset link"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sent ? (
                            <div className="space-y-4">
                                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 text-center">
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        We've sent a password reset link to <strong>{email}</strong>.
                                        Please check your inbox and spam folder.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setSent(false)}
                                >
                                    Send another email
                                </Button>
                                <Link to="/signin">
                                    <Button variant="ghost" className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
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

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>

                                <Link to="/signin">
                                    <Button variant="ghost" className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
