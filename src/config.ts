// 获取基础路径
const BASE_URL = import.meta.env.MODE === 'production' ? '/thingtwin/' : '/';

// 资源路径处理函数
export function getAssetPath(path: string): string {
  // 移除开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return '/' + cleanPath;
}

// 预加载图片
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export default {
  getAssetPath,
  preloadImage,
}; 