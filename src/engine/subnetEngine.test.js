import { describe, it, expect } from 'vitest';
import {
  calculateSubnetDetails,
  getBestCidrForHostCount,
  isSameSubnet,
  subnetsOverlap,
} from './subnetEngine.js';
import { generateQuestion } from './questionGenerator.js';

describe('calculateSubnetDetails', () => {
  it('computes network, broadcast and host ranges for a /24 subnet', () => {
    const result = calculateSubnetDetails('192.168.1.0', 24);

    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.hostsPerSubnet).toBe(254);
    expect(result.usableHosts).toEqual(['192.168.1.1', '192.168.1.254']);
  });
});

describe('subnet relationship helpers', () => {
  it('detects whether two addresses belong to the same subnet', () => {
    expect(isSameSubnet('192.168.1.10', '192.168.1.200', 24)).toBe(true);
    expect(isSameSubnet('192.168.1.10', '192.168.2.1', 24)).toBe(false);
  });

  it('detects overlapping subnets', () => {
    expect(subnetsOverlap('192.168.1.0', 24, '192.168.1.128', 25)).toBe(true);
    expect(subnetsOverlap('10.0.0.0', 24, '10.0.1.0', 24)).toBe(false);
  });

  it('chooses the smallest subnet that can fit the required hosts', () => {
    expect(getBestCidrForHostCount(10)).toBe(28);
    expect(getBestCidrForHostCount(6)).toBe(29);
  });
});

describe('generateQuestion', () => {
  it('returns a question with four answer options and a supported training type', () => {
    const question = generateQuestion();

    expect(question).toBeTruthy();
    expect(question.options).toHaveLength(4);
    expect(question.type).toMatch(/host|gateway|same-subnet|overlap/i);
  });
});
