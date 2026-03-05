'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, Edit2, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { fetchBranchDocuments, upsertBranchDocument, deleteBranchDocument } from '@/lib/supabase-data';
import type { BranchDocument } from '@/lib/genealogy-types';

export default function ChroniclesAdminPage() {
    const { profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [documents, setDocuments] = useState<BranchDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editor state
    const [editingDoc, setEditingDoc] = useState<BranchDocument | null>(null);

    useEffect(() => {
        // Protect route
        if (!authLoading) {
            if (!profile || profile.role !== 'admin') {
                router.push('/');
                return;
            }
            loadDocuments();
        }
    }, [authLoading, profile, router]);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const docs = await fetchBranchDocuments();
            setDocuments(docs as BranchDocument[]);
        } catch (error) {
            alert('Lỗi: Không thể tải danh sách Biên niên sử');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingDoc({
            id: '',
            branch_name: 'Chi mới',
            content_md: '# Tiêu đề chi phái\n\nNội dung văn bản Markdown ở đây...\n\n### Tiêu đề tên người {#Pxxx}',
            order_index: documents.length + 1,
        });
    };

    const handleSave = async () => {
        if (!editingDoc) return;
        setSaving(true);
        try {
            await upsertBranchDocument({
                id: editingDoc.id ? editingDoc.id : undefined,
                branch_name: editingDoc.branch_name,
                content_md: editingDoc.content_md,
                order_index: editingDoc.order_index,
                owner_id: profile?.id
            });
            alert('Thành công: Đã lưu Biên niên sử chi phái');
            setEditingDoc(null);
            loadDocuments();
        } catch (error: any) {
            alert('Lỗi khi lưu: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xoá tài liệu này? Không thể khôi phục lại!')) return;
        try {
            await deleteBranchDocument(id);
            alert('Thành công: Đã xoá tài liệu');
            loadDocuments();
        } catch (error: any) {
            alert('Lỗi khi xoá: ' + error.message);
        }
    };

    if (authLoading || loading) {
        return <div className="p-8 flex justify-center text-muted-foreground text-sm">Đang tải...</div>;
    }

    if (editingDoc) {
        return (
            <div className="space-y-4 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setEditingDoc(null)}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary">
                        <Save className="h-4 w-4 mr-2" /> {saving ? 'Đang lưu...' : 'Lưu tài liệu'}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Chỉnh sửa Biên niên sử</CardTitle>
                        <CardDescription>
                            Sử dụng định dạng Markdown. Để gắn kết một đoạn tiểu sử vào hồ sơ của một cá nhân, hãy thêm thẻ gán mã bên cạnh tiêu đề (Ví dụ: `### Cụ Nguyễn A {`#P001`}`).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên Chi phái</label>
                                <Input
                                    value={editingDoc.branch_name}
                                    onChange={(e) => setEditingDoc({ ...editingDoc, branch_name: e.target.value })}
                                    placeholder="Ví dụ: Chi Đại Tôn"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Thứ tự hiển thị (Dùng trong tính năng Sách Gia Phả)</label>
                                <Input
                                    type="number"
                                    value={editingDoc.order_index}
                                    onChange={(e) => setEditingDoc({ ...editingDoc, order_index: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium flex justify-between">
                                Nội dung Markdown
                                <span className="text-muted-foreground text-xs font-normal">Sử dụng Markdown chuẩn GitHub</span>
                            </label>
                            <textarea
                                className="w-full min-h-[500px] p-4 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                value={editingDoc.content_md}
                                onChange={(e) => setEditingDoc({ ...editingDoc, content_md: e.target.value })}
                                placeholder="# Viết nội dung Markdown tại đây..."
                            ></textarea>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Biên niên sử</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và chỉnh sửa tài liệu, sử tích các nhánh họ. (Module Document-as-Data)</p>
                </div>
                <Button onClick={handleCreateNew} className="bg-primary">
                    <Plus className="h-4 w-4 mr-2" /> Soạn tài liệu mới
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-4 w-4 text-primary" /> {doc.branch_name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Cập nhật lần cuối: {doc.last_edited_at ? new Date(doc.last_edited_at).toLocaleDateString('vi-VN') : 'Mới tạo'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                {doc.content_md}
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingDoc(doc)}>
                                    <Edit2 className="h-3 w-3 mr-1" /> Sửa
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(doc.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {documents.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        Chưa có tài liệu nào. Hãy tạo Biên niên sử đầu tiên.
                    </div>
                )}
            </div>
        </div>
    );
}
