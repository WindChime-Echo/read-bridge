import { useState, useRef, useCallback, useEffect } from 'react';
import { useSiderStore } from '@/store/useSiderStore';

const MIN_WIDTH = 300;
const MAX_WIDTH = 600;

export default function Sider() {
  const { siderWidth, setSiderWidth } = useSiderStore();
  const [width, setWidth] = useState(siderWidth); // 默认宽度
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.userSelect = 'none'; // 防止拖拽时选中文本
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidth.current + diff, MIN_WIDTH), MAX_WIDTH);
    setWidth(newWidth);
    setSiderWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  }, []);

  // 事件监听
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="h-full bg-[#525252] relative"
      style={{ width: `${width}px` }}
    >
      <div
        className="absolute left-[-4px] top-0 bottom-0 w-[8px] cursor-ew-resize hover:bg-blue-300 transition-colors"
        onMouseDown={handleMouseDown}
      />
      Sider
    </div>
  )
}
