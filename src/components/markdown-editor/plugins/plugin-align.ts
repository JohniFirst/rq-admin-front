import type { BytemdPlugin } from 'bytemd'

// 支持标准 HTML 对齐语法，如 <div align="center">内容</div> 或 <p align="right">内容</p>
export function pluginAlign(): BytemdPlugin {
	return {
		viewerEffect({ markdownBody }) {
			// 兼容部分渲染器不自动处理 align 属性
			const aligned = markdownBody.querySelectorAll('div[align], p[align]')
			aligned.forEach((el) => {
				if (el instanceof HTMLElement) {
					const align = el.getAttribute('align')
					if (align === 'center' || align === 'right' || align === 'left') {
						el.style.textAlign = align
					}
				}
			})
		},
	}
}
