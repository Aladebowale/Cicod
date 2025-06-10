// import { MicOff } from "lucide-react";
// import { Grid, Card, CardContent, Avatar, Typography } from "@mui/material";

// const users = [
//   { id: 1, name: "User 1", image: "https://via.placeholder.com/150", muted: true },
//   { id: 2, name: "User 2", image: "https://via.placeholder.com/150", muted: false },
//   { id: 3, name: "User 3", image: "https://via.placeholder.com/150", muted: true },
//   { id: 4, name: "User 4", image: "https://via.placeholder.com/150", muted: false },
//   { id: 5, name: "User 5", image: "https://via.placeholder.com/150", muted: true },
//   { id: 6, name: "User 6", image: "https://via.placeholder.com/150", muted: false },
//   { id: 7, name: "User 7", image: "https://via.placeholder.com/150", muted: true },
//   { id: 8, name: "User 8", image: "https://via.placeholder.com/150", muted: false },
//   { id: 9, name: "User 9", image: "https://via.placeholder.com/150", muted: true },
//   { id: 10, name: "User 10", image: "https://via.placeholder.com/150", muted: false },
//   { id: 11, name: "User 11", image: "https://via.placeholder.com/150", muted: true },
//   { id: 12, name: "User 12", image: "https://via.placeholder.com/150", muted: false },
//   { id: 13, name: "User 13", image: "https://via.placeholder.com/150", muted: true },
//   { id: 14, name: "User 14", image: "https://via.placeholder.com/150", muted: false },
//   { id: 15, name: "User 15", image: "https://via.placeholder.com/150", muted: true },
//   { id: 16, name: "User 16", image: "https://via.placeholder.com/150", muted: false },
// ];

// const GridView = () => {
//   return (
//     <Grid container spacing={2} padding={2} bgcolor="grey.100" borderRadius={2}>
//       {users.map((user) => (
//         <Grid item xs={12} sm={6} md={3} key={user.id}>
//           <Card sx={{ textAlign: "center", padding: 2, position: "relative" }}>
//             <CardContent>
//               <Avatar src={user.image} alt={user.name} sx={{ width: 80, height: 80, margin: "auto" }} />
//               <Typography variant="h6" mt={1}>{user.name}</Typography>
//               {user.muted && (
//                 <MicOff size={20} style={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "#333", color: "white", padding: 5, borderRadius: "50%" }} />
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default GridView;
// import { MicOff, Videocam, CallEnd, Chat, Group, Security, MoreHoriz } from "@mui/icons-material";

// // import { MicOff, Video, Phone, MessageCircle, Users, Shield, MoreHorizontal } from "lucide-react";
// import { Grid, Card, CardContent, Avatar, Typography, Button, Box, IconButton, Badge } from "@mui/material";

// const users = [
//   { id: 1, name: "User 1", image: "https://via.placeholder.com/150", muted: true },
//   { id: 2, name: "User 2", image: "https://via.placeholder.com/150", muted: false },
//   { id: 3, name: "User 3", image: "https://via.placeholder.com/150", muted: true },
//   { id: 4, name: "User 4", image: "https://via.placeholder.com/150", muted: false },
//   { id: 5, name: "User 5", image: "https://via.placeholder.com/150", muted: true },
//   { id: 6, name: "User 6", image: "https://via.placeholder.com/150", muted: false },
//   { id: 7, name: "User 7", image: "https://via.placeholder.com/150", muted: true },
//   { id: 8, name: "User 8", image: "https://via.placeholder.com/150", muted: false },
//   { id: 9, name: "User 9", image: "https://via.placeholder.com/150", muted: true },
//   { id: 10, name: "User 10", image: "https://via.placeholder.com/150", muted: false },
//   { id: 11, name: "User 11", image: "https://via.placeholder.com/150", muted: true },
//   { id: 12, name: "User 12", image: "https://via.placeholder.com/150", muted: false },
//   { id: 13, name: "User 13", image: "https://via.placeholder.com/150", muted: true },
//   { id: 14, name: "User 14", image: "https://via.placeholder.com/150", muted: false },
//   { id: 15, name: "User 15", image: "https://via.placeholder.com/150", muted: true },
//   { id: 16, name: "User 16", image: "https://via.placeholder.com/150", muted: false },
// ];

// const MeetingDashboard = () => {
//   return (
//     <Box bgcolor="grey.100" p={2}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6">[Internal] Weekly Report Marketing + Sales</Typography>
//         <Box display="flex" gap={1}>
//           {users.slice(0, 5).map(user => (
//             <Avatar key={user.id} src={user.image} />
//           ))}
//           <Badge badgeContent={users.length - 5} color="primary" />
//         </Box>
//       </Box>
      
//       {/* Grid View */}
//       <Grid container spacing={2}>
//         {users.map((user) => (
//           <Grid item xs={12} sm={6} md={3} key={user.id}>
//             <Card sx={{ textAlign: "center", padding: 2, position: "relative" }}>
//               <CardContent>
//                 <Avatar src={user.image} alt={user.name} sx={{ width: 80, height: 80, margin: "auto" }} />
//                 <Typography variant="h6" mt={1}>{user.name}</Typography>
//                 {user.muted && (
//                   <MicOff size={20} style={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "#333", color: "white", padding: 5, borderRadius: "50%" }} />
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
      
//       {/* Footer Controls */}
//       <Box display="flex" justifyContent="center" gap={2} mt={3}>
//       <IconButton color="primary"><Videocam /></IconButton>
// <IconButton color="primary"><Group /></IconButton>
// <IconButton color="primary"><Chat /></IconButton>
// <IconButton color="secondary"><CallEnd /></IconButton>
// <IconButton color="primary"><Security /></IconButton>
// <IconButton color="primary"><MoreHoriz /></IconButton>

//       </Box>
//     </Box>
//   );
// };

// export default MeetingDashboard;

import { Button } from "@/components/ui/button";
import { Mic, Video, ScreenShare, Grid, User, MoreVertical } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg w-full">
      {/* Left Side - Volume Control */}
      <div className="flex items-center">
        <input type="range" className="w-20" />
      </div>
      
      {/* Center Controls */}
      <div className="flex items-center gap-4">
        <Button variant="ghost">
          <Mic size={20} />
        </Button>
        <Button variant="ghost">
          <Video size={20} />
        </Button>
        <Button variant="ghost" className="bg-green-500 text-white">
          <ScreenShare size={20} />
        </Button>
        <Button variant="ghost">
          <Grid size={20} />
        </Button>
        <Button variant="ghost">
          <User size={20} />
        </Button>
        <Button variant="ghost">
          <MoreVertical size={20} />
        </Button>
      </div>
      
      {/* Right Side - Leave Meeting */}
      <Button variant="destructive">Leave Meeting</Button>
    </div>
  );
};

export default Footer;
