## 🧭 项目概述
CuteMarket 是一个类似 Polymarket 的去中心化预测市场。项目在 2025/11/15 Aptos 线下活动 3 小时 hackathon 期间完成最小可用版本（MVP），并已在 Testnet 部署。

- 完整链上合约（创建项目、下注、结算、查询）
- 前端支持连接钱包、下注、实时读取链上数据、计算赔率与预期收益
- 无后端、无数据库，所有数据存链上

---

## 🧱 技术栈（固定）
- 前端：React 18 + TypeScript + Vite
- 样式：Tailwind CSS
- 钱包：@aptos-labs/wallet-adapter-react（自定义选择器）
- 链 SDK：@aptos-labs/ts-sdk
- 合约：Move（Aptos Framework）

---

## 🔩 合约模块
- 模块：`prediction_market`
- 主要函数：
  - `initialize`：初始化内置 5 个项目（结束时间为未来，支持下注）
  - `place_bet`：下注（最小 0.01 APT，2% 平台手续费）
  - `settle_project`：结算并按比例分配奖金
  - `get_project_info`（view）：查询项目状态与投注池
  - `get_user_bets`（view）：查询用户在某项目的下注记录

---

## 🖥️ 前端功能
- 首页：项目卡片 + 链上总池金额 + “热门选项/赔率”提示
- 详情：实时赔率/收益、输入金额下注、用户历史下注、项目图片展示
- 顶部：Logo + 口号弹幕 + 钱包连接按钮
- 局域网访问：Vite 监听 `0.0.0.0`（手机/同网段可直接访问）

启动开发：
```bash
npm install
npm run dev
```

---

## 🔗 部署信息（Testnet）
- 当前合约地址（最新）：`0x8ebb5f208e99f14584dc352204b107f8c9570a8481cf23e830fee296bd1515cb`
- Explorer：`https://explorer.aptoslabs.com/account/0x8ebb5f208e99f14584dc352204b107f8c9570a8481cf23e830fee296bd1515cb?network=testnet`

查询项目示例：
```bash
aptos move view \
  --function-id 0x8ebb5f208e99f14584dc352204b107f8c9570a8481cf23e830fee296bd1515cb::prediction_market::get_project_info \
  --args u64:0
```

用户下注查询：
```bash
aptos move view \
  --function-id 0x8ebb5f208e99f14584dc352204b107f8c9570a8481cf23e830fee296bd1515cb::prediction_market::get_user_bets \
  --args u64:0 address:0xYOUR_ADDRESS
```

---

## 📦 固定内容（内置项目）
共 5 个项目（名称/选项/结束时间），前端做了基础展示，链上读投注池：
- 川普下台 — ["下台","继续呆着"] — 2026-12-25
- cuteMarket赢今晚比赛 — ["赢","输"] — 2026-11-15
- 比特币突破100万 — ["突破","未突破"] — 2026-12-31
- 诺奖得主地区 — ["亚洲","欧洲","其他"] — 2026-10-10
- 2026世界杯冠军 — ["巴西","阿根廷","法国","其他"] — 2026-07-19

---

## 📈 项目进展
- 合约已部署并初始化内置项目（结束时间改为 2026 年，支持下注）
- 前端已接入链上数据、完成下注流程与赔率计算
- 增加用户历史下注、首页投资组合、热门选项与赔率提示
- 优化钱包连接（未安装跳转下载）、支持局域网访问

待办方向（非必须）：
- 开奖历史页、通知提醒
- 多钱包（Martian/Pontem）插件引导与快捷安装
- 主网部署与生产构建

---

## 🧮 单位与规则
- 1 APT = 100,000,000 Octas
- 最小下注：0.01 APT（1,000,000 Octas）
- 平台手续费：2%

---

## 📚 参考
- Aptos 文档：`https://aptos.dev`
- Aptos Explorer：`https://explorer.aptoslabs.com/?network=testnet`
- Wallet Adapter：`https://github.com/aptos-labs/aptos-wallet-adapter`