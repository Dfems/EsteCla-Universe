import { db } from '@services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
const USERS_COLLECTION = 'users';
export async function ensureUsernameAvailable(candidate) {
    const qSnap = await getDocs(query(collection(db, USERS_COLLECTION), where('usernameLowercase', '==', candidate.toLowerCase())));
    return qSnap.empty;
}
export async function pickAvailableUsername(base) {
    const sanitized = base
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_.-]/g, '')
        .slice(0, 20) || 'user';
    const tryNames = [sanitized];
    for (let i = 1; i <= 20; i++)
        tryNames.push(`${sanitized}${i}`);
    for (const candidate of tryNames) {
        if (await ensureUsernameAvailable(candidate))
            return candidate;
    }
    return `${sanitized}${Date.now().toString().slice(-4)}`;
}
