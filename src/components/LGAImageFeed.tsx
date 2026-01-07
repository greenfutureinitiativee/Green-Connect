import { useState, useEffect, useRef } from 'react';
import { Heart, User, Calendar, Tag, Share2, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingCard } from '@/components/FloatingCard';
import { LGAService } from '@/services/lga-service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { LGAImage } from '@/types/lga';
import { useNavigate, useParams } from 'react-router-dom';

interface LGAImageFeedProps {
    lgaId: string;
    lgaName: string;
    category?: string;
}

export const LGAImageFeed = ({ lgaId, lgaName, category }: LGAImageFeedProps) => {
    const [images, setImages] = useState<LGAImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [selectedImage, setSelectedImage] = useState<LGAImage | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const observerTarget = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { stateName } = useParams<{ stateName: string }>();

    // Load initial images
    useEffect(() => {
        loadImages(true);
    }, [lgaId, category]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadImages(false);
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    const loadImages = async (reset: boolean) => {
        try {
            setLoading(true);
            const offset = reset ? 0 : images.length;
            const { images: newImages, total } = await LGAService.getLGAImages(lgaId, {
                offset,
                limit: 12,
                category,
                userId: user?.id,
            });

            if (reset) {
                setImages(newImages);
            } else {
                setImages(prev => [...prev, ...newImages]);
            }

            setHasMore(offset + newImages.length < total);
        } catch (error) {
            console.error('Error loading images:', error);
            toast({
                title: 'Error',
                description: 'Failed to load images. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (image: LGAImage) => {
        if (!user) {
            toast({
                title: 'Sign in required',
                description: 'Please sign in to like images',
                variant: 'default',
            });
            return;
        }

        try {
            const isLiked = image.is_liked_by_user;

            // Optimistic update
            setImages(prev =>
                prev.map(img =>
                    img.id === image.id
                        ? {
                            ...img,
                            is_liked_by_user: !isLiked,
                            likes_count: isLiked ? img.likes_count - 1 : img.likes_count + 1,
                        }
                        : img
                )
            );

            if (selectedImage?.id === image.id) {
                setSelectedImage(prev => prev ? {
                    ...prev,
                    is_liked_by_user: !isLiked,
                    likes_count: isLiked ? prev.likes_count - 1 : prev.likes_count + 1,
                } : null);
            }

            // Make API call
            if (isLiked) {
                await LGAService.unlikeImage(image.id, user.id);
            } else {
                await LGAService.likeImage(image.id, user.id);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert optimistic update
            loadImages(true);
            toast({
                title: 'Error',
                description: 'Failed to update like. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleShare = async (image: LGAImage) => {
        const shareData = {
            title: `${lgaName} - ${image.caption || 'Community Photo'}`,
            text: image.caption || `Check out this photo from ${lgaName}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: 'Link copied',
                description: 'Share link copied to clipboard',
            });
        }
    };

    const openImageViewer = (image: LGAImage, index: number) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < images.length) {
            setCurrentIndex(newIndex);
            setSelectedImage(images[newIndex]);
        }
    };

    const getCategoryColor = (cat?: string) => {
        const colors: Record<string, string> = {
            infrastructure: 'bg-blue-100 text-blue-800 border-blue-200',
            events: 'bg-purple-100 text-purple-800 border-purple-200',
            nature: 'bg-green-100 text-green-800 border-green-200',
            people: 'bg-orange-100 text-orange-800 border-orange-200',
            development: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            culture: 'bg-pink-100 text-pink-800 border-pink-200',
            other: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[cat || 'other'] || colors.other;
    };

    if (images.length === 0 && !loading) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No images yet</h3>
                <p className="text-muted-foreground mb-6">
                    Be the first to share a photo from {lgaName}!
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <FloatingCard
                        key={image.id}
                        depth="low"
                        className="group relative overflow-hidden cursor-pointer bg-white dark:bg-slate-900 aspect-square"
                        onClick={() => openImageViewer(image, index)}
                    >
                        {/* Image */}
                        <img
                            src={image.image_url}
                            alt={image.caption || 'LGA photo'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                {image.caption && (
                                    <p className="text-sm font-medium mb-2 line-clamp-2">{image.caption}</p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart
                                            className={`h-5 w-5 ${image.is_liked_by_user ? 'fill-red-500 text-red-500' : ''}`}
                                        />
                                        <span className="text-sm">{image.likes_count}</span>
                                    </div>
                                    {image.category && (
                                        <Badge variant="outline" className="bg-white/20 border-white/40 text-white text-xs">
                                            {image.category}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Featured badge */}
                        {image.is_featured && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-500 text-white border-0">Featured</Badge>
                            </div>
                        )}
                    </FloatingCard>
                ))}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-4" />

            {/* Fullscreen Image Viewer */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    {/* Close button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={closeImageViewer}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    {/* Navigation buttons */}
                    {currentIndex > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={() => navigateImage('prev')}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                    )}
                    {currentIndex < images.length - 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={() => navigateImage('next')}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    )}

                    {/* Image container */}
                    <div className="max-w-6xl w-full flex flex-col md:flex-row gap-4 max-h-[90vh]">
                        {/* Image */}
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.caption || 'LGA photo'}
                                className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain rounded-lg"
                            />
                        </div>

                        {/* Info panel */}
                        <div className="w-full md:w-80 bg-white dark:bg-slate-900 rounded-lg p-6 flex flex-col gap-4 max-h-[70vh] md:max-h-[85vh] overflow-y-auto">
                            {/* User info */}
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{selectedImage.user?.full_name || 'Anonymous'}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(selectedImage.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Caption */}
                            {selectedImage.caption && (
                                <div>
                                    <p className="text-sm">{selectedImage.caption}</p>
                                </div>
                            )}

                            {/* Category */}
                            {selectedImage.category && (
                                <div>
                                    <Badge variant="outline" className={getCategoryColor(selectedImage.category)}>
                                        <Tag className="h-3 w-3 mr-1" />
                                        {selectedImage.category}
                                    </Badge>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t">
                                <Button
                                    variant={selectedImage.is_liked_by_user ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleLike(selectedImage)}
                                >
                                    <Heart
                                        className={`h-4 w-4 mr-2 ${selectedImage.is_liked_by_user ? 'fill-current' : ''}`}
                                    />
                                    {selectedImage.likes_count}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleShare(selectedImage)}
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* View Issue Button */}
                            {selectedImage.issue_id && (
                                <Button
                                    className="w-full mt-2 gap-2"
                                    variant="secondary"
                                    onClick={() => {
                                        closeImageViewer();
                                        // Navigate to issues tab and select this issue
                                        // Need to encode params if they contain spaces
                                        navigate(`/lga/${stateName}/${lgaName}?tab=issues&issueId=${selectedImage.issue_id}`);
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View Issue Report
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
