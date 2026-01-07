import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Truck, Recycle, Heart } from "lucide-react";

const Donate = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePickupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Pickup request scheduled successfully!", {
                description: "We'll contact you shortly to confirm the details.",
            });
            // Reset form logic would go here
        }, 1500);
    };

    const handleMonetaryDonate = () => {
        toast.success("Thank you for your support!", {
            description: "This is a demo. No actual payment was processed.",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background">
            {/* Hero Section */}
            <section className="bg-green-600 text-white py-20 px-4 md:px-6 relative overflow-hidden">
                <div className="container mx-auto relative z-10 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Turn Your Waste into Wealth
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-8">
                        Join the recycling revolution. Schedule a pickup or find a drop-off location to help build a cleaner, greener Nigeria.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Recycle className="h-5 w-5" />
                            <span>Plastic</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Recycle className="h-5 w-5" />
                            <span>Paper</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Recycle className="h-5 w-5" />
                            <span>Metal</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Recycle className="h-5 w-5" />
                            <span>E-Waste</span>
                        </div>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            <div className="container mx-auto py-12 px-4 md:px-6 -mt-10 relative z-20">
                <Tabs defaultValue="pickup" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 h-14 mb-8 shadow-md bg-background">
                        <TabsTrigger value="pickup" className="text-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-950/30 dark:data-[state=active]:text-green-400">
                            <Truck className="mr-2 h-5 w-5" />
                            Schedule Pickup
                        </TabsTrigger>
                        <TabsTrigger value="dropoff" className="text-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950/30 dark:data-[state=active]:text-blue-400">
                            <MapPin className="mr-2 h-5 w-5" />
                            Drop-off Locations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pickup">
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Schedule a Waste Pickup</CardTitle>
                                <CardDescription>
                                    We'll come to your doorstep to collect your recyclables. Minimum 5kg required.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePickupSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="Enter your name" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" placeholder="Enter your phone number" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Pickup Address</Label>
                                            <Input id="address" placeholder="Street address, LGA" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Preferred Date</Label>
                                            <Input id="date" type="date" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Waste Type</Label>
                                            <Select required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select waste type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mixed">Mixed Recyclables</SelectItem>
                                                    <SelectItem value="plastic">Plastic Bottles/Containers</SelectItem>
                                                    <SelectItem value="paper">Paper/Cardboard</SelectItem>
                                                    <SelectItem value="metal">Metal Cans/Scrap</SelectItem>
                                                    <SelectItem value="glass">Glass Bottles</SelectItem>
                                                    <SelectItem value="ewaste">Electronic Waste</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Estimated Quantity (kg)</Label>
                                            <Input id="quantity" type="number" min="5" placeholder="Min. 5kg" required />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <Button type="submit" className="w-full md:w-auto min-w-[200px]" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? "Scheduling..." : "Schedule Pickup"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dropoff">
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Find a Drop-off Center</CardTitle>
                                <CardDescription>
                                    Locate the nearest recycling hub to drop off your waste personally.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {[
                                        { name: "Green Hub Lagos", address: "12 Marina Road, Lagos Island", hours: "Mon-Sat, 8am - 6pm", distance: "2.5 km" },
                                        { name: "Abuja Recycling Center", address: "Plot 45 Wuse II, Abuja", hours: "Mon-Fri, 9am - 5pm", distance: "5.2 km" },
                                        { name: "Port Harcourt Eco-Point", address: "Old GRA, Port Harcourt", hours: "Mon-Sat, 8am - 5pm", distance: "8.1 km" },
                                    ].map((loc, i) => (
                                        <div key={i} className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full h-fit dark:bg-blue-900/30 dark:text-blue-400">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{loc.name}</h3>
                                                    <p className="text-muted-foreground">{loc.address}</p>
                                                    <p className="text-sm text-green-600 mt-1 font-medium">{loc.hours}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full dark:bg-slate-800 dark:text-slate-300">
                                                    {loc.distance}
                                                </span>
                                                <Button variant="link" className="block px-0 h-auto mt-2">
                                                    Get Directions
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Monetary Donation Section */}
                <section className="mt-20 max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
                        <Heart className="h-12 w-12 text-red-500 mx-auto mb-6 fill-current" />
                        <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Your financial contributions help us expand our reach, organize community clean-ups, and educate more citizens about sustainable living.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                            {["₦1,000", "₦5,000", "₦10,000", "Other"].map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    className="bg-transparent border-slate-600 text-white hover:bg-white hover:text-slate-900 hover:border-white transition-all"
                                    onClick={handleMonetaryDonate}
                                >
                                    {amount}
                                </Button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400">
                            Secure payment processing powered by Paystack.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Donate;
