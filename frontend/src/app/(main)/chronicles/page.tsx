'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Palette, Check, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchBranchDocuments } from '@/lib/supabase-data';
import type { BranchDocument } from '@/lib/genealogy-types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ═══ Color Themes (Same as Book) ═══
interface Theme {
    name: string; swatch: string;
    primary: string; primaryLight: string; primaryBg: string;
    secondary: string; accent: string;
    border: string; borderLight: string;
    text: string; textMuted: string;
}

const THEMES: Record<string, Theme> = {
    amber: {
        name: 'Cổ điển', swatch: '#92400e',
        primary: '#92400e', primaryLight: '#fef3c7', primaryBg: '#fffbeb',
        secondary: '#b45309', accent: '#d97706',
        border: '#f59e0b', borderLight: '#fde68a',
        text: '#451a03', textMuted: '#92400e99',
    },
    emerald: {
        name: 'Thanh nhã', swatch: '#065f46',
        primary: '#065f46', primaryLight: '#d1fae5', primaryBg: '#ecfdf5',
        secondary: '#047857', accent: '#059669',
        border: '#34d399', borderLight: '#a7f3d0',
        text: '#022c22', textMuted: '#06534099',
    },
    slate: {
        name: 'Hiện đại', swatch: '#1e293b',
        primary: '#1e293b', primaryLight: '#e2e8f0', primaryBg: '#f8fafc',
        secondary: '#334155', accent: '#475569',
        border: '#94a3b8', borderLight: '#cbd5e1',
        text: '#0f172a', textMuted: '#47556999',
    },
    rose: {
        name: 'Ấm áp', swatch: '#7f1d1d',
        primary: '#7f1d1d', primaryLight: '#fce7f3', primaryBg: '#fff1f2',
        secondary: '#be123c', accent: '#e11d48',
        border: '#fb7185', borderLight: '#fecdd3',
        text: '#4c0519', textMuted: '#7f1d1d99',
    },
};

type ThemeKey = keyof typeof THEMES;

export default function ChroniclesPage() {
    const [documents, setDocuments] = useState<BranchDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<ThemeKey>('amber');
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const t = THEMES[theme];

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const docs = await fetchBranchDocuments();
                setDocuments(docs as BranchDocument[]);
            } catch (e) {
                console.error('Failed to load branch documents', e);
            }
            setLoading(false);
        };
        loadDocs();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Đang tải biên niên sử...</span>
                </div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-xl font-medium mb-2">Chưa có Biên niên sử nào</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Chưa có tài liệu lịch sử gia phả nào được biên soạn cho các chi phái.
                    Thành viên quản trị có thể thêm tài liệu ở phần Quản lý.
                </p>
                <Link href="/">
                    <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-w-0 w-full overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
            {/* ═══ TOOLBAR ═══ */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b shadow-sm flex-shrink-0">
                <div className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-1 xl:hidden">
                            <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Link href="/tree">
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Cây gia phả
                            </Button>
                        </Link>
                        <span className="text-xs font-serif font-medium" style={{ color: t.primary }}>
                            Biên Niên Sử · {documents.length} cuốn
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {/* Theme picker */}
                        <div className="relative">
                            <Button variant="outline" size="sm" className="gap-1.5"
                                onClick={() => setShowThemePicker(!showThemePicker)}>
                                <Palette className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-xs">{t.name}</span>
                                <span className="w-3 h-3 rounded-full border" style={{ background: t.swatch }} />
                            </Button>
                            {showThemePicker && (
                                <div className="absolute right-0 top-full mt-1 bg-white border rounded-xl shadow-xl p-3 min-w-[200px] z-50">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Bảng màu</p>
                                    <div className="space-y-1">
                                        {Object.entries(THEMES).map(([key, th]) => (
                                            <button key={key}
                                                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm
                                                    ${theme === key ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'}`}
                                                onClick={() => { setTheme(key); setShowThemePicker(false); }}>
                                                <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                                    style={{ background: th.primaryLight, borderColor: th.primary }}>
                                                    {theme === key && <Check className="w-3 h-3" style={{ color: th.primary }} />}
                                                </span>
                                                <span>{th.name}</span>
                                                <div className="flex gap-0.5 ml-auto">
                                                    <span className="w-3 h-3 rounded-full" style={{ background: th.primary }} />
                                                    <span className="w-3 h-3 rounded-full" style={{ background: th.secondary }} />
                                                    <span className="w-3 h-3 rounded-full" style={{ background: th.accent }} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ CONTENT AREA ═══ */}
            <div className="flex-1 flex overflow-hidden bg-slate-50/50">
                {/* ═══ SIDEBAR TOC ═══ */}
                <div className={`
                    absolute xl:static inset-y-0 left-0 z-40 w-64 border-r bg-white/90 backdrop-blur-md transition-transform duration-300
                    flex flex-col shadow-xl xl:shadow-none
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0 xl:w-0'}
                `}>
                    <div className="p-4 border-b shrink-0 flex items-center justify-between">
                        <h3 className="font-serif font-bold text-sm" style={{ color: t.primary }}>MỤC LỤC</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 xl:hidden" onClick={() => setSidebarOpen(false)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {documents.map((doc, i) => (
                            <a key={doc.id}
                                href={`#doc-${doc.id}`}
                                onClick={() => { if (window.innerWidth < 1280) setSidebarOpen(false); }}
                                className="block px-3 py-2 rounded-md text-sm font-serif hover:bg-slate-100 transition-colors line-clamp-2"
                                style={{ color: t.text }}>
                                <span className="opacity-50 mr-2">{i + 1}.</span> {doc.branch_name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ═══ READING PANEL ═══ */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-[210mm] mx-auto bg-white min-h-full shadow-sm"
                        style={{ fontFamily: "'Noto Serif', Georgia, serif", color: t.text }}>

                        {/* Title Section */}
                        <section className="px-8 md:px-16 py-16 text-center border-b" style={{ borderColor: t.borderLight }}>
                            <div className="w-16 h-0.5 mx-auto mb-8" style={{ background: t.primary }} />
                            <h1 className="text-4xl md:text-5xl font-bold tracking-wider font-serif mb-4" style={{ color: t.primary }}>
                                BIÊN NIÊN SỬ
                            </h1>
                            <p className="text-lg font-serif italic" style={{ color: t.textMuted }}>
                                Lưu truyền nguồn gốc và công đức liệt tổ liệt tông
                            </p>
                            <div className="w-24 h-0.5 mx-auto mt-8" style={{ background: t.primary }} />
                        </section>

                        {/* Document Sections */}
                        {documents.map((doc, idx) => (
                            <section key={doc.id} id={`doc-${doc.id}`} className="px-8 mt-12 md:px-16 py-12 md:py-16 text-justify border-b pb-20 last:border-b-0" style={{ borderColor: t.borderLight }}>
                                <h2 className="text-3xl font-bold font-serif mb-8 text-center" style={{ color: t.secondary }}>
                                    {doc.branch_name}
                                </h2>
                                <div className="prose prose-sm md:prose-base max-w-none font-serif leading-relaxed" style={{ color: t.text }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {doc.content_md
                                            // Handle {#P012} style references
                                            .replace(/\{#([a-zA-Z0-9_]+)\}/g, '[🔗 Xem hồ sơ](/people/$1)')
                                        }
                                    </ReactMarkdown>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
