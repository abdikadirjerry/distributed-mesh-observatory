import { INITIAL_EDGES, INITIAL_NODES } from '../../data/initialTopology';
import { calculateMeshHealthScore, synthesizeLiveTrace, tickMeshTelemetry } from '../telemetrySimulator';

const snapshot = tickMeshTelemetry(INITIAL_NODES, INITIAL_EDGES, {
  trafficMultiplier: 2.0,
  injectedLatencyMs: 50,
  packetLossPct: 2,
  targetServiceId: 'ledger-service',
});

const score = calculateMeshHealthScore(snapshot.nodes);
const trace = synthesizeLiveTrace(snapshot.nodes);

if (score.totalRps <= 0 || trace.spans.length < 4) {
  throw new Error('Telemetry simulation invariants failed');
}
