const AVATAR_POOL = [
  { seed: '2379004', url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '3762800', url: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '1222271', url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '3756691', url: 'https://images.pexels.com/photos/3756691/pexels-photo-3756691.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '1516680', url: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '5704849', url: 'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '614810', url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
  { seed: '2128807', url: 'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1&fit=crop' },
];

export function getAvatarUrl(seed: string): string {
  return AVATAR_POOL.find((a) => a.seed === seed)?.url ?? AVATAR_POOL[0].url;
}
