'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Heart, Image, FileText, History, Lock, Phone, MapPin, Briefcase, GraduationCap, Tag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { zodiacYear } from '@/lib/genealogy-types';
import type { PersonDetail } from '@/lib/genealogy-types';
import { CommentSection } from '@/components/comment-section';
import { getBiographyFromMarkdown } from '@/lib/biography-parser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function PersonProfilePage() {
    const params = useParams();
    const router = useRouter();
    const handle = params.handle as string;
    const [person, setPerson] = useState<PersonDetail | null>(null);
    const [bookBiography, setBookBiography] = useState<string | null>(null);
    const [familyRels, setFamilyRels] = useState<Record<string, { label: string, childrenStr: string }>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');
                const { data, error } = await supabase
                    .from('people')
                    .select('*')
                    .eq('handle', handle)
                    .single();
                if (!error && data) {
                    const row = data as Record<string, unknown>;
                    setPerson({
                        handle: row.handle as string,
                        displayName: row.display_name as string,
                        gender: row.gender as number,
                        birthYear: row.birth_year as number | undefined,
                        deathYear: row.death_year as number | undefined,
                        generation: row.generation as number,
                        isLiving: row.is_living as boolean,
                        isPrivacyFiltered: row.is_privacy_filtered as boolean,
                        isPatrilineal: row.is_patrilineal as boolean,
                        families: (row.families as string[]) || [],
                        parentFamilies: (row.parent_families as string[]) || [],
                        title: row.title as string | undefined,
                        degree: row.degree as string | undefined,
                        longevity: row.longevity as number | undefined,
                        phone: row.phone as string | undefined,
                        email: row.email as string | undefined,
                        currentAddress: row.current_address as string | undefined,
                        hometown: row.hometown as string | undefined,
                        occupation: row.occupation as string | undefined,
                        education: row.education as string | undefined,
                        notes: row.notes as string | undefined,
                        biography: row.biography as string | undefined,
                    } as PersonDetail);

                    // Fetch families and member names for the relationship tab
                    const famHandles = [...((row.families as string[]) || []), ...((row.parent_families as string[]) || [])];
                    if (famHandles.length > 0) {
                        const { data: fData } = await supabase.from('families').select('*').in('handle', famHandles);
                        if (fData) {
                            const allPeopleHandles = new Set<string>();
                            fData.forEach(f => {
                                if (f.father_handle) allPeopleHandles.add(f.father_handle);
                                if (f.mother_handle) allPeopleHandles.add(f.mother_handle);
                                f.children.forEach((c: string) => allPeopleHandles.add(c));
                            });
                            const { data: pData } = await supabase.from('people').select('handle, display_name, notes').in('handle', Array.from(allPeopleHandles));
                            const pMap = new Map((pData || []).map(p => [p.handle, p]));

                            const rels: Record<string, { label: string, childrenStr: string }> = {};
                            fData.forEach(f => {
                                const father = pMap.get(f.father_handle);
                                const mother = pMap.get(f.mother_handle);
                                const fatherName = father ? father.display_name : f.father_handle;
                                const motherName = mother ? mother.display_name : f.mother_handle;

                                let motherExt = '';
                                if (mother?.notes) {
                                    const mNotes = mother.notes.toLowerCase();
                                    if (mNotes.includes('vợ 1') || mNotes.includes('chính thất')) motherExt = ' (Vợ chính)';
                                    else if (mNotes.includes('vợ 2') || mNotes.includes('kế thất')) motherExt = ' (Kế thất)';
                                    else if (mNotes.includes('vợ 3')) motherExt = ' (Vợ 3)';
                                }

                                const childrenNames = (f.children || []).map((c: string) => pMap.get(c)?.display_name || c);

                                let label = f.handle;
                                if (fatherName && motherName) label = `${fatherName} & ${motherName}${motherExt}`;
                                else if (fatherName) label = `Gia đình ${fatherName}`;
                                else if (motherName) label = `Gia đình ${motherName}${motherExt}`;

                                rels[f.handle] = { label, childrenStr: childrenNames.join(', ') };
                            });
                            setFamilyRels(rels);
                        }
                    }
                }

                // Fetch biography from Markdown Library (Document-as-Data)
                try {
                    const extractedMd = await getBiographyFromMarkdown(handle);
                    if (extractedMd) setBookBiography(extractedMd);
                } catch (e) {
                    console.error("Failed to load markdown biography", e);
                }

            } catch { /* ignore */ }
            setLoading(false);
        };
        fetchPerson();
    }, [handle]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!person) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Không tìm thấy người này</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>
        );
    }

    const genderLabel = person.gender === 1 ? 'Nam' : person.gender === 2 ? 'Nữ' : 'Không rõ';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {person.displayName}
                            {person.isPrivacyFiltered && (
                                <Badge variant="outline" className="text-amber-500 border-amber-500">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Thông tin bị giới hạn
                                </Badge>
                            )}
                        </h1>
                        <p className="text-muted-foreground">
                            {genderLabel}
                            {person.generation ? ` • Đời thứ ${person.generation}` : ''}
                            {person.chi ? ` • Chi ${person.chi}` : ''}
                            {person.isLiving && ' • Còn sống'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy notice */}
            {person.isPrivacyFiltered && person._privacyNote && (
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-600 dark:text-amber-400">
                    🔒 {person._privacyNote}
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview" className="gap-1">
                        <User className="h-3.5 w-3.5" /> Tổng quan
                    </TabsTrigger>
                    <TabsTrigger value="relationships" className="gap-1">
                        <Heart className="h-3.5 w-3.5" /> Quan hệ
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-1">
                        <Image className="h-3.5 w-3.5" /> Tư liệu
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-1">
                        <History className="h-3.5 w-3.5" /> Lịch sử
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="gap-1">
                        <MessageCircle className="h-3.5 w-3.5" /> Bình luận
                    </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4">
                    {/* Thông tin cá nhân */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" /> Thông tin cá nhân
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-x-6 gap-y-3 md:grid-cols-4">
                            <InfoRow label="Họ" value={person.surname || '—'} />
                            <InfoRow label="Tên" value={person.firstName || '—'} />
                            <InfoRow label="Giới tính" value={genderLabel} />
                            {person.nickName && <InfoRow label="Tên thường gọi" value={person.nickName} />}
                            <InfoRow label="Ngày sinh (Dương lịch)" value={person.birthDate || (person.birthYear ? `${person.birthYear}` : '—')} />
                            {person.birthYear && <InfoRow label="Năm sinh (Âm lịch)" value={zodiacYear(person.birthYear) || '—'} />}
                            <InfoRow label="Nơi sinh" value={person.birthPlace || '—'} />
                            {!person.isLiving && (
                                <>
                                    <InfoRow label="Ngày mất (Dương lịch)" value={person.deathDate || (person.deathYear ? `${person.deathYear}` : '—')} />
                                    {person.longevity ? <InfoRow label="Hưởng thọ" value={`${person.longevity} tuổi`} /> : null}
                                    <InfoRow label="Nơi mất" value={person.deathPlace || '—'} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Liên hệ */}
                    {(person.phone || person.email || person.zalo || person.facebook) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Phone className="h-4 w-4" /> Liên hệ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                {person.phone && <InfoRow label="Điện thoại" value={person.phone} />}
                                {person.email && <InfoRow label="Email" value={person.email} />}
                                {person.zalo && <InfoRow label="Zalo" value={person.zalo} />}
                                {person.facebook && <InfoRow label="Facebook" value={person.facebook} />}
                            </CardContent>
                        </Card>
                    )}

                    {/* Địa chỉ */}
                    {(person.hometown || person.currentAddress) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Địa chỉ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                {person.hometown && <InfoRow label="Quê quán" value={person.hometown} />}
                                {person.currentAddress && <InfoRow label="Nơi ở hiện tại" value={person.currentAddress} />}
                            </CardContent>
                        </Card>
                    )}

                    {/* Nghề nghiệp & Học vấn */}
                    {(person.occupation || person.company || person.education || person.title || person.degree) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Nghề nghiệp, Chức danh & Học vấn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                {person.title && <InfoRow label="Chức tước / Thụy hiệu" value={person.title} />}
                                {person.degree && <InfoRow label="Học vị / Đỗ đạt" value={person.degree} />}
                                {person.occupation && <InfoRow label="Nghề nghiệp" value={person.occupation} />}
                                {person.company && <InfoRow label="Nơi công tác" value={person.company} />}
                                {person.education && (
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Học vấn</p>
                                            <p className="text-sm">{person.education}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Tiểu sử & Ghi chú */}
                    {(person.biography || person.notes || bookBiography) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Tiểu sử & Ghi chú
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {bookBiography && (
                                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-medium text-xs">
                                            <FileText className="h-3.5 w-3.5" />
                                            Được trích xuất từ Thư viện Gia phả
                                        </div>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {bookBiography}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                {!bookBiography && person.biography && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Tiểu sử</p>
                                        <p className="text-base leading-relaxed whitespace-pre-wrap rounded-lg p-3 bg-muted/20 border border-muted-foreground/10">{person.biography}</p>
                                    </div>
                                )}
                                {person.notes && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Ghi chú</p>
                                        <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap rounded-lg p-3 bg-muted/20 border border-muted-foreground/10">{person.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Tags */}
                    {person.tags && person.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Nhãn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {person.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Relationships */}
                <TabsContent value="relationships">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quan hệ gia đình</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5"><Heart className="h-4 w-4" /> Bậc trên (Cha / Mẹ)</p>
                                    <div className="space-y-2">
                                        {person.parentFamilies && person.parentFamilies.length > 0 ? (
                                            person.parentFamilies.map((f) => {
                                                const rel = familyRels[f];
                                                return (
                                                    <div key={f} className="p-3 bg-muted/30 rounded-lg border border-border/50 shadow-sm transition-all hover:bg-muted/50">
                                                        <p className="font-semibold text-sm text-primary mb-1">{rel ? rel.label : f}</p>
                                                        {rel && rel.childrenStr && <p className="text-xs text-muted-foreground leading-relaxed">Con cái: {rel.childrenStr}</p>}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm italic text-muted-foreground pl-1">Không có thông tin</p>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5"><User className="h-4 w-4" /> Gia đình nhỏ (Vợ / Chồng, Con)</p>
                                    <div className="space-y-2">
                                        {person.families && person.families.length > 0 ? (
                                            person.families.map((f) => {
                                                const rel = familyRels[f];
                                                return (
                                                    <div key={f} className="p-3 bg-muted/30 rounded-lg border border-border/50 shadow-sm transition-all hover:bg-muted/50">
                                                        <p className="font-semibold text-sm text-primary mb-1">{rel ? rel.label : f}</p>
                                                        {rel && rel.childrenStr && <p className="text-xs text-muted-foreground leading-relaxed">Con cái: {rel.childrenStr}</p>}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm italic text-muted-foreground pl-1">Không có thông tin</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media */}
                <TabsContent value="media">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tư liệu liên quan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                {person.mediaCount ? `${person.mediaCount} tư liệu` : 'Chưa có tư liệu nào'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Tính năng xem chi tiết sẽ được bổ sung trong Epic 3 (Media Library).
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lịch sử thay đổi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Audit log cho entity này sẽ được bổ sung trong Epic 4.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Comments */}
                <TabsContent value="comments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" /> Bình luận
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CommentSection personHandle={handle} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    );
}
