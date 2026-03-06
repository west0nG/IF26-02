import { useMemo, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getIndustries } from '../utils/data';
import type { Job } from '../utils/data';

const INDUSTRY_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
  '#14b8a6', '#e11d48', '#a855f7', '#0ea5e9', '#d946ef',
  '#facc15', '#22d3ee', '#fb923c', '#4ade80', '#f43f5e',
];

interface CellInfo {
  job: Job;
  industryIdx: number;
  row: number;
  col: number;
}

interface Props {
  year: number;
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
  onSelectJob: (job: Job | null) => void;
  selectedJob: Job | null;
}

const CELL = 0.5; // world-space size per cell
const GAP = 0.06;
const BAR_SIZE = CELL - GAP;
const MAX_HEIGHT = 4;

// Single animated bar
function Bar({ cell, maxQuality, color, dimmed, isSelected, onClick, onHover, onUnhover }: {
  cell: CellInfo;
  maxQuality: number;
  color: string;
  dimmed: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetH = (cell.job.quality / maxQuality) * MAX_HEIGHT + 0.05;
  const currentH = useRef(0.01);

  useFrame(() => {
    if (!meshRef.current) return;
    const diff = targetH - currentH.current;
    if (Math.abs(diff) > 0.001) {
      currentH.current += diff * 0.08;
      meshRef.current.scale.y = currentH.current;
      meshRef.current.position.y = currentH.current / 2;
    }
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <mesh
      ref={meshRef}
      position={[cell.col * CELL, 0.01, cell.row * CELL]}
      scale={[1, 0.01, 1]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { onUnhover(); document.body.style.cursor = 'default'; }}
    >
      <boxGeometry args={[BAR_SIZE, 1, BAR_SIZE]} />
      <meshStandardMaterial
        color={isSelected ? '#ffffff' : threeColor}
        transparent
        opacity={dimmed ? 0.08 : 1}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}

// Camera controller that lerps to target
function CameraController({ target, lookAt }: { target: THREE.Vector3; lookAt: THREE.Vector3 }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    camera.position.lerp(target, 0.04);
    currentLookAt.current.lerp(lookAt, 0.04);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Industry label in 3D
function IndustryLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center>
      <div className="text-white/70 text-[11px] font-bold whitespace-nowrap pointer-events-none select-none bg-black/30 px-2 py-0.5 rounded">
        {text}
      </div>
    </Html>
  );
}

function Scene({ year, selectedIndustry, onSelectIndustry, onSelectJob, selectedJob }: Props) {
  const [hoveredCell, setHoveredCell] = useState<CellInfo | null>(null);

  const industries = useMemo(() => getIndustries(year), [year]);

  const { cells, cols, rows, industryBounds } = useMemo(() => {
    const allJobs: { job: Job; industryIdx: number }[] = [];
    for (let ii = 0; ii < industries.length; ii++) {
      for (const job of industries[ii].jobs) {
        allJobs.push({ job, industryIdx: ii });
      }
    }
    const total = allJobs.length;
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);

    const cells: CellInfo[] = allJobs.map((item, i) => ({
      ...item,
      row: Math.floor(i / cols),
      col: i % cols,
    }));

    const industryBounds: Record<string, { minRow: number; maxRow: number; minCol: number; maxCol: number }> = {};
    for (const cell of cells) {
      const name = cell.job.industry;
      if (!industryBounds[name]) {
        industryBounds[name] = { minRow: cell.row, maxRow: cell.row, minCol: cell.col, maxCol: cell.col };
      }
      const b = industryBounds[name];
      b.minRow = Math.min(b.minRow, cell.row);
      b.maxRow = Math.max(b.maxRow, cell.row);
      b.minCol = Math.min(b.minCol, cell.col);
      b.maxCol = Math.max(b.maxCol, cell.col);
    }

    return { cells, cols, rows, industryBounds };
  }, [industries]);

  const maxQuality = useMemo(() => Math.max(...cells.map((c) => c.job.quality), 0.01), [cells]);

  // Camera positions
  const gridCenterX = (cols * CELL) / 2;
  const gridCenterZ = (rows * CELL) / 2;
  const gridSpan = Math.max(cols, rows) * CELL;

  const cameraTarget = useMemo(() => {
    if (!selectedIndustry) {
      return new THREE.Vector3(gridCenterX, gridSpan * 0.8, gridCenterZ + gridSpan * 0.5);
    }
    const bounds = industryBounds[selectedIndustry];
    if (!bounds) return new THREE.Vector3(gridCenterX, gridSpan * 0.8, gridCenterZ + gridSpan * 0.5);

    const cx = ((bounds.minCol + bounds.maxCol + 1) / 2) * CELL;
    const cz = ((bounds.minRow + bounds.maxRow + 1) / 2) * CELL;
    const bw = (bounds.maxCol - bounds.minCol + 1) * CELL;
    const bh = (bounds.maxRow - bounds.minRow + 1) * CELL;
    const span = Math.max(bw, bh);

    return new THREE.Vector3(cx, span * 0.9 + 2, cz + span * 0.6);
  }, [selectedIndustry, industryBounds, gridCenterX, gridCenterZ, gridSpan, cols, rows]);

  const cameraLookAt = useMemo(() => {
    if (!selectedIndustry) {
      return new THREE.Vector3(gridCenterX, 0, gridCenterZ);
    }
    const bounds = industryBounds[selectedIndustry];
    if (!bounds) return new THREE.Vector3(gridCenterX, 0, gridCenterZ);

    const cx = ((bounds.minCol + bounds.maxCol + 1) / 2) * CELL;
    const cz = ((bounds.minRow + bounds.maxRow + 1) / 2) * CELL;
    return new THREE.Vector3(cx, 0, cz);
  }, [selectedIndustry, industryBounds, gridCenterX, gridCenterZ]);

  const handleBarClick = useCallback((cell: CellInfo) => {
    if (!selectedIndustry) {
      onSelectIndustry(cell.job.industry);
    } else {
      onSelectJob(cell.job);
    }
  }, [selectedIndustry, onSelectIndustry, onSelectJob]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <directionalLight position={[-10, 15, -5]} intensity={0.3} />
      <fog attach="fog" args={['#0a0a1a', gridSpan * 0.8, gridSpan * 3]} />

      <CameraController target={cameraTarget} lookAt={cameraLookAt} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[gridCenterX, -0.01, gridCenterZ]}>
        <planeGeometry args={[gridSpan * 2, gridSpan * 2]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>

      {/* Bars */}
      {cells.map((cell, i) => {
        const color = INDUSTRY_COLORS[cell.industryIdx % INDUSTRY_COLORS.length];
        const isIndustrySelected = selectedIndustry === cell.job.industry;
        const dimmed = !!selectedIndustry && !isIndustrySelected;
        const isSelected = selectedJob?.title === cell.job.title && selectedJob?.industry === cell.job.industry;

        return (
          <Bar
            key={i}
            cell={cell}
            maxQuality={maxQuality}
            color={color}
            dimmed={dimmed}
            isSelected={isSelected}
            onClick={() => handleBarClick(cell)}
            onHover={() => setHoveredCell(cell)}
            onUnhover={() => setHoveredCell(null)}
          />
        );
      })}

      {/* Industry labels in overview */}
      {!selectedIndustry && industries.map((ind) => {
        const bounds = industryBounds[ind.industry];
        if (!bounds) return null;
        const cx = ((bounds.minCol + bounds.maxCol + 1) / 2) * CELL;
        const cz = ((bounds.minRow + bounds.maxRow + 1) / 2) * CELL;
        return (
          <IndustryLabel
            key={ind.industry}
            text={ind.industry}
            position={[cx, MAX_HEIGHT + 0.5, cz]}
          />
        );
      })}

      {/* Selected industry label */}
      {selectedIndustry && industryBounds[selectedIndustry] && (() => {
        const bounds = industryBounds[selectedIndustry];
        const cx = ((bounds.minCol + bounds.maxCol + 1) / 2) * CELL;
        const cz = ((bounds.minRow + bounds.maxRow + 1) / 2) * CELL;
        return (
          <Html position={[cx, MAX_HEIGHT + 1, cz]} center>
            <div className="text-white text-lg font-bold whitespace-nowrap pointer-events-none select-none">
              {selectedIndustry}
            </div>
          </Html>
        );
      })()}

      {/* Hover tooltip */}
      {hoveredCell && (
        <Html
          position={[
            hoveredCell.col * CELL,
            (hoveredCell.job.quality / maxQuality) * MAX_HEIGHT + 0.8,
            hoveredCell.row * CELL,
          ]}
          center
        >
          <div className="bg-black/85 backdrop-blur text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none select-none">
            <div className="font-semibold">{hoveredCell.job.title}</div>
            <div className="text-white/60">{hoveredCell.job.industry}</div>
            <div className="text-white/60 mt-1">
              ${hoveredCell.job.salary.toLocaleString()} | Hired: {hoveredCell.job.hired}
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

export default function BarChart(props: Props) {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 20, 20], fov: 50 }}
      onPointerMissed={() => {
        if (props.selectedJob) {
          props.onSelectJob(null);
        } else if (props.selectedIndustry) {
          props.onSelectIndustry(null);
        }
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
