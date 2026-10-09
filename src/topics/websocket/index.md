---
title: websocket 专栏
updated: 2026-09-14
---

# websocket 专栏

实时推送与异步消息：一条 WS 路由怎么写，常驻任务怎么跑。

## 阅读顺序

1. **[08 · 实时与消息](/guide/08-realtime)** — 学习路径版：一条消息从 HTTP 发布到 WS 收到，中间发生了什么，先建立心智模型。
2. **[WebSocket](/reference/websocket)** — `ws.ts` 生命周期钩子、帧池模型、订阅与发布、出站客户端 `new WebSocket`，写 WS handler 看这里，配 sample 的 news 模块跑通。
3. **[MQ 与长任务](/reference/mq-tasks)** — Kafka / RabbitMQ（[oj-bus-kafka](/reference/plugins/oj-bus-kafka) / [oj-bus-rabbitmq](/reference/plugins/oj-bus-rabbitmq)）命名客户端、常驻消费任务、tasks 长任务池，要接 broker 或跑后台常驻任务看这里。

[← 返回后端专题](/topics/)
