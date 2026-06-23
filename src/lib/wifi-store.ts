let pendingSsid: string | null = null;
let pendingPassword: string | null = null;
let pendingReset = false;

export function setPendingWifiConfig(ssid: string, password: string): void {
  pendingSsid = ssid;
  pendingPassword = password;
}

export function setPendingReset(): void {
  pendingReset = true;
}

export function consumePendingWifiConfig(): {
  pending: boolean;
  ssid?: string;
  password?: string;
  reset?: boolean;
} {
  const reset = pendingReset;
  pendingReset = false;

  if (pendingSsid === null) {
    return { pending: false, reset };
  }
  const result = {
    pending: true,
    ssid: pendingSsid,
    password: pendingPassword || "",
    reset,
  };
  pendingSsid = null;
  pendingPassword = null;
  return result;
}
