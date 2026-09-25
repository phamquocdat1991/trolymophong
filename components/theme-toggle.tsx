'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button aria-label="Đổi giao diện" className="icon-button" style={{ width: '38px', height: '38px' }}>
        <Sun size={18} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
      title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
      className="icon-button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
    >
      {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} />}
    </button>
  );
}
