import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@chakra-ui/react';
import PostListItem from '@components/ui/PostListItem';
const ProfilePostList = ({ posts, user }) => (_jsx(Box, { px: 1, children: posts.map((post) => (_jsx(PostListItem, { user: user, post: post }, post.id))) }));
export default ProfilePostList;
