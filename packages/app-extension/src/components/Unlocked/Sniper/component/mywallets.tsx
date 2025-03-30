import { Button } from "@mui/material";
// import { SniperStatus, useSniper } from "../../../hooks/useSniper";
// import { WalletSelector } from "../../common/Layout/WalletSelector";
import { temporarilyMakeStylesForBrowserExtension } from "@coral-xyz/tamagui";

const useStyles = temporarilyMakeStylesForBrowserExtension(() => ({
  mywallets: {
    margin: "16px 16.5px",
    padding: "16px",
    gap: "8px",
    borderColor: "white",
    borderRadius: "12px",
    border: "1px solid white",
  },
  walletName: {
    fontSize: "18px",
    font: "Roboto",
    fontWeight: "700",
    color: "white",
  },
  walletList: {
    gap: "8px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  walletTitle: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export const MyWallets = () => {
  const classes = useStyles();

  return (
    <div className={classes.mywallets}>
      <div className={classes.walletName}>My Wallets</div>
      <div className={classes.walletList}>
        <div className={classes.walletTitle}>
          <div className={classes.walletTitle}></div>
        </div>
      </div>
    </div>
  );
};
