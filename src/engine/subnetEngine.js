const toIPv4 = (octets) => octets.map((octet) => String(octet)).join('.');

const toDecimal = (octets) => {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
};

const fromDecimal = (value) => {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ];
};

const getMaskValue = (prefixLength) => {
  if (prefixLength === 0) {
    return 0;
  }

  return ((0xffffffff << (32 - prefixLength)) >>> 0) & 0xffffffff;
};

export const calculateSubnetDetails = (ipAddress, prefixLength) => {
  const octets = ipAddress.split('.').map(Number);
  const ipValue = toDecimal(octets);
  const hostBits = 32 - prefixLength;
  const maskValue = getMaskValue(prefixLength);
  const networkValue = ipValue & maskValue;
  const broadcastValue = networkValue | (~maskValue >>> 0);
  const usableHosts = hostBits > 1 ? [networkValue + 1, broadcastValue - 1] : [];

  return {
    subnetMask: toIPv4(fromDecimal(maskValue)),
    networkAddress: toIPv4(fromDecimal(networkValue)),
    broadcastAddress: toIPv4(fromDecimal(broadcastValue)),
    prefixLength,
    hostBits,
    hostsPerSubnet: hostBits > 1 ? 2 ** hostBits - 2 : 0,
    usableHosts: usableHosts.length
      ? [toIPv4(fromDecimal(usableHosts[0])), toIPv4(fromDecimal(usableHosts[1]))]
      : [],
  };
};

export const isSameSubnet = (ipAddressA, ipAddressB, prefixLength) => {
  const detailsA = calculateSubnetDetails(ipAddressA, prefixLength);
  const detailsB = calculateSubnetDetails(ipAddressB, prefixLength);

  return detailsA.networkAddress === detailsB.networkAddress;
};

export const subnetsOverlap = (networkAddressA, prefixLengthA, networkAddressB, prefixLengthB) => {
  const detailsA = calculateSubnetDetails(networkAddressA, prefixLengthA);
  const detailsB = calculateSubnetDetails(networkAddressB, prefixLengthB);

  const startA = toDecimal(detailsA.networkAddress.split('.').map(Number));
  const endA = toDecimal(detailsA.broadcastAddress.split('.').map(Number));
  const startB = toDecimal(detailsB.networkAddress.split('.').map(Number));
  const endB = toDecimal(detailsB.broadcastAddress.split('.').map(Number));

  return startA <= endB && startB <= endA;
};

export const getBestCidrForHostCount = (hostCount) => {
  const requiredHosts = hostCount;
  let prefixLength = 32;

  while (prefixLength >= 24) {
    const hostBits = 32 - prefixLength;
    if (2 ** hostBits - 2 >= requiredHosts) {
      return prefixLength;
    }

    prefixLength -= 1;
  }

  return 24;
};
