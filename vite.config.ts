import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
// import { visualizer as bundleAnalyzer } from "rollup-plugin-visualizer";
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'

// 代码分割函数 - 只分割大型依赖
function splitVendorChunk(id: string): string | undefined {
  // 大型依赖单独打包 (只打包真正大的库)

  // ECharts - 最大的依赖之一
  if (id.includes('node_modules/echarts')) return 'vendor-echarts'

  // Excel 处理
  if (id.includes('node_modules/xlsx')) return 'vendor-xlsx'

  // Mermaid 图表
  if (id.includes('node_modules/mermaid')) return 'vendor-mermaid'

  // Markdown 编辑器
  if (id.includes('node_modules/bytemd') || id.includes('node_modules/@bytemd')) {
    return 'vendor-markdown'
  }

  // Three.js
  if (id.includes('node_modules/three')) return 'vendor-three'
}

// https://vitejs.dev/config/
export default defineConfig((configEnv: UserConfig): UserConfig => {
  const { mode } = configEnv
  const env = loadEnv(mode!, process.cwd())

  return {
    base: env.VITE_API_BASE_ROUTER_URL,
    plugins: [
      react(),
      viteMockServe({
        mockPath: path.resolve(__dirname, 'mock'),
        enable: mode === 'mock',
      }),
      // 开启gzip压缩
      mode === 'gzip'
        ? viteCompression({
            // 压缩后删除原文件
            deleteOriginFile: true,
          })
        : undefined,
      mode === 'analyzer' ? bundleAnalyzer({}) : undefined,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        types: path.resolve(__dirname, './types'),
      },
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: ({ name }: { name: string }) => {
            return `js/${name.split('.')[0]}.js`
          },
          assetFileNames: assetInfo => {
            const info = assetInfo?.name?.split('.')
            let extType = info?.[info.length - 1]

            const { name } = assetInfo as { name: string }
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[ext]`
          },
          // 只对超大型依赖进行代码分割
          manualChunks: splitVendorChunk,
        },
      },
    },
  }
})
