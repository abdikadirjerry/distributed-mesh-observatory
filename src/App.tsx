import { useState } from 'react';
import { ChaosLabPanel } from './components/ChaosLabPanel';
import { CircuitBreakerMatrix } from './components/CircuitBreakerMatrix';
import { MeshKpiStrip } from './components/MeshKpiStrip';
import { NodeInspectorPanel } from './components/NodeInspectorPanel';
import { SlaBurnRateCard } from './components/SlaBurnRateCard';
import { TopObservatoryBar } from './components/TopObservatoryBar';
import { TopologyCanvas } from './components/TopologyCanvas';
import { TraceWaterfallView } from './components/TraceWaterfallView';
import { useMeshObservatory } from './hooks/useMeshObservatory';
import { ViewTab } from './types/mesh';

export function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('topology');
  const {
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
  } = useMeshObservatory();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? nodes[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <TopObservatoryBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isStreaming={isStreaming}
        onToggleStream={() => setIsStreaming((s) => !s)}
        onReset={resetAll}
      />

      <main className="max-w-[1440px] w-full mx-auto px-6 py-6 flex flex-col gap-6">
        <MeshKpiStrip nodes={nodes} />

        {activeTab === 'topology' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8">
              <TopologyCanvas
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-5">
              <NodeInspectorPanel
                node={selectedNode}
                edges={edges}
                onChangeCircuit={setNodeCircuit}
              />
              <SlaBurnRateCard />
            </div>
          </div>
        )}

        {activeTab === 'traces' && (
          <TraceWaterfallView
            traces={traces}
            selectedTraceId={selectedTraceId}
            onSelectTrace={setSelectedTraceId}
            onCaptureLiveTrace={captureNewTrace}
          />
        )}

        {activeTab === 'breakers' && (
          <CircuitBreakerMatrix nodes={nodes} onChangeCircuit={setNodeCircuit} />
        )}

        {activeTab === 'chaos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7">
              <ChaosLabPanel nodes={nodes} chaos={chaos} onUpdateChaos={setChaos} />
            </div>
            <div className="lg:col-span-5">
              <SlaBurnRateCard />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
