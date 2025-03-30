import { UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY } from "@coral-xyz/common";
import {
  useActiveWallet,
  useBackgroundClient,
  useBlockchainNativeTokens,
} from "@coral-xyz/recoil";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { AESEncrypt } from "../utils/cryptography";

interface SniperPolicy {
  invest: {
    normal: number;
    danger: number;
  };
  pool: {
    limit: number;
  };
  profit: {
    normal: number;
    danger: number;
  };
  slippage: {
    buy: number;
    sell: number;
  };
  mode: string;
}

interface SniperInfo {
  policy: SniperPolicy;
  traindg: {
    signature: string;
    token: {
      address: string;
      name: string;
      symbol: string;
      logo: string;
    };
  };
  operation: boolean;
  status: string;
}

export enum SniperStatus {
  DISCONNECT,
  UNREGISTERED,
  STOPPED,
  RUNNING,
}

interface SniperInfoResponse {
  sniperInfo: SniperInfo;
}

const dummyPolicy: SniperPolicy = {
  invest: {
    normal: 0.04,
    danger: 0.04,
  },
  pool: {
    limit: 1,
  },
  profit: {
    normal: 1.5,
    danger: 1.1,
  },
  slippage: {
    buy: 5,
    sell: 1,
  },
  mode: "amm",
};

export const useSniper = () => {
  // const wallet = useActiveSolanaWallet();
  const wallet = useActiveWallet();
  const [refreshVal, setRefreshVal] = useState(0);
  const [sniperInfo, setSniperInfo] = useState<SniperInfo | null>(null);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<SniperStatus>(SniperStatus.DISCONNECT);
  const background = useBackgroundClient();
  const nativeTokens = useBlockchainNativeTokens({
    publicKey: wallet.publicKey,
    blockchain: wallet.blockchain,
  });

  // fetch sniper inforamtion
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const resp: AxiosResponse<SniperInfoResponse> = await axios(
          "http://5.9.85.106:8000/user/status",
          {
            method: "GET",
            params: {
              wallet: `${wallet.publicKey}`,
            },
            timeout: 5000,
          }
        );
        const sInfo: SniperInfo = resp.data.sniperInfo;
        setFetching(false);
        console.log(`[DAVID] Sniper User :: = ${JSON.stringify(sInfo)}`);
        setSniperInfo(sInfo);
        if (sInfo.operation === false) setStatus(SniperStatus.STOPPED);
        else setStatus(SniperStatus.RUNNING);
      } catch (error: AxiosError | any) {
        setFetching(false);
        switch (error.code) {
          case "ECONNABORTED": // timeout
          case "ERR_NETWORK":
            setStatus(SniperStatus.DISCONNECT);
            break;
          case "ERR_BAD_REQUEST": // (400) wallet is not registered
            setStatus(SniperStatus.UNREGISTERED);
            break;
          default:
            console.log(`[DAVID] Unknown errCode:: ${error.code}`);
        }
      }
    };
    if (fetching === false) fetchData();
  }, [refreshVal]);

  // refresh
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRefreshVal(Math.random());
    }, 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  // register to sniper
  async function registerSniper(
    password: string = "mask2024",
    policy: SniperPolicy = dummyPolicy
  ) {
    let privateKey;
    try {
      // ph101pp todo
      privateKey = await background.request({
        method: UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY,
        params: [password, wallet.publicKey],
      });
    } catch (e) {
      console.error(e);
      return;
    }
    const encrypedPrivKey = AESEncrypt(privateKey);
    console.log(`[DAVID] Sniper registering (privKey = ${encrypedPrivKey})...`);
    try {
      const resp = await axios("http://5.9.85.106:8000/user/register", {
        method: "POST",
        params: {
          wallet: `${wallet.publicKey}`,
        },
        data: {
          policy: policy,
          privKey: encrypedPrivKey,
        },
      });
    } catch (error: AxiosError | any) {
      console.log(`[DAVID] Register Error: ${error.response.data.message}`);
    }
  }

  // trigger sniper
  async function startSniper() {
    console.log(`[DAVID] Sniper starting ...`);
    const sol = nativeTokens.filter((t) => t.ticker === "SOL")[0];
    if (parseFloat(sol.displayBalance) < sniperInfo?.policy.invest.danger!) {
      console.log(
        `[DAVID] insufficient balance (${sol.displayBalance}, ${sniperInfo?.policy.invest.danger})`
      );
      return;
    }
    const resp = await axios("http://5.9.85.106:8000/sniper/start", {
      method: "POST",
      params: {
        wallet: `${wallet.publicKey}`,
      },
    });
  }

  // stop snipering
  async function stopSniper() {
    console.log(`[DAVID] Sniper stopping ...`);
    const resp = await axios("http://5.9.85.106:8000/sniper/stop", {
      method: "POST",
      params: {
        wallet: `${wallet.publicKey}`,
      },
    });
    console.log(`[DAVID] SNIPER start :: resp = ${JSON.stringify(resp)}`);
  }

  return {
    status,
    registerSniper,
    startSniper,
    stopSniper,
  };
};
