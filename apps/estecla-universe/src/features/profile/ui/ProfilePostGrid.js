import { jsx as _jsx } from "react/jsx-runtime";
import { Grid } from '@chakra-ui/react';
import PostCard from '@components/ui/PostCard';
const ProfilePostGrid = ({ posts, username }) => (_jsx(Grid, { templateColumns: "repeat(3, 1fr)", gap: 1, children: posts.map((post) => (_jsx(PostCard, { post: post, username: username }, post.id))) }));
export default ProfilePostGrid;
