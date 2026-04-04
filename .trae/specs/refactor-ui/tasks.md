# Tasks

- [x] Task 1: Create unified CSS variables file
  - [x] SubTask 1.1: Create `static/css/variables.css` with consolidated CSS variables
  - [x] SubTask 1.2: Remove duplicate variable definitions from `index.css`
  - [x] SubTask 1.3: Remove duplicate variable definitions from `downloads.css`
  - [x] SubTask 1.4: Remove duplicate variable definitions from `main.css`
  - [x] SubTask 1.5: Add import statement to all HTML files

- [x] Task 2: Simplify animation system
  - [x] SubTask 2.1: Remove `gradientBG` animation from body (use static gradient)
  - [x] SubTask 2.2: Remove float animation from non-essential elements
  - [x] SubTask 2.3: Consolidate `fadeInUp`, `fadeIn`, `slideDown` into single animation
  - [x] SubTask 2.4: Remove `::before` light sweep effects from cards
  - [x] SubTask 2.5: Simplify hover transform effects

- [x] Task 3: Clean up CSS code
  - [x] SubTask 3.1: Remove unused CSS selectors from `index.css`
  - [x] SubTask 3.2: Remove unused CSS selectors from `animation-additions.css`
  - [x] SubTask 3.3: Consolidate similar card styles across files
  - [x] SubTask 3.4: Simplify shadow system (reduce from 4 levels to 2)
  - [x] SubTask 3.5: Remove redundant responsive breakpoints

- [x] Task 4: Simplify JavaScript code
  - [x] SubTask 4.1: Remove theme change notification from `index.js`
  - [x] SubTask 4.2: Consolidate throttle function definitions (currently defined twice)
  - [x] SubTask 4.3: Remove duplicate EmailPopup initialization
  - [x] SubTask 4.4: Simplify scroll reveal logic
  - [x] SubTask 4.5: Remove unused parallax background function

- [x] Task 5: Simplify color scheme
  - [x] SubTask 5.1: Reduce gradient color stops from 3-5 to 2
  - [x] SubTask 5.2: Simplify card backgrounds (remove multiple gradient layers)
  - [x] SubTask 5.3: Standardize text colors across components
  - [x] SubTask 5.4: Simplify button styles (remove multiple gradient backgrounds)

- [ ] Task 6: Test and verify
  - [ ] SubTask 6.1: Test all pages in Chrome browser
  - [ ] SubTask 6.2: Verify theme toggle functionality
  - [ ] SubTask 6.3: Verify email popup functionality
  - [ ] SubTask 6.4: Test responsive design on mobile viewport
  - [ ] SubTask 6.5: Verify download page functionality

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 1, Task 2, Task 3, Task 4, Task 5]
