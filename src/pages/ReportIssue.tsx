import { useState, useEffect } from "react";
import imageCompression from 'browser-image-compression';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FloatingCard } from "@/components/FloatingCard";
import { GlassPanel } from "@/components/GlassPanel";
import {
    Camera,
    MapPin,
    AlertTriangle,
    Trash2,
    Droplets,
    Construction,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Upload,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { aiService } from "@/lib/ai-service";
import { Loader2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

interface IssueFormData {
    category: string;
    title: string;
    description: string;
    priority: string;
    state: string;
    lga: string;
    ward: string;
    address: string;
    images: File[];
}

const ReportIssue = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [lgas, setLgas] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchLgas = async () => {
            const { data, error } = await supabase
                .from('lgas')
                .select('id, name')
                .order('name');

            if (error) {
                console.error('Error fetching LGAs:', error);
                toast({ title: "Error", description: "Failed to load LGAs", variant: "destructive" });
            } else {
                setLgas(data || []);
            }
        };
        fetchLgas();
    }, []);

    const [formData, setFormData] = useState<IssueFormData>({
        category: "",
        title: "",
        description: "",
        priority: "medium",
        state: "Lagos", // Default for now
        lga: "",
        ward: "",
        address: "",
        images: []
    });

    const categories = [
        { id: "waste", name: "Waste Pileup", icon: Trash2, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
        { id: "pollution", name: "Pollution", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { id: "infrastructure", name: "Infrastructure", icon: Construction, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
        { id: "hazard", name: "Safety Hazard", icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    ];

    const handleNext = () => {
        if (step === 1 && !formData.category) {
            toast({ title: "Select a category", description: "Please choose an issue category to proceed.", variant: "destructive" });
            return;
        }
        if (step === 2 && (!formData.title || !formData.description)) {
            toast({ title: "Missing details", description: "Please provide a title and description.", variant: "destructive" });
            return;
        }
        if (step === 3 && (!formData.lga || !formData.address)) {
            toast({ title: "Location required", description: "Please specify the location of the issue.", variant: "destructive" });
            return;
        }
        setStep((prev) => (prev + 1) as Step);
    };

    const handleBack = () => {
        setStep((prev) => (prev - 1) as Step);
    };



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const compressedFiles: File[] = [];

            for (const file of files) {
                try {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    };
                    const compressedFile = await imageCompression(file, options);
                    compressedFiles.push(compressedFile);
                } catch (error) {
                    console.error("Compression error:", error);
                    compressedFiles.push(file); // Fallback to original
                }
            }

            setFormData(prev => ({ ...prev, images: [...prev.images, ...compressedFiles] }));

            // AI Image Classification (using first image)
            if (compressedFiles.length > 0) {
                setAnalyzing(true);
                try {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(compressedFiles[0]);
                    img.onload = async () => {
                        const predictions = await aiService.classifyImage(img);
                        const suggestedCategory = await aiService.suggestCategory(predictions);

                        if (suggestedCategory) {
                            setFormData(prev => ({ ...prev, category: suggestedCategory }));
                            toast({
                                title: "AI Smart Scan 🤖",
                                description: `Detected ${predictions[0]}. Category set to ${suggestedCategory}.`,
                            });
                        }
                        setAnalyzing(false);
                    };
                } catch (error) {
                    console.error("AI Error:", error);
                    setAnalyzing(false);
                }
            }
        }
    };

    // AI Priority Suggestion
    useEffect(() => {
        const analyzeText = async () => {
            if (formData.description.length > 10) {
                // Don't show loading state for text to avoid annoyance, just do it in background
                try {
                    const priority = await aiService.suggestPriority(formData.description);
                    if (priority !== formData.priority && (priority === 'high' || priority === 'urgent')) {
                        setFormData(prev => ({ ...prev, priority }));
                        toast({
                            title: "AI Priority Update",
                            description: `Based on your description, we've updated the priority to ${priority}.`,
                        });
                    }
                } catch (error) {
                    console.error("AI Text Error:", error);
                }
            }
        };

        const timeoutId = setTimeout(analyzeText, 2000); // Debounce 2s
        return () => clearTimeout(timeoutId);
    }, [formData.description]);

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!user) {
            toast({ title: "Authentication required", description: "Please sign in to report an issue.", variant: "destructive" });
            navigate("/signin");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload images
            const imageUrls: string[] = [];
            for (const file of formData.images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('issue-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('issue-images')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrl);
            }

            // 2. Insert issue record
            const { error: insertError } = await supabase
                .from('issue_reports')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    priority: formData.priority,
                    status: 'reported',
                    lga_id: formData.lga, // Assuming this maps to an ID, might need lookup
                    location_address: formData.address,
                    image_urls: imageUrls
                });

            if (insertError) throw insertError;

            toast({
                title: "Report Submitted!",
                description: "Thank you for helping keep our community clean.",
            });
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Error submitting report:", error);
            toast({
                title: "Submission Failed",
                description: error.message || "Could not submit report. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-background dark:to-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gradient mb-2">Report an Issue</h1>
                    <p className="text-muted-foreground">Help us identify and fix environmental problems in your area.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2" />
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s
                                ? "bg-primary text-white shadow-lg scale-110"
                                : "bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                        </div>
                    ))}
                </div>

                <GlassPanel className="p-6 md:p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">What type of issue is this?</h2>
                                {analyzing && (
                                    <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        AI Analyzing...
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categories.map((cat) => (
                                    <FloatingCard
                                        key={cat.id}
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`cursor-pointer p-6 flex flex-col items-center text-center gap-4 border-2 transition-all ${formData.category === cat.id
                                            ? "border-primary bg-primary/5"
                                            : "border-transparent hover:border-primary/30"
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full ${cat.bg} ${cat.color}`}>
                                            <cat.icon className="w-8 h-8" />
                                        </div>
                                        <span className="font-medium text-lg">{cat.name}</span>
                                    </FloatingCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-2xl font-semibold">Describe the issue</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <Input
                                        placeholder="e.g., Overflowing Dumpster at Market Square"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <Textarea
                                        placeholder="Provide details about the issue..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="min-h-[150px] resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Priority Level</label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(val) => setFormData({ ...formData, priority: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low - Minor issue</SelectItem>
                                            <SelectItem value="medium">Medium - Needs attention</SelectItem>
                                            <SelectItem value="high">High - Urgent hazard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-2xl font-semibold">Where is it located?</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">State</label>
                                        <Input value={formData.state} disabled />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">LGA</label>
                                        <Select
                                            value={formData.lga}
                                            onValueChange={(val) => setFormData({ ...formData, lga: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select LGA" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lgas.map((lga) => (
                                                    <SelectItem key={lga.id} value={lga.id}>{lga.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Address / Landmark</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            className="pl-10"
                                            placeholder="Enter street address or nearby landmark"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-2xl font-semibold">Add Photos</h2>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">Click to upload or drag and drop</p>
                                        <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                    {formData.images.map((file, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-2xl font-semibold">Review Report</h2>
                            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Issue</p>
                                        <p className="font-medium">{formData.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-medium">{formData.address}, {formData.lga}, {formData.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Camera className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Attachments</p>
                                        <p className="font-medium">{formData.images.length} images selected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1}
                            className={step === 1 ? "invisible" : ""}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        {step < 5 ? (
                            <Button onClick={handleNext} variant="shine" className="px-8">
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} variant="shine" className="px-8 bg-green-600 hover:bg-green-700">
                                {loading ? "Submitting..." : "Submit Report"}
                            </Button>
                        )}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default ReportIssue;
