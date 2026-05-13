# Apexnote 🚀

**Apexnote** is a professional, developer-first notepad extension designed for high-end productivity. It transforms your browser tab into a powerful desktop-grade workspace with a focus on speed, aesthetics, and code-centric features.

![Apexnote Banner](apex/public/icons/icon128.png)

## ✨ Key Features

- **Neo-Brutalist Aesthetic**: A bold, high-contrast design that stands out from generic, boring apps.
- **Pro Layout**: A full-width, full-height workspace that gives you the feel of a real desktop application.
- **Smart Snippets**: First-class support for code with auto-language detection and syntax highlighting (powered by PrismJS).
- **Markdown Power**: Real-time rendering for notes. Write in Markdown and toggle a beautiful Neo-Brutalist document preview.
- **Power-User Shortcuts**: Drive the app at light speed with Alt-based keyboard workflows.
- **Quick Actions**: Manage your notes faster with "Pin," "Copy," and "Delete" buttons that appear instantly on hover.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Alt + N` | Create New Note |
| `Alt + S` | Create New Snippet |
| `Alt + K` | Open Search Bar |
| `Alt + R` | Refresh Library |

## 🛠️ Installation

To use Apexnote locally or share it with others, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/Harkiratcodess/Notepad.git
cd Notepad/apex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Project
```bash
npm run build
```

### 4. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `dist` folder located inside the `apex` directory.

## 🏗️ How It Works

Apexnote is built with a modern tech stack to ensure performance and reliability:

- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) for a robust, type-safe UI.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for that sharp, custom Neo-Brutalist look.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for lightweight and fast global state.
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) for seamless document rendering.
- **Build Tool**: [Vite](https://vitejs.dev/) with the [vite-plugin-web-extension](https://github.com/aklinker1/vite-plugin-web-extension) to handle the Chrome extension manifest and assets.

## 🚀 Sharing with Others

If you want others to use your extension, you can:
1. **Share the Repo**: Send them the link to your GitHub. They can follow the "Installation" steps above.
2. **Zip the Dist**: You can zip the `apex/dist` folder and send it to them. They just need to unzip it and follow the **Load in Chrome** steps.
3. **Chrome Web Store**: Eventually, you can package this as a `.zip` and upload it to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) for public distribution!

---

Built with ❤️ by [Harkirat](https://github.com/Harkiratcodess)
