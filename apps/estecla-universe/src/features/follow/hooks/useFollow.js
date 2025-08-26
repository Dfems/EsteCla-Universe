import { useEffect, useState, useCallback } from 'react';
import { followUser, observeIsFollowing, unfollowUser } from '@features/follow/api/follow';
export function useFollow(targetUid) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!targetUid)
            return;
        setLoading(true);
        const unsub = observeIsFollowing(targetUid, (val) => {
            setIsFollowing(val);
            setLoading(false);
        });
        return () => unsub();
    }, [targetUid]);
    const follow = useCallback(async () => {
        if (!targetUid)
            return;
        await followUser(targetUid);
    }, [targetUid]);
    const unfollow = useCallback(async () => {
        if (!targetUid)
            return;
        await unfollowUser(targetUid);
    }, [targetUid]);
    return { isFollowing, loading, follow, unfollow };
}
