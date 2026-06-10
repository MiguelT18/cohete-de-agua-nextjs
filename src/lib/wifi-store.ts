let pendingSsid: string | null = null;
let pendingPassword: string | null = null;

export function setPendingWifiConfig(ssid: string, password: string): void {
  pendingSsid = ssid;
  pendingPassword = password;
}

export function consumePendingWifiConfig(): {
  pending: boolean;
  ssid?: string;
  password?: string;
} {
  if (pendingSsid === null) {
    return { pending: false };
  }
  const result = {
    pending: true,
    ssid: pendingSsid,
    password: pendingPassword || "",
  };
  pendingSsid = null;
  pendingPassword = null;
  return result;
}
