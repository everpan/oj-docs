---
title: websocket 专栏
updated: 2026-09-14
---

# websocket 专栏

实时推送与异步消息：一条 WS 路由怎么写，常驻任务怎么跑。

| 文档 | 看它解决什么 |
|---|---|
| [WebSocket](/reference/websocket) | `ws.ts` 生命周期钩子、帧池模型、订阅与发布、出站客户端 `new WebSocket` |
| [MQ 与长任务](/reference/mq-tasks) | Kafka / RabbitMQ 命名客户端、常驻消费任务、tasks 长任务池 |
| [08 · 实时与消息](/guide/08-realtime) | 学习路径版：一条消息从 HTTP 发布到 WS 收到，中间发生了什么 |

## 阅读顺序

1. 先读 [08 · 实时与消息](/guide/08-realtime) 建立心智模型；
2. 写 WS handler 看 [WebSocket](/reference/websocket)，跑通 sample 的 news 模块；
3. 要接 broker 或跑后台常驻任务，看 [MQ 与长任务](/reference/mq-tasks)。

[← 返回后端专题](/topics/)
