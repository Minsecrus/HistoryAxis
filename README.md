# HistoryAxis

HistoryAxis 是一个基于 React + TypeScript 构建的时间轴应用，用一条横向主轴浏览中国历史的重要时期。界面针对课堂复习与键盘导航做了优化，适合快速梳理时代脉络。

## 功能特性

- 从早期人类活动延续至当代的连续时间轴
- 时代标签、事件标记与制度专题信息
- 支持键盘左右方向键导航
- 基于 Vite 与 GitHub Pages 的静态部署

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建与预览

```bash
pnpm build
pnpm preview
```

## 部署说明

仓库包含 GitHub Actions 工作流：每次推送到 `main` 分支时，都会自动构建项目并将 `dist/` 部署到 GitHub Pages。

要确保站点在 GitHub 上正常发布，请按以下步骤配置：

1. 打开仓库设置页。
2. 进入 `Pages`。
3. 将 `Source` 设置为 `GitHub Actions`。

当前 Vite 的 `base` 路径已经按仓库名 `HistoryAxis` 配置，因此站点会部署在 `/HistoryAxis/` 路径下。

## 许可证

本项目采用 MIT License。详见 [LICENSE](./LICENSE)。
