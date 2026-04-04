# UI Refactor Spec

## Why
当前UI界面存在视觉复杂度过高、代码冗余、性能优化不足等问题。通过重构实现更简洁的视觉设计和更高效的代码结构，提升用户体验和代码可维护性。

## What Changes
- 统一CSS变量系统，消除重复定义
- 简化动画效果，移除不必要的装饰元素
- 优化色彩方案，建立一致的视觉层次
- 清理冗余代码和未使用的样式
- 简化JavaScript逻辑，移除重复功能
- 优化交互流程，提升用户体验

## Impact
- Affected specs: UI视觉系统、交互逻辑、性能优化
- Affected code: 
  - `static/css/index.css`
  - `static/css/animation-additions.css`
  - `static/js/index.js`
  - `pyquick/static/css/main.css`
  - `data/static/css/downloads.css`
  - `data/static/js/common.js`

## ADDED Requirements

### Requirement: Unified CSS Variable System
The system SHALL provide a centralized CSS variable definition file that all pages reference, eliminating duplicate variable definitions across files.

#### Scenario: CSS Variables Consolidation
- **WHEN** developer needs to modify theme colors or spacing
- **THEN** changes are made in a single file and propagate to all pages

### Requirement: Simplified Animation System
The system SHALL reduce animation complexity by removing non-essential animations and consolidating similar animation definitions.

#### Scenario: Animation Optimization
- **WHEN** user visits any page
- **THEN** only essential animations are displayed, reducing CPU usage and improving performance

### Requirement: Clean Color Scheme
The system SHALL implement a simplified color palette with clear visual hierarchy, removing excessive gradient effects.

#### Scenario: Color Simplification
- **WHEN** user views the interface
- **THEN** colors are consistent, accessible, and visually cohesive across all pages

### Requirement: Code Deduplication
The system SHALL eliminate redundant CSS rules and JavaScript functions across all files.

#### Scenario: Code Cleanup
- **WHEN** developer reviews the codebase
- **THEN** no duplicate style definitions or JavaScript functions exist

## MODIFIED Requirements

### Requirement: Card Component Design
The card component SHALL have simplified hover effects with reduced transform and shadow complexity.

**Changes:**
- Remove `::before` light sweep animation
- Simplify hover transform from `translateY(-5px) scale(1.02)` to `translateY(-3px)`
- Reduce shadow complexity from `--shadow-xl` to `--shadow-md`

### Requirement: Theme Toggle Functionality
The theme toggle SHALL maintain functionality while reducing notification overhead.

**Changes:**
- Remove theme change notification popup
- Simplify transition effects
- Consolidate theme-related CSS variables

### Requirement: Email Popup Component
The email popup SHALL have a cleaner design with fewer decorative elements.

**Changes:**
- Remove gradient header background
- Simplify border and shadow styles
- Reduce animation complexity

## REMOVED Requirements

### Requirement: Excessive Background Animations
**Reason**: Background gradient animations consume significant CPU resources on lower-end devices.
**Migration**: Replace with static gradient or simplified subtle animation.

### Requirement: Card Light Sweep Effect
**Reason**: The `::before` pseudo-element animation adds visual noise without functional benefit.
**Migration**: Remove entirely, rely on simpler hover states.

### Requirement: Float Animation on Multiple Elements
**Reason**: Multiple simultaneous float animations create visual distraction.
**Migration**: Remove float animations from secondary elements, keep only on primary icons if necessary.

### Requirement: Redundant Theme Notification
**Reason**: Theme change notification popup adds unnecessary UI complexity.
**Migration**: Remove notification, rely on visual feedback from icon change.

### Requirement: Duplicate CSS Variable Definitions
**Reason**: Same variables defined in multiple files increase maintenance burden.
**Migration**: Create single `variables.css` file imported by all pages.
