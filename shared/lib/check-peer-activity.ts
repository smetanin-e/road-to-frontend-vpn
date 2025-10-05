import { WireguardPeer } from '@prisma/client';
import { WireguardServerPeer } from '../@types/wg-rest-api';

/**
 * Пир считается активным, если:
 * - enable = true
 * - или он был онлайн последние 24 часа
 */

export function checkPeerActivity(
  wgPeers: WireguardServerPeer[],
  userPeer: WireguardPeer,
  now = new Date(),
) {
  const wgPeer = wgPeers.find((p) => p.public_key === userPeer.publicKey);

  if (!wgPeer) return false;

  const lastOnline = new Date(wgPeer.last_online);
  const diffInHours = (now.getTime() - lastOnline.getTime()) / (1000 * 60 * 60);

  const wasOnlineRecently = diffInHours <= 24;
  const isEnabled = wgPeer.enable === true;

  // если пир включен или недавно был онлайн
  return isEnabled || wasOnlineRecently;
}
