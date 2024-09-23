import { useEffect } from 'react'

// 弹幕对象
class DanmuStyle {
	text: string
	speed: number
	color: string
	x: number
	y: number

	constructor(
		text: string,
		speed: number,
		color: string,
		canvas: HTMLCanvasElement,
	) {
		this.text = text
		this.speed = speed
		this.color = color
		this.x = canvas.width
		this.y = Math.random() * canvas.height
	}

	move() {
		this.x -= this.speed
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.font = '20px Arial' // 调整字体大小和样式
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.x, this.y)
	}

	isOutOfScreen(ctx: CanvasRenderingContext2D) {
		return this.x + ctx.measureText(this.text).width < 0
	}
}

// 弹幕管理
class DanmuManager {
	danmus: DanmuStyle[]
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	constructor() {
		this.danmus = []
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
	}

	addDanmu(text: string, speed: number, color: string) {
		this.danmus.push(new DanmuStyle(text, speed, color, this.canvas))
	}

	update() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		const newDanmus = []
		for (const danmu of this.danmus) {
			danmu.move()
			danmu.draw(this.ctx)
			if (!danmu.isOutOfScreen(this.ctx)) {
				newDanmus.push(danmu)
			}
		}
		this.danmus = newDanmus

		requestAnimationFrame(() => this.update())
	}
}

function Danmu() {
	useEffect(() => {
		const manager = new DanmuManager()
		manager.update()

		// 模拟添加弹幕
		const timer = setInterval(() => {
			manager.addDanmu('这是一条较快的弹幕', 3, 'red')
		}, 100)

		return () => {
			clearInterval(timer)
		}
	}, [])

	return (
		<div className='custom-container'>
			<canvas id='canvas' width='600' height='400' />
		</div>
	)
}

export default Danmu
