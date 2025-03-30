import { Button } from "@mui/material";
import { SniperStatus, useSniper } from "../../../hooks/useSniper";
import { WalletSelector } from "../../common/Layout/WalletSelector";
import { MyWallets } from "../Sniper/component/mywallets";

export function Sniper() {
  const { status, registerSniper, startSniper, stopSniper } = useSniper();

  switch (status) {
    case SniperStatus.DISCONNECT:
      // return <Button onClick={registerSniper}>Connect</Button>;
      return <MyWallets></MyWallets>;
    case SniperStatus.UNREGISTERED:
      return <WalletSelector></WalletSelector>;
    // return <Button onClick={registerSniper}>Register</Button>;
    case SniperStatus.STOPPED:
      return <Button onClick={startSniper}>Start</Button>;
    case SniperStatus.RUNNING:
      return <Button onClick={stopSniper}>Stop</Button>;
  }
}
