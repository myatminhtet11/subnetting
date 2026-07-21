import {
  calculateSubnetDetails,
  getBestCidrForHostCount,
  getDifficultySettings,
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

const buildPrefixPool = (minPrefix, maxPrefix, correctPrefix) => {
  return Array.from({ length: maxPrefix - minPrefix + 1 }, (_, index) => `/${minPrefix + index}`).filter(
    (value) => value !== `/${correctPrefix}`,
  );
};

export const generateQuestion = (difficulty = 'medium') => {
  const settings = getDifficultySettings(difficulty);
  const type = pick(settings.questionTypes);

  if (type === 'host') {
    const hostCount = pick([6, 8, 10, 12, 20, 24, 45, 60, 100]);
    const prefixLength = getBestCidrForHostCount(hostCount, settings.minPrefix, settings.maxPrefix);
    const answer = `/${prefixLength}`;
    const prompt = difficulty === 'easy'
      ? `Senior Architect Prompt: You are designing a network for a branch office with ${hostCount} workstations. Which minimum CIDR mask conserves the most IP addresses?`
      : difficulty === 'hard'
        ? `Architect Capacity Prompt: A regional office needs ${hostCount} addresses for a new site. Which minimum CIDR mask conserves the most IP addresses?`
        : `Operations Prompt: A department needs ${hostCount} addresses for a new rollout. Which CIDR mask is the smallest block that still fits the requirement?`;

    return {
      type,
      difficulty: difficulty.toLowerCase(),
      timerSeconds: settings.timerSeconds,
      prompt,
      context: 'Think in terms of usable hosts and the smallest block that still covers the requirement.',
      options: buildOptionList(answer, buildPrefixPool(settings.minPrefix, settings.maxPrefix, prefixLength)),
      answer,
      explanation: {
        title: 'Magic number / block size method',
        steps: [
          `You need ${hostCount} usable hosts, so the subnet must support at least ${hostCount} addresses.`,
          `For ${answer}, the block size is ${2 ** (32 - prefixLength)} addresses, which covers the need comfortably.`,
          `That makes ${answer} the best CIDR choice.`,
        ],
      },
    };
  }

  if (type === 'gateway') {
    const prefixLength = pick(
      Array.from({ length: settings.maxPrefix - settings.minPrefix + 1 }, (_, index) => settings.minPrefix + index),
    );
    const networkAddress = pick(['192.168.1.0', '10.0.0.0', '172.16.0.0', '10.10.0.0', '172.16.32.0']);
    const details = calculateSubnetDetails(networkAddress, prefixLength);
    const candidates = [
      { address: details.networkAddress, label: 'Network ID' },
      { address: details.broadcastAddress, label: 'Broadcast address' },
      { address: details.usableHosts[0] || details.networkAddress, label: 'Valid host' },
    ];
    const picked = pick(candidates);
    const prompt = difficulty === 'easy'
      ? `Field Engineer Prompt: You are validating a small office subnet ${networkAddress}/${prefixLength}. Which label best describes ${picked.address}?`
      : difficulty === 'hard'
        ? `Troubleshooting Prompt: While validating a routed segment ${networkAddress}/${prefixLength}, you need to classify ${picked.address}. Which label fits best?`
        : `Troubleshooting Prompt: During a network audit, you inspect ${picked.address} inside the ${networkAddress}/${prefixLength} block. What is the correct classification?`;

    return {
      type,
      difficulty: difficulty.toLowerCase(),
      timerSeconds: settings.timerSeconds,
      prompt,
      context: 'Separate the network boundary, the broadcast boundary, and any usable host address.',
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
    const prefixLength = pick(
      Array.from({ length: settings.maxPrefix - settings.minPrefix + 1 }, (_, index) => settings.minPrefix + index),
    );
    const networkAddress = pick(['10.10.0.0', '172.20.0.0', '192.168.10.0']);
    const details = calculateSubnetDetails(networkAddress, prefixLength);
    const firstIp = details.usableHosts[0] || details.networkAddress;
    const secondIp = details.usableHosts[1] || details.broadcastAddress;
    const isSame = isSameSubnet(firstIp, secondIp, prefixLength);
    const answer = isSame ? 'Yes — traffic stays local' : 'No — it needs a default gateway';
    const prompt = `Troubleshooting Prompt: Host A (${firstIp}/${prefixLength}) is trying to ping Host B (${secondIp}/${prefixLength}). Will the traffic stay local or require a default gateway?`;

    return {
      type,
      difficulty: difficulty.toLowerCase(),
      timerSeconds: settings.timerSeconds,
      prompt,
      context: 'If both hosts share the same subnet, they can usually reach each other without routing.',
      options: buildOptionList(answer, ['Yes — traffic stays local', 'No — it needs a default gateway', 'Only if DNS resolves', 'Depends on the firewall']),
      answer,
      explanation: {
        title: 'Same-subnet ping logic',
        steps: [
          `Both addresses share the network ID ${details.networkAddress}.`,
          `Any host inside that same block can communicate directly unless a firewall or routing rule blocks it.`,
        ],
      },
    };
  }

  const firstPrefix = pick(
    Array.from({ length: settings.maxPrefix - settings.minPrefix + 1 }, (_, index) => settings.minPrefix + index),
  );
  const firstNetwork = pick(['172.16.32.0', '10.0.0.0', '192.168.8.0']);
  const secondNetwork = firstNetwork === '172.16.32.0' ? '172.16.48.0' : '10.0.4.0';
  const secondPrefix = firstPrefix > 24 ? 24 : firstPrefix + 1;
  const overlap = subnetsOverlap(firstNetwork, firstPrefix, secondNetwork, secondPrefix);
  const answer = overlap ? 'Yes — they overlap' : 'No — they stay separate';
  const prompt = `ISP Allocation Prompt: An ISP assigns ${firstNetwork}/${firstPrefix}. Another customer block is ${secondNetwork}/${secondPrefix}. Do these allocations overlap?`;

  return {
    type,
    difficulty: difficulty.toLowerCase(),
    timerSeconds: settings.timerSeconds,
    prompt,
    context: 'Compare the start and end addresses of both subnets before answering.',
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
