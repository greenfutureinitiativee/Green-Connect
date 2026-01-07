import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GlassPanel } from "@/components/GlassPanel";
import { FloatingCard } from "@/components/FloatingCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
    LayoutDashboard,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    MapPin,
    User,
    ExternalLink,
    ShieldAlert
} from "lucide-react";
import type { IssueReport, DashboardStats } from "@/types";
import { toast } from "sonner";

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState<IssueReport[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        criticalReports: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const loadAdminData = useCallback(async () => {
        try {
            setLoading(true);

            // Verify admin role
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user?.id)
                .single();

            if (profile?.role !== 'admin') {
                toast.error("Unauthorized access");
                navigate("/dashboard");
                return;
            }

            // Fetch all issues with related data
            const { data, error } = await supabase
                .from("issue_reports")
                .select(`
                    *,
                    profiles:user_id (full_name, email, phone),
                    lgas:lga_id (name, state)
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const allIssues = data as IssueReport[];
            setIssues(allIssues);

            // Calculate stats
            setStats({
                totalReports: allIssues.length,
                pendingReports: allIssues.filter(i => ['reported', 'verified', 'in_progress'].includes(i.status)).length,
                resolvedReports: allIssues.filter(i => i.status === 'resolved').length,
                criticalReports: allIssues.filter(i => ['high', 'urgent'].includes(i.priority) && i.status !== 'resolved').length,
            });

        } catch (error) {
            console.error("Error loading admin data:", error);
            toast.error("Failed to load admin dashboard");
        } finally {
            setLoading(false);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            loadAdminData();
        }
    }, [user, loadAdminData]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedIssue) return;

        try {
            setIsUpdating(true);
            const { error } = await supabase
                .from("issue_reports")
                .update({
                    status: newStatus,
                    admin_notes: adminNote,
                    resolved_by: newStatus === 'resolved' ? user?.id : selectedIssue.resolved_by
                })
                .eq("id", selectedIssue.id);

            if (error) throw error;

            toast.success(`Issue status updated to ${newStatus}`);
            setSelectedIssue(null);
            loadAdminData(); // Refresh data
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch =
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.lgas?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "reported": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
            "verified": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
            "in_progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            "resolved": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            "rejected": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
                <LoadingSpinner size="lg" text="Loading admin dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background pb-12">
            <div className="container py-8 px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Manage and resolve reported issues</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => navigate("/admin/governance")}>
                            Manage Governance
                        </Button>
                        <Button variant="outline" onClick={loadAdminData}>
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <FloatingCard depth="low" className="p-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <LayoutDashboard className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Total Reports</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.totalReports}</div>
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Pending</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.pendingReports}</div>
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Resolved</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.resolvedReports}</div>
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <ShieldAlert className="h-5 w-5 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Critical</span>
                        </div>
                        <div className="text-2xl font-bold">{stats.criticalReports}</div>
                    </FloatingCard>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="reported">Reported</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Issues Table */}
                <GlassPanel className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Issue</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((issue) => (
                                    <TableRow key={issue.id}>
                                        <TableCell>
                                            <div className="font-medium">{issue.title}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                {issue.category}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                {issue.lgas?.name}, {issue.lgas?.state}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(issue.status)}>
                                                {issue.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={issue.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                                {issue.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedIssue(issue);
                                                    setAdminNote(issue.admin_notes || "");
                                                }}
                                            >
                                                Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No reports found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </GlassPanel>
            </div>

            {/* Issue Detail Dialog */}
            <Dialog open={!!selectedIssue} onOpenChange={(open: boolean) => !open && setSelectedIssue(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {selectedIssue?.title}
                            <Badge variant="outline" className={getStatusColor(selectedIssue?.status || "")}>
                                {selectedIssue?.status.replace("_", " ")}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Reported on {selectedIssue && new Date(selectedIssue.created_at).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedIssue && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                    <p className="text-sm">{selectedIssue.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {selectedIssue.location_address || "No specific address"}, {selectedIssue.lgas?.name}, {selectedIssue.lgas?.state}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Reporter</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-primary" />
                                        {selectedIssue.profiles?.full_name || "Anonymous"} ({selectedIssue.profiles?.email})
                                    </div>
                                </div>

                                {selectedIssue.image_urls && selectedIssue.image_urls.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Attached Images</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedIssue.image_urls.map((url, idx) => (
                                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video rounded-lg overflow-hidden border hover:opacity-90 transition-opacity">
                                                    <img src={url} alt={`Evidence ${idx + 1}`} className="object-cover w-full h-full" />
                                                    <ExternalLink className="absolute top-2 right-2 h-4 w-4 text-white drop-shadow-md" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-primary" />
                                    Admin Actions
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Admin Notes</label>
                                    <Textarea
                                        placeholder="Add internal notes about this issue..."
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Update Status</label>
                                    <Select
                                        value={selectedIssue.status}
                                        onValueChange={handleStatusUpdate}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="reported">Reported</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedIssue.status === 'resolved' && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-md flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        This issue has been marked as resolved.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
