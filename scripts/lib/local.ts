// Whether a request comes from the computer running the page: loopback, or one of this computer's own network
// addresses (the page opened through its LAN address on the same Mac, e.g. when another server holds the port on
// 127.0.0.1; user, 2026-11-04). Saving is allowed only then; other computers on the LAN only read.
import { networkInterfaces } from 'node:os';

const plain = (a: string) => a.replace(/^::ffff:/, '');

export function isLocal(addr = ''): boolean {
  const a = plain(addr);
  if (a === '127.0.0.1' || a === '::1') return true;
  return Object.values(networkInterfaces()).some(list => (list ?? []).some(i => plain(i.address) === a));
}
