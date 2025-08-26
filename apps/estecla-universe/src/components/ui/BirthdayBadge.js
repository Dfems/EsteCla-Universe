import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from '@chakra-ui/react';
const BirthdayBadge = ({ secsToBirthday }) => {
    if (secsToBirthday == null || secsToBirthday >= 86400)
        return null;
    const hours = Math.floor(secsToBirthday / 3600);
    const minutes = Math.floor((secsToBirthday % 3600) / 60);
    const label = hours >= 1 ? `${hours}h` : `${minutes}m`;
    return (_jsx(Badge, { position: "absolute", top: -1, right: -1, colorScheme: "pink", borderRadius: "full", fontSize: "0.6rem", px: 2, py: 0.5, children: label }));
};
export default BirthdayBadge;
