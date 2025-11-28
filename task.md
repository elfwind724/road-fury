t# Implementation Plan

## Phase 1: 项目初始化与基础架构

- [x] 1. 初始化项目结构
  - [x] 1.1 创建 Vite + React + TypeScript 项目
    - 使用 `npm create vite@latest` 初始化项目
    - 配置 TypeScript 严格模式
    - 配置路径别名 `@/`
    - _Requirements: 技术选型_

  - [x] 1.2 安装和配置依赖
    - 安装 Phaser 3: `phaser`
    - 安装状态管理: `zustand`, `immer`
    - 安装测试框架: `vitest`, `fast-check`
    - 配置 Vitest 测试环境
    - _Requirements: 技术选型_

  - [x] 1.3 创建基础目录结构
    - `src/game/` - Phaser 游戏逻辑
    - `src/systems/` - 核心游戏系统
    - `src/store/` - Zustand 状态管理
    - `src/components/` - React UI 组件
    - `src/config/` - 游戏配置数据
    - `src/types/` - TypeScript 类型定义
    - `src/utils/` - 工具函数
    - _Requirements: 架构设计_

- [x] 2. 定义核心类型和配置

  - [x] 2.1 创建游戏类型定义
    - 定义 VehicleState, VehicleType, VehicleStats 接口
    - 定义 FacilityState, FacilityType, FacilityConfig 接口
    - 定义 ResourceState, ResourceType 接口
    - 定义 ZombieConfig, ZombieType 接口
    - 定义 SurvivorState, SurvivorSkill, SurvivorPersonality 接口
    - 定义 SaveData, MetaState, RunState 接口
    - _Requirements: 2.4, 3.1, 4.4, 6.1, 7.5, 9.3_

  - [x] 2.2 创建游戏配置数据
    - 创建车辆配置表 (MVP: tricycle, van, truck)
    - 创建设施配置表 (MVP: bed, kitchen, water_tank, solar_panel, turret, storage)
    - 创建丧尸配置表 (MVP: normal, fat, elite)
    - 创建资源掉落表
    - _Requirements: 2.2, 3.2, 4.1, 6.1_

- [x] 3. Checkpoint - 确保项目结构正确
  - 确保所有测试通过，如有问题请询问用户

## Phase 2: 状态管理与存档系统

- [x] 4. 实现 Zustand 状态管理

  - [x] 4.1 创建游戏状态 Store
    - 实现 RunState 初始化和重置
    - 实现 MetaState 持久化
    - 实现 GameConfig 加载
    - _Requirements: 8.1, 8.2_

  - [ ]* 4.2 编写状态管理属性测试
    - **Property 24: Meta Progress Round-Trip**
    - **Validates: Requirements 8.5, 8.6**

- [x] 5. 实现存档系统

  - [x] 5.1 创建 SaveManager
    - 实现 save() 方法序列化游戏状态到 LocalStorage
    - 实现 load() 方法从 LocalStorage 加载状态
    - 实现 validate() 方法验证存档数据结构
    - 实现 export()/import() 方法支持存档导出导入
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 5.2 编写存档系统属性测试
    - **Property 25: Save Data Validation**
    - **Validates: Requirements 9.3**

  - [ ]* 5.3 编写游戏状态序列化属性测试
    - **Property 26: Game State Round-Trip**
    - **Validates: Requirements 9.4**

- [x] 6. Checkpoint - 确保存档系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 3: 资源系统

- [x] 7. 实现资源管理系统

  - [x] 7.1 创建 ResourceSystem
    - 实现 addResource() 方法添加资源
    - 实现 consumeResource() 方法消耗资源
    - 实现 getCapacity() 方法获取资源上限
    - 实现资源上限检查逻辑
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [ ]* 7.2 编写资源上限属性测试
    - **Property 12: Resource Capacity Cap**
    - **Validates: Requirements 4.3**

  - [ ]* 7.3 编写资源消耗属性测试
    - **Property 13: Resource Consumption Deduction**
    - **Validates: Requirements 4.5**

## Phase 4: 车辆系统

- [x] 8. 实现车辆系统

  - [x] 8.1 创建 VehicleSystem
    - 实现车辆状态初始化
    - 实现 changeLane() 方法处理变道
    - 实现 takeDamage() 方法处理伤害
    - 实现 repair() 方法修复耐久
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ]* 8.2 编写变道边界属性测试
    - **Property 1: Lane Change Bounds**
    - **Validates: Requirements 1.2**

  - [ ]* 8.3 编写障碍物伤害属性测试
    - **Property 3: Durability Reduction on Obstacle**
    - **Validates: Requirements 1.4**

- [x] 9. 实现车辆升级系统

  - [x] 9.1 创建 VehicleUpgradeSystem
    - 实现 canUpgrade() 方法检查升级条件
    - 实现 upgrade() 方法执行车辆升级
    - 实现 upgradeAttribute() 方法升级单个属性
    - 实现设施迁移逻辑
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [ ]* 9.2 编写升级资源检查属性测试
    - **Property 5: Vehicle Upgrade Resource Check**
    - **Validates: Requirements 2.1**

  - [ ]* 9.3 编写设施槽位增加属性测试
    - **Property 6: Facility Slot Increase on Upgrade**
    - **Validates: Requirements 2.2**

  - [ ]* 9.4 编写设施保留属性测试
    - **Property 7: Facility Preservation on Upgrade**
    - **Validates: Requirements 2.3**

- [x] 10. Checkpoint - 确保车辆系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 5: 设施系统

- [x] 11. 实现设施系统

  - [x] 11.1 创建 FacilitySystem
    - 实现 installFacility() 方法安装设施
    - 实现 removeFacility() 方法移除设施
    - 实现 upgradeFacility() 方法升级设施
    - 实现 getEfficiency() 方法计算设施效率
    - 实现设施生产/消耗逻辑
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 11.2 编写设施建造成本属性测试
    - **Property 8: Facility Build Cost Deduction**
    - **Validates: Requirements 3.2**

  - [ ]* 11.3 编写设施效率缩放属性测试
    - **Property 9: Facility Efficiency Scaling**
    - **Validates: Requirements 3.3**

  - [x] 11.4 实现设施序列化
    - 实现 serializeFacilities() 方法
    - 实现 deserializeFacilities() 方法
    - _Requirements: 3.5, 3.6_

  - [ ]* 11.5 编写设施序列化属性测试
    - **Property 10: Facility State Round-Trip**
    - **Validates: Requirements 3.5, 3.6**

## Phase 6: 生存系统

- [x] 12. 实现生存需求系统

  - [x] 12.1 创建 SurvivalSystem
    - 实现 updateNeeds() 方法更新饥饿/口渴值
    - 实现 updateHealth() 方法根据需求更新健康
    - 实现 checkGameOver() 方法检查游戏结束条件
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 12.2 编写饥饿衰减属性测试
    - **Property 14: Hunger Decay Rate**
    - **Validates: Requirements 5.1**

  - [ ]* 12.3 编写口渴衰减属性测试
    - **Property 15: Thirst Decay Rate**
    - **Validates: Requirements 5.2**

  - [ ]* 12.4 编写零饥饿健康衰减属性测试
    - **Property 16: Health Decay at Zero Hunger**
    - **Validates: Requirements 5.3**

  - [ ]* 12.5 编写零口渴健康衰减属性测试
    - **Property 17: Health Decay at Zero Thirst**
    - **Validates: Requirements 5.4**

- [x] 13. Checkpoint - 确保生存系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 7: 战斗系统

- [x] 14. 实现战斗系统

  - [x] 14.1 创建 CombatSystem
    - 实现 spawnZombie() 方法根据里程生成丧尸
    - 实现 calculateCrushDamage() 方法计算碾压伤害
    - 实现 calculateZombieAttack() 方法计算丧尸攻击
    - 实现 processCollision() 方法处理碰撞
    - 实现 getDrops() 方法获取掉落资源
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 14.2 编写丧尸生成距离属性测试
    - **Property 18: Zombie Spawn Distance Constraint**
    - **Validates: Requirements 6.1**

  - [ ]* 14.3 编写碾压伤害公式属性测试
    - **Property 19: Crush Damage Formula**
    - **Validates: Requirements 6.2**

  - [ ]* 14.4 编写护甲减伤属性测试
    - **Property 20: Armor Damage Reduction**
    - **Validates: Requirements 6.3**

  - [ ]* 14.5 编写碰撞伤害计算属性测试
    - **Property 2: Collision Damage Calculation**
    - **Validates: Requirements 1.3**

  - [ ]* 14.6 编写丧尸掉落属性测试
    - **Property 11: Zombie Drop Consistency**
    - **Validates: Requirements 4.1**

## Phase 8: 幸存者系统

- [x] 15. 实现幸存者系统

  - [x] 15.1 创建 SurvivorSystem
    - 实现 recruitSurvivor() 方法招募幸存者
    - 实现 assignToFacility() 方法分配幸存者到设施
    - 实现 getSkillBonus() 方法获取技能加成
    - 实现 updateMorale() 方法更新士气
    - 实现 checkLeave() 方法检查幸存者离开
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 15.2 编写技能加成应用属性测试
    - **Property 21: Survivor Skill Bonus Application**
    - **Validates: Requirements 7.2**

  - [ ]* 15.3 编写士气衰减属性测试
    - **Property 22: Morale Decay on Unmet Needs**
    - **Validates: Requirements 7.3**

## Phase 9: 永久进度系统

- [x] 16. 实现 Meta 进度系统

  - [x] 16.1 创建 MetaSystem
    - 实现 calculateApocalypsePoints() 方法计算末世点数
    - 实现 applyPermanentUpgrade() 方法应用永久升级
    - 实现 unlockBlueprint() 方法解锁图纸
    - 实现 unlockVehicle() 方法解锁车辆
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 16.2 编写末世点数计算属性测试
    - **Property 23: Apocalypse Points Calculation**
    - **Validates: Requirements 8.1**

- [x] 17. 实现离线收益系统

  - [x] 17.1 创建 OfflineSystem
    - 实现 calculateOfflineRewards() 方法计算离线收益
    - 实现 applyOfflineRewards() 方法应用离线收益
    - 实现 8 小时上限逻辑
    - _Requirements: 1.5_

  - [ ]* 17.2 编写离线收益属性测试
    - **Property 4: Offline Resource Accumulation**
    - **Validates: Requirements 1.5**

- [x] 18. Checkpoint - 确保进度系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 10: 事件系统

- [x] 19. 实现路况事件系统

  - [x] 19.1 创建 EventSystem
    - 实现 triggerEvent() 方法触发事件
    - 实现 selectEvent() 方法从事件池选择事件
    - 实现 applyEventOutcome() 方法应用事件结果
    - 实现天气效果逻辑
    - 实现路障检查逻辑
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 19.2 编写事件选择属性测试
    - **Property 27: Event Selection from Pool**
    - **Validates: Requirements 10.1**

  - [ ]* 19.3 编写天气效果属性测试
    - **Property 28: Weather Effect on Facility**
    - **Validates: Requirements 10.4**

  - [ ]* 19.4 编写路障检查属性测试
    - **Property 29: Roadblock Power Requirement**
    - **Validates: Requirements 10.5**

## Phase 11: Phaser 游戏场景

- [x] 20. 创建 Phaser 游戏核心

  - [x] 20.1 初始化 Phaser 游戏实例
    - 配置 Phaser 游戏参数 (Canvas/WebGL, 分辨率, 物理引擎)
    - 创建 React-Phaser 桥接组件
    - 实现游戏循环与状态同步
    - _Requirements: 1.1_

  - [x] 20.2 创建主游戏场景 (MainScene)
    - 实现公路背景滚动
    - 实现车辆精灵渲染
    - 实现丧尸精灵生成和移动
    - 实现碰撞检测
    - _Requirements: 1.1, 1.2, 1.3, 6.1_

  - [x] 20.3 创建资源收集动画
    - 实现丧尸碾压动画
    - 实现资源飘出动画
    - 实现伤害数字显示
    - _Requirements: 4.1, 4.2_

- [x] 21. Checkpoint - 确保游戏场景正常运行
  - 确保所有测试通过，如有问题请询问用户

## Phase 12: React UI 界面

- [x] 22. 创建游戏 HUD

  - [x] 22.1 创建 HUD 组件
    - 实现里程计数器显示
    - 实现资源快捷显示 (废铁、食材、水)
    - 实现车辆耐久条
    - 实现能源条
    - _Requirements: 4.4, 2.4_

  - [x] 22.2 创建快捷操作按钮
    - 实现改装按钮
    - 实现管理按钮
    - 实现暂停按钮
    - _Requirements: UI 设计_

- [x] 23. 创建车辆改装界面

  - [x] 23.1 创建 VehicleCustomizePanel
    - 实现车辆俯视图显示
    - 实现设施槽位网格
    - 实现设施拖放安装
    - 实现设施升级按钮
    - _Requirements: 3.1, 3.3_

- [x] 24. 创建资源管理界面

  - [x] 24.1 创建 ResourcePanel
    - 实现所有资源存量显示
    - 实现产出/消耗速率显示
    - 实现资源容量条
    - _Requirements: 4.4_

- [x] 25. 创建幸存者管理界面

  - [x] 25.1 创建 SurvivorPanel
    - 实现幸存者列表
    - 实现技能和性格显示
    - 实现岗位分配功能
    - _Requirements: 7.5_

- [x] 26. 创建永久升级界面

  - [x] 26.1 创建 MetaProgressPanel
    - 实现技能树显示
    - 实现图纸收集显示
    - 实现成就显示
    - _Requirements: 8.2, 8.3, 8.4_

- [x] 27. Checkpoint - 确保 UI 界面正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 13: 游戏流程整合

- [x] 28. 整合游戏流程

  - [x] 28.1 实现游戏启动流程
    - 实现主菜单
    - 实现存档加载
    - 实现新游戏开始
    - _Requirements: 9.2_

  - [x] 28.2 实现游戏结束流程
    - 实现死亡判定
    - 实现结算界面
    - 实现末世点数发放
    - _Requirements: 5.5, 8.1_

  - [x] 28.3 实现游戏暂停和恢复
    - 实现暂停菜单
    - 实现自动存档
    - 实现离线收益计算
    - _Requirements: 9.1, 1.5_

- [x] 29. 创建临时美术资源

  - [x] 29.1 创建占位符精灵
    - 创建车辆占位符 (3 种车型)
    - 创建设施占位符 (6 种设施)
    - 创建丧尸占位符 (3 种丧尸)
    - 创建公路背景占位符
    - _Requirements: 美术风格_

- [x] 30. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

## Phase 14: 武器弹幕系统

- [x] 31. 实现武器系统核心

  - [x] 31.1 创建武器类型定义
    - 定义 WeaponType, BulletType, WeaponConfig 接口
    - 定义 BulletInstance, BulletEffect 接口
    - 定义 WeaponState 接口
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 31.2 创建武器配置表
    - 配置 8 种武器类型数据
    - 配置子弹特效参数
    - 配置武器升级数据
    - _Requirements: 11.5, 12.1-12.6_

  - [x] 31.3 创建 WeaponSystem
    - 实现 createWeapon() 方法创建武器实例
    - 实现 fireWeapon() 方法发射子弹
    - 实现 findTarget() 方法自动寻找目标
    - 实现 upgradeWeapon() 方法升级武器
    - _Requirements: 11.1, 11.5_

  - [ ]* 31.4 编写武器自动瞄准属性测试
    - **Property 30: Weapon Auto-Target**
    - **Validates: Requirements 11.1**

- [x] 32. 实现子弹系统

  - [x] 32.1 创建 BulletSystem
    - 实现 createBullet() 方法创建子弹
    - 实现 updateBullets() 方法更新子弹位置
    - 实现 checkBulletCollision() 方法检测碰撞
    - 实现 applyBulletDamage() 方法应用伤害
    - _Requirements: 11.3, 12.1_

  - [x] 32.2 实现子弹特效
    - 实现穿透效果 (piercing)
    - 实现爆炸效果 (explosive)
    - 实现燃烧效果 (incendiary)
    - 实现冷冻效果 (freezing)
    - 实现链式闪电效果 (chain_lightning)
    - 实现散射效果 (scatter)
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 32.3 编写穿透子弹属性测试
    - **Property 34: Piercing Bullet Continuation**
    - **Validates: Requirements 12.2**

  - [ ]* 32.4 编写爆炸子弹属性测试
    - **Property 35: Explosive Bullet Area Damage**
    - **Validates: Requirements 12.3**

  - [ ]* 32.5 编写冷冻效果属性测试
    - **Property 36: Freezing Bullet Slow Effect**
    - **Validates: Requirements 12.4**

  - [ ]* 32.6 编写燃烧效果属性测试
    - **Property 37: Burn Damage Over Time**
    - **Validates: Requirements 12.5**

- [ ] 33. Checkpoint - 确保武器系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 15: 丧尸波次系统

- [x] 34. 实现波次系统

  - [x] 34.1 创建波次类型定义
    - 定义 WaveConfig, WaveState 接口
    - 定义 BossConfig, BossAbility 接口
    - 定义 WaveReward 接口
    - _Requirements: 13.1, 13.4_

  - [x] 34.2 创建波次配置表
    - 配置波次触发距离
    - 配置波次丧尸组成
    - 配置 Boss 数据
    - 配置波次奖励
    - _Requirements: 13.1, 13.2, 13.4, 13.5_

  - [x] 34.3 创建 WaveSystem
    - 实现 checkWaveTrigger() 方法检测波次触发
    - 实现 startWave() 方法开始波次
    - 实现 updateWave() 方法更新波次状态
    - 实现 spawnWaveZombies() 方法生成波次丧尸
    - 实现 completeWave() 方法完成波次并发放奖励
    - _Requirements: 13.1, 13.2, 13.5_

  - [ ]* 34.4 编写波次触发属性测试
    - **Property 39: Wave Trigger at Distance**
    - **Validates: Requirements 13.1**

  - [ ]* 34.5 编写波次奖励属性测试
    - **Property 41: Wave Completion Reward**
    - **Validates: Requirements 13.5**

- [ ] 35. 实现 Boss 系统

  - [ ] 35.1 创建 BossSystem
    - 实现 spawnBoss() 方法生成 Boss
    - 实现 updateBoss() 方法更新 Boss 行为
    - 实现 useBossAbility() 方法使用 Boss 技能
    - 实现 defeatBoss() 方法击败 Boss 并发放奖励
    - _Requirements: 13.4_

- [ ] 36. Checkpoint - 确保波次系统正常工作
  - 确保所有测试通过，如有问题请询问用户

## Phase 16: Phaser 武器渲染

- [x] 37. 实现武器视觉效果

  - [x] 37.1 创建子弹精灵和动画
    - 创建各类子弹占位符精灵
    - 实现子弹飞行动画
    - 实现子弹命中特效
    - _Requirements: 11.3_

  - [x] 37.2 实现武器开火效果
    - 实现枪口闪光效果
    - 实现射击音效触发点
    - 实现武器瞄准线显示
    - _Requirements: 11.1_

  - [x] 37.3 实现特效渲染
    - 实现爆炸特效
    - 实现燃烧特效
    - 实现冷冻特效
    - 实现闪电特效
    - _Requirements: 12.3, 12.4, 12.5, 12.6_

  - [x] 37.4 集成武器系统到 MainScene
    - 在 MainScene 中初始化武器系统
    - 实现武器自动射击循环
    - 实现子弹与丧尸碰撞检测
    - 实现特效应用到丧尸
    - _Requirements: 11.1, 11.3_

- [ ] 38. 实现波次视觉效果

  - [ ] 38.1 创建波次 UI
    - 实现波次开始警告
    - 实现波次进度条
    - 实现 Boss 血条
    - _Requirements: 13.3_

  - [ ] 38.2 创建 Boss 精灵
    - 创建 4 种 Boss 占位符精灵
    - 实现 Boss 技能特效
    - 实现 Boss 击败动画
    - _Requirements: 13.4_

- [ ] 39. Checkpoint - 确保视觉效果正常
  - 确保所有测试通过，如有问题请询问用户

## Phase 17: 武器 UI 界面

- [ ] 40. 创建武器管理界面

  - [ ] 40.1 创建 WeaponPanel 组件
    - 实现已安装武器列表
    - 实现武器详情显示
    - 实现武器升级按钮
    - _Requirements: 11.5_

  - [ ] 40.2 创建弹药显示
    - 在 HUD 中添加弹药显示
    - 实现弹药不足警告
    - 实现武器冷却指示器
    - _Requirements: 11.2, 11.4_

- [ ] 41. Final Checkpoint - 确保武器系统完整
  - 确保所有测试通过，如有问题请询问用户

## Phase 18: 部署配置

- [x] 42. 配置部署

  - [x] 42.1 配置 Vercel 部署
    - 创建 vercel.json 配置文件
    - 配置构建命令和输出目录
    - 配置环境变量
    - _Requirements: 部署_

  - [ ]* 42.2 配置 GitHub Actions (可选)
    - 创建 CI 工作流
    - 配置自动测试
    - 配置自动部署
    - _Requirements: 部署_
