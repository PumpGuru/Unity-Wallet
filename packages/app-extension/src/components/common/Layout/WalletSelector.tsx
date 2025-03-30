import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Checkbox } from "..";

export function WalletSelector() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "5px",
        background: "#151515",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          My Wallet
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", p: 1 }}>
            <Checkbox checked={true} />
            <Typography variant="button" display="block" gutterBottom>
              button text
            </Typography>
          </Box>
          <Typography variant="button" display="block" gutterBottom>
            balance
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", p: 1 }}>
            <Checkbox checked={true} />
            <Typography variant="button" display="block" gutterBottom>
              button text
            </Typography>
          </Box>
          <Typography variant="button" display="block" gutterBottom>
            0 ETH
          </Typography>
        </Box>
      </div>
    </div>
  );
}
