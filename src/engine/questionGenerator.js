import {
  calculateSubnetDetails,
  getBestCidrForHostCount,
  isSameSubnet,
  subnetsOverlap,
} from './subnetEngine.js';

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const shuffle = (items) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const buildOptionList = (correctAnswer, distractors = []) => {
  const options = new Set([String(correctAnswer)]);
  const pool = distractors.filter((option) => String(option) !== String(correctAnswer));

  while (options.size < 4) {
    const fallback = pool[Math.floor(Math.random() * pool.length)] || 'Not enough evidence';
    options.add(String(fallback));
  }

  return shuffle(Array.from(options));
};

export const generateQuestion = () => {
  const type = pick(['host', 'gateway', 'same-subnet', 'overlap']);

  if (type === 'host') {
    const hostCount = pick([6, 8, 10, 12, 24, 30]);
    const prefixLength = getBestCidrForHostCount(hostCount);
    const answer = `/${prefixLength}`;

    return {
      type,
      prompt: `For ${hostCount} hosts, which CIDR gives the most efficient fit?`,
      context: 'Think: how many usable hosts do you need, then pick the smallest block that covers them.',
      options: buildOptionList(answer, ['/24', '/25', '/26', '/27', '/28', '/29', '/30']),
      answer,
      explanation: {
        title: 'Magic number / block size method',
        steps: [
          `You need ${hostCount} usable hosts, so the subnet must support at least ${hostCount} addresses.` ,
          `For /${prefixLength}, the block size is ${2 ** (32 - prefixLength)} addresses, which covers the need comfortably.`,
          `That makes /${prefixLength} the best CIDR choice.`,
        ],
      },
    };
  }

  if (type === 'gateway') {
    const networkAddress = pick(['192.168.1.0', '10.0.0.0', '172.16.0.0']);
    const prefixLength = pick([24, 25, 26]);
    const details = calculateSubnetDetails(networkAddress, prefixLength);
    const candidates = [
      { address: details.networkAddress, label: 'Network ID' },
      { address: details.broadcastAddress, label: 'Broadcast address' },
      { address: details.usableHosts[0] || details.networkAddress, label: 'Valid host' },
    ];
    const picked = pick(candidates);

    return {
      type,
      prompt: `Which label best describes ${picked.address}/${prefixLength}?`,
      context: 'Remember the three buckets: network ID, broadcast address, or a usable host.',
      options: buildOptionList(picked.label, ['Network ID', 'Broadcast address', 'Valid host', 'Reserved host']),
      answer: picked.label,
      explanation: {
        title: 'Gateway / valid-host check',
        steps: [
          `The network ID is the first address in the block: ${details.networkAddress}.`,
          `The broadcast address is the last address in the block: ${details.broadcastAddress}.`,
          `Anything between them is a valid host address, unless the subnet rules reserve it.`,
        ],
      },
    };
  }

  if (type === 'same-subnet') {
    const networkAddress = pick(['192.168.1.0', '10.10.0.0', '172.20.0.0']);
    const prefixLength = pick([24, 25, 26]);
    const details = calculateSubnetDetails(networkAddress, prefixLength);
    const firstIp = details.usableHosts[0] || details.networkAddress;
    const secondIp = details.usableHosts[1] || details.broadcastAddress;
    const isSame = isSameSubnet(firstIp, secondIp, prefixLength);
    const answer = isSame ? 'Yes — same subnet' : 'No — different subnet';

    return {
      type,
      prompt: `Can ${firstIp} and ${secondIp} ping each other in ${networkAddress}/${prefixLength}?`,
      context: 'If both addresses land in the same network block, they can usually reach each other.',
      options: buildOptionList(answer, ['Yes — same subnet', 'No — different subnet', 'Only if the gateway is online', 'Depends on DHCP']),
      answer,
      explanation: {
        title: 'Same-subnet ping logic',
        steps: [
          `Both addresses share the same network ID ${details.networkAddress}.`,
          `Any host inside that same block can communicate directly unless a firewall or routing rule blocks it.`,
        ],
      },
    };
  }

  const firstNetwork = pick(['192.168.1.0', '10.0.0.0', '172.16.0.0']);
  const firstPrefix = pick([24, 25, 26]);
  const secondNetwork = firstNetwork === '192.168.1.0' ? '192.168.1.128' : '10.0.1.0';
  const secondPrefix = firstPrefix === 24 ? 25 : 24;
  const overlap = subnetsOverlap(firstNetwork, firstPrefix, secondNetwork, secondPrefix);
  const answer = overlap ? 'Yes — they overlap' : 'No — they stay separate';

  return {
    type,
    prompt: `Do ${firstNetwork}/${firstPrefix} and ${secondNetwork}/${secondPrefix} overlap?`,
    context: 'Compare the network range start and end points before you answer.',
    options: buildOptionList(answer, ['Yes — they overlap', 'No — they stay separate', 'Only if they use the same mask', 'Not enough evidence']),
    answer,
    explanation: {
      title: 'Overlap check',
      steps: [
        'List the first and last usable addresses of each subnet.',
        'If one range starts before the other ends, the subnets overlap.',
        'If the ranges are completely separate, they do not overlap.',
      ],
    },
  };
};
