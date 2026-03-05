'use server';

import { createClient } from '@supabase/supabase-js';

// We need to initialize a fresh server-side client because this is a server action.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Searches through all branch markdown documents in the database 
 * to find the section matching the specific `{#handle}` tag.
 */
export async function getBiographyFromMarkdown(handle: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('branch_documents')
            .select('content_md');

        if (error || !data) {
            console.error("Error fetching branch documents:", error);
            return null;
        }

        for (const row of data) {
            const content = row.content_md;
            if (!content) continue;

            const lines = content.split('\n');
            let inSection = false;
            let headingLevel = 0;
            let extracted: string[] = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const headingMatch = line.match(/^(#{1,6})\s/);

                if (inSection) {
                    // If we reach another heading of the same or higher priority (fewer or equal #'s), stop.
                    if (headingMatch && headingMatch[1].length <= headingLevel) {
                        break;
                    }
                    extracted.push(line);
                } else {
                    if (headingMatch && line.includes(`{#${handle}}`)) {
                        inSection = true;
                        headingLevel = headingMatch[1].length;
                        // Dont include the heading line itself in the extracted biography output
                    }
                }
            }

            if (inSection && extracted.length > 0) {
                return extracted.join('\n').trim();
            }
        }
    } catch (e) {
        console.error("Exception in getBiographyFromMarkdown:", e);
    }

    return null;
}
