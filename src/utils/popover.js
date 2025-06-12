// Popover 类实现
class Popover {
  static getInstance() {
    if (!Popover.instance) {
      Popover.instance = new Popover();
    }
    return Popover.instance;
  }

  constructor() {
    if (Popover.instance) {
      return Popover.instance;
    }

    // 创建 popover 元素
    this.popover = document.createElement('div');
    this.popover.className = 'custom-popover';
    this.popover.style.position = 'absolute';
    this.popover.style.display = 'none';
    this.popover.style.background = '#fff';
    this.popover.style.padding = '12px 16px';
    this.popover.style.borderRadius = '8px';
    this.popover.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
    this.popover.style.zIndex = 1001;
    this.popover.style.wordBreak = 'break-all';
    this.popover.style.maxHeight = '30vh';
    this.popover.style.overflowY = 'auto';
    this.popover.style.transition = 'all 0.3s ease-in-out';
    document.body.appendChild(this.popover);

    this.hideTimer = null;
    this.showTimer = null;
    this.targets = new WeakMap(); // 存储所有目标元素及其配置
    this.currentTarget = null;
    this.currentContent = '';
    this.currentPlacement = 'bottom';
    this.isVisible = false;
    this.minShowTime = 200; // 最小显示时间（毫秒）
    this.showDelay = 200; // 显示延迟（毫秒）

    // 绑定方法
    this.boundShow = this.show.bind(this);
    this.boundHide = this.hide.bind(this);
    this.boundPopoverEnter = this.handlePopoverEnter.bind(this);
    this.boundPopoverLeave = this.handlePopoverLeave.bind(this);

    // 绑定 popover 元素的事件
    this.popover.addEventListener('mouseenter', this.boundPopoverEnter);
    this.popover.addEventListener('mouseleave', this.boundPopoverLeave);

    Popover.instance = this;
  }

  calculateBestPlacement(target) {
    const rect = target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spacing = 6;

    // 计算各个方向可用空间
    const spaceTop = rect.top;
    const spaceBottom = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    // 获取 popover 的尺寸
    const popRect = this.popover.getBoundingClientRect();
    const popWidth = popRect.width;
    const popHeight = popRect.height;

    // 计算各个方向是否足够空间
    const canShowTop = spaceTop >= popHeight + spacing;
    const canShowBottom = spaceBottom >= popHeight + spacing;
    const canShowLeft = spaceLeft >= popWidth + spacing;
    const canShowRight = spaceRight >= popWidth + spacing;

    // 优先选择垂直方向
    if (canShowBottom) {
      return 'bottom';
    } else if (canShowTop) {
      return 'top';
    }
    // 如果垂直方向都不行，尝试水平方向
    else if (canShowRight) {
      return 'right';
    } else if (canShowLeft) {
      return 'left';
    }
    // 如果都不行，选择空间最大的方向
    else {
      const spaces = [
        { direction: 'bottom', space: spaceBottom },
        { direction: 'top', space: spaceTop },
        { direction: 'right', space: spaceRight },
        { direction: 'left', space: spaceLeft }
      ];
      return spaces.reduce((max, curr) => curr.space > max.space ? curr : max).direction;
    }
  }

  bindEvents(target, options) {
    // 存储目标元素及其配置
    this.targets.set(target, {
      content: options.content || '',
      placement: options.placement || null // 不设置默认值，让系统自动计算
    });

    // 绑定事件监听
    target.addEventListener('mouseenter', (e) => {
      this.currentTarget = target;
      const config = this.targets.get(target);
      this.setContent(config.content);

      // 如果没有指定 placement，自动计算最佳位置
      const placement = config.placement || this.calculateBestPlacement(target);
      this.setPlacement(placement);

      // 清除之前的定时器
      if (this.showTimer) {
        clearTimeout(this.showTimer);
      }
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }

      // 设置显示延迟
      this.showTimer = setTimeout(() => {
        if (this.currentTarget === target) {
          this.show();
        }
      }, this.showDelay);
    });

    target.addEventListener('mouseleave', () => {
      // 清除显示定时器
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }

      // 如果已经显示，设置最小显示时间
      if (this.isVisible) {
        const showTime = Date.now() - this.showStartTime;
        const remainingTime = Math.max(0, this.minShowTime - showTime);

        this.hideTimer = setTimeout(() => {
          this.hide();
        }, remainingTime);
      } else {
        this.hide();
      }
    });
  }

  unbindEvents(target) {
    if (!target) return;

    target.removeEventListener('mouseenter', this.boundShow);
    target.removeEventListener('mouseleave', this.boundHide);
    this.targets.delete(target);
  }

  handlePopoverEnter() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  handlePopoverLeave() {
    if (this.isVisible) {
      const showTime = Date.now() - this.showStartTime;
      const remainingTime = Math.max(0, this.minShowTime - showTime);

      this.hideTimer = setTimeout(() => {
        this.hide();
      }, remainingTime);
    }
  }

  positionPopover() {
    if (!this.currentTarget) return;

    const rect = this.currentTarget.getBoundingClientRect();

    // 方案1：使用 requestAnimationFrame 和强制重排
    requestAnimationFrame(() => {
      const popRect = this.popover.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0, left = 0;
      const spacing = 6;

      // 计算初始位置
      switch (this.currentPlacement) {
        case 'bottom':
          top = rect.bottom + window.scrollY + spacing;
          left = rect.left + window.scrollX + (rect.width - popRect.width) / 2;
          break;
        case 'top':
          top = rect.top + window.scrollY - popRect.height - spacing;
          left = rect.left + window.scrollX + (rect.width - popRect.width) / 2;
          break;
        case 'left':
          top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
          left = rect.left + window.scrollX - popRect.width - spacing;
          break;
        case 'right':
          top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
          left = rect.right + window.scrollX + spacing;
          break;
      }

      // 确保不超出视口
      if (left < window.scrollX) {
        left = window.scrollX + spacing;
      } else if (left + popRect.width > window.scrollX + viewportWidth) {
        left = window.scrollX + viewportWidth - popRect.width - spacing;
      }

      if (top < window.scrollY) {
        top = window.scrollY + spacing;
      } else if (top + popRect.height > window.scrollY + viewportHeight) {
        top = window.scrollY + viewportHeight - popRect.height - spacing;
      }

      // 应用位置
      this.popover.style.top = `${top}px`;
      this.popover.style.left = `${left}px`;
    });

    /* 方案2：使用 ResizeObserver（备选方案）
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const popRect = entry.contentRect;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = 0, left = 0;
        const spacing = 6;

        // 计算初始位置
        switch (this.currentPlacement) {
          case 'bottom':
            top = rect.bottom + window.scrollY + spacing;
            left = rect.left + window.scrollX + (rect.width - popRect.width) / 2;
            break;
          case 'top':
            top = rect.top + window.scrollY - popRect.height - spacing;
            left = rect.left + window.scrollX + (rect.width - popRect.width) / 2;
            break;
          case 'left':
            top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
            left = rect.left + window.scrollX - popRect.width - spacing;
            break;
          case 'right':
            top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
            left = rect.right + window.scrollX + spacing;
            break;
        }

        // 确保不超出视口
        if (left < window.scrollX) {
          left = window.scrollX + spacing;
        } else if (left + popRect.width > window.scrollX + viewportWidth) {
          left = window.scrollX + viewportWidth - popRect.width - spacing;
        }

        if (top < window.scrollY) {
          top = window.scrollY + spacing;
        } else if (top + popRect.height > window.scrollY + viewportHeight) {
          top = window.scrollY + viewportHeight - popRect.height - spacing;
        }

        // 应用位置
        this.popover.style.top = `${top}px`;
        this.popover.style.left = `${left}px`;

        // 断开观察
        resizeObserver.disconnect();
      }
    });

    resizeObserver.observe(this.popover);
    */
  }

  show() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.popover.style.display = 'block';
    this.positionPopover();
    this.isVisible = true;
    this.showStartTime = Date.now();
  }

  hide() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.hideTimer = setTimeout(() => {
      this.popover.style.display = 'none';
      this.isVisible = false;
    }, 120);
  }

  setContent(content) {
    this.currentContent = content;
    this.popover.innerHTML = content;
  }

  setPlacement(placement) {
    this.currentPlacement = placement;
  }

  destroy() {
    // 解绑所有元素的事件
    this.targets.forEach((_, target) => {
      this.unbindEvents(target);
    });
    this.targets.clear();

    // 解绑 popover 元素的事件
    this.popover.removeEventListener('mouseenter', this.boundPopoverEnter);
    this.popover.removeEventListener('mouseleave', this.boundPopoverLeave);

    if (this.popover && this.popover.parentNode) {
      this.popover.parentNode.removeChild(this.popover);
    }

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    Popover.instance = null;
  }
}

// 导出工厂函数
function createPopover(target, options = {}) {
  const popover = Popover.getInstance();

  // 绑定新的事件
  popover.bindEvents(target, options);

  return {
    setContent: (content) => {
      const config = popover.targets.get(target);
      if (config) {
        config.content = content;
        if (popover.currentTarget === target) {
          popover.setContent(content);
        }
      }
    },
    destroy: () => {
      popover.unbindEvents(target);
      if (popover.targets.size === 0) {
        popover.destroy();
      }
    }
  };
}
