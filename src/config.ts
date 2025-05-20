// 获取基础路径
const BASE_URL = import.meta.env.BASE_URL;

// 资源路径处理函数
export function getAssetPath(path: string): string {
  // 移除开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // 组合完整路径
  return `${BASE_URL}${cleanPath}`;
}

export default {
  getAssetPath,
}; 