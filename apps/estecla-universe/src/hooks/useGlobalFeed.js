import { useEffect, useMemo, useRef, useState } from 'react';
import { collectionGroup, doc, getDoc, onSnapshot, orderBy, query, } from 'firebase/firestore';
import { db } from '@services/firebase';
function toDate(v) {
    if (!v)
        return undefined;
    if (v instanceof Date)
        return v;
    if (typeof v === 'object' && v !== null && 'toDate' in v) {
        try {
            return v.toDate();
        }
        catch {
            return undefined;
        }
    }
    return undefined;
}
export function useGlobalFeed(limit) {
    const [items, setItems] = useState([]);
    const usersCache = useRef(new Map());
    useEffect(() => {
        const q = query(collectionGroup(db, 'posts'), orderBy('createdAt', 'desc'));
        async function processSnapshot(snap) {
            const rows = snap.docs.map((d) => {
                const data = d.data();
                const uid = d.ref.parent.parent?.id || '';
                const post = {
                    id: d.id,
                    imageUrl: data.imageUrl || '',
                    caption: data.caption || '',
                    createdAt: toDate(data.createdAt),
                    publishAt: toDate(data.publishAt),
                    imageAt: toDate(data.imageAt),
                };
                return { uid, post };
            });
            const limited = typeof limit === 'number' ? rows.slice(0, limit) : rows;
            const missingUids = Array.from(new Set(limited.map((r) => r.uid).filter((u) => u && !usersCache.current.has(u))));
            if (missingUids.length) {
                await Promise.all(missingUids.map(async (uid) => {
                    try {
                        const userSnap = await getDoc(doc(db, 'users', uid));
                        if (userSnap.exists()) {
                            const u = userSnap.data();
                            usersCache.current.set(uid, { username: u.username, profilePic: u.profilePic });
                        }
                        else {
                            usersCache.current.set(uid, { username: 'utente', profilePic: undefined });
                        }
                    }
                    catch {
                        usersCache.current.set(uid, { username: 'utente', profilePic: undefined });
                    }
                }));
            }
            const feed = limited.map(({ uid, post }) => ({
                id: post.id,
                user: usersCache.current.get(uid) || { username: 'utente', profilePic: undefined },
                post,
            }));
            setItems(feed);
        }
        const unsub = onSnapshot(q, (snap) => {
            // Evita callback async direttamente in onSnapshot
            void processSnapshot(snap).catch((e) => {
                console.error('Errore elaborazione feed:', e);
                setItems([]);
            });
        }, (err) => {
            const code = err.code;
            if (code === 'permission-denied') {
                const projectId = db.app.options.projectId;
                console.warn(`Feed non accessibile: permessi insufficienti (rules). projectId=${projectId}`);
                setItems([]);
                return;
            }
            if (code === 'failed-precondition') {
                console.error('Indice richiesto per la query del feed. Dettagli:', err);
                setItems([]);
                return;
            }
            console.error('Errore feed (non gestito):', err);
            setItems([]);
        });
        return () => unsub();
    }, [limit]);
    return useMemo(() => ({ items }), [items]);
}
