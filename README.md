# FlexiSite CMS - Frontend Foundation

A premium, scalable React application built for the FlexiSite No-Code Website Builder.

📘 **[Read the System Architecture Blueprint](./docs/architecture/SYSTEM_ARCHITECTURE.md)**
🎨 **[View UX/UI Design & Wireframes](./docs/design/UI_UX_WIREFRAMES.md)**
⚙️ **[Component Library & Rendering Engine](./docs/technical/COMPONENT_ARCHITECTURE.md)**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1.  **Clone the repository** (if not already local).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *Note: This project uses Tailwind CSS v4 (alpha). Ensure `tailwindcss`, `@tailwindcss/vite` are installed.*

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Folder Structure

```
/src
  /assets         # Static assets (images, icons)
  /components     # React Components
    /ui           # Reusable generic UI components (Buttons, Inputs)
    /builder      # Components specific to the Website Builder (Canvas, Panels)
    /common       # App-wide components (Sidebar, Topbar)
  /config         # Configuration files
  /context        # React Context (Theme, Auth)
  /hooks          # Custom Hooks
  /layouts        # Page Layouts (MainLayout)
  /screens        # Main Page Views (Dashboard, Builder)
  /services       # 
  /styles         # Global styles & Tailwind
  /utils          # Helper functions
```

## 🎨 Design System

This project uses **Tailwind CSS v4** with **Material UI** for complex interactions.

- **Theme**: Managed via `ThemeContext` and Tailwind dark mode.
- **Colors**: Defined in `src/styles/index.css` as CSS variables (e.g., `--color-primary`).
- **Icons**: Material UI Icons (`@mui/icons-material`) and native SVGs.

### Development Best Practices

1.  **Imports**: Use alias paths (e.g., `import Sidebar from '@components/common/Sidebar'`) instead of relative paths.
2.  **Styles**: Prefer Tailwind utility classes. For complex logical styles, use standard CSS in `@layer components` or CSS modules if absolutely necessary.
3.  **Components**: Keep components small and focused. Place standard UI elements in `@ui`.
4.  **Dark Mode**: Always verify designs in both Light and Dark modes. Use `dark:` prefix for dark mode specifics.

## 🛠 Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS 4.x
- **UI Lib**: Material UI (MUI) - *Used selectively*
- **Routing**: React Router DOM 6
- **Icons**: MUI Icons
