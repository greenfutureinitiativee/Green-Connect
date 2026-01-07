import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LGAService } from '@/services/lga-service';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lgaId: string;
    lgaName: string;
    userId: string;
    onUploadSuccess?: () => void;
}

const IMAGE_CATEGORIES = [
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'events', label: 'Events' },
    { value: 'nature', label: 'Nature' },
    { value: 'people', label: 'People' },
    { value: 'development', label: 'Development' },
    { value: 'culture', label: 'Culture' },
    { value: 'other', label: 'Other' },
];

export const ImageUploadModal = ({
    open,
    onOpenChange,
    lgaId,
    lgaName,
    userId,
    onUploadSuccess,
}: ImageUploadModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid file',
                description: 'Please select an image file (JPG, PNG, WebP)',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Image must be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            await LGAService.uploadImage(lgaId, userId, selectedFile, caption, category);

            toast({
                title: 'Upload successful',
                description: 'Your image has been submitted for review. It will appear in the gallery once approved.',
            });

            // Reset form
            setSelectedFile(null);
            setPreviewUrl(null);
            setCaption('');
            setCategory('');
            onOpenChange(false);

            // Notify parent
            onUploadSuccess?.();
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Failed to upload image. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share a Photo</DialogTitle>
                    <DialogDescription>
                        Upload a photo from {lgaName}. Your image will be reviewed before being published.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* File upload area */}
                    {!previewUrl ? (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Click to upload</p>
                                    <p className="text-sm text-muted-foreground">JPG, PNG or WebP (max 5MB)</p>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={handleRemoveFile}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Caption */}
                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption (optional)</Label>
                        <Textarea
                            id="caption"
                            placeholder="Describe this photo..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={3}
                            maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {caption.length}/200 characters
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category (optional)</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {IMAGE_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Upload
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
