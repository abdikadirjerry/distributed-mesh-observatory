import { useEffect, useState } from 'react';
import { INITIAL_EDGES, INITIAL_NODES } from '../data/initialTopology';
import { SAMPLE_TRACES } from '../data/sampleTraces';
import { synthesizeLiveTrace, tickMeshTelemetry } from '../engine/telemetrySimulator';
import type { ChaosConfig, CircuitState, DistributedTrace, MeshEdge, MeshNode } from '../types/mesh';

export function useMeshObservatory() {
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<MeshEdge[]>(INITIAL_EDGES);
  const [traces, setTraces] = useState<DistributedTrace[]>(SAMPLE_TRACES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ledger-service');
  const [selectedTraceId, setSelectedTraceId] = useState<string>(SAMPLE_TRACES[0].traceId);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [chaos, setChaos] = useState<ChaosConfig>({
    trafficMultiplier: 1.0,
    injectedLatencyMs: 0,
    packetLossPct: 0,
    targetServiceId: null,
  });

  useEffect(() => {
    if (!isStreaming) return;
    const timer = window.setInterval(() => {
      setNodes((prevNodes) => {
        const result = tickMeshTelemetry(prevNodes, INITIAL_EDGES, chaos);
        setEdges(result.edges);
        return result.nodes;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isStreaming, chaos]);

  const setNodeCircuit = (nodeId: string, nextCircuit: CircuitState) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, circuit: nextCircuit } : node))
    );
  };

  const captureNewTrace = () => {
    const newTrace = synthesizeLiveTrace(nodes);
    setTraces((prev) => [newTrace, ...prev.slice(0, 9)]);
    setSelectedTraceId(newTrace.traceId);
  };

  const resetAll = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setChaos({
      trafficMultiplier: 1.0,
      injectedLatencyMs: 0,
      packetLossPct: 0,
      targetServiceId: null,
    });
  };

  return {
    nodes,
    edges,
    traces,
    selectedNodeId,
    setSelectedNodeId,
    selectedTraceId,
    setSelectedTraceId,
    isStreaming,
    setIsStreaming,
    chaos,
    setChaos,
    setNodeCircuit,
    captureNewTrace,
    resetAll,
  };
}
