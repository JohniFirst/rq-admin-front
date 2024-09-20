import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { type UserConfig, defineConfig } from 'vite'

import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import checker from 'vite-plugin-checker'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig((configEnv: UserConfig): UserConfig => {
	const { mode } = configEnv

	return {
		plugins: [
			react(),
			checker({
				typescript: true,
			}),
			viteMockServe({
				mockPath: path.resolve(__dirname, 'mock'),
				enable: mode === 'mock',
			}),
			// 开启gzip压缩
			mode === 'gzip'
				? viteCompression({
					// 压缩后删除原文件
					deleteOriginFile: false,
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
		css: {
			postcss: {
				plugins: [tailwindcss(), autoprefixer()],
			},
		},
		server: {
			proxy: {
				'/api': {
					target: 'http://localhost:8080',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		build: {
			cssCodeSplit: false,
			rollupOptions: {
				output: {
					entryFileNames: 'js/[name].js',
					chunkFileNames: ({ name }: { name: string }) => {
						return `js/${name.split('.')[0]}.js`
					},
					assetFileNames: (assetInfo) => {
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
				},
			},
		},
	}
})
