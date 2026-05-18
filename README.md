
# 📄 Paguni - Page Navigator for VS Code

> **Paguni** is a VS Code extension that helps you manage and navigate page sections within a single file. With real-time auto-sync, you can edit pages in separate editors and changes are automatically saved back to the original file! 🚀

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/Babangbabang/paguni)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📑 **Named Pages** | Use any name for your pages (not just numbers) |
| 🔄 **Real-time Auto-Sync** | Edit pages in separate editor, automatically saves to original file |
| 🎯 **Quick Navigation** | Jump to any page instantly |
| 📂 **Page Explorer** | View all pages in your file from the sidebar |
| ⌨️ **Shortcut Keys** | Create new pages quickly with keyboard shortcuts |
| 🎨 **Multiple Formats** | Supports HTML, JS, and plain comment formats |
| 🔍 **Smart Parsing** | Automatically detects pages without configuration |

---

## 📥 Installation



## Manual Install (VSIX)

1. Download paguni-0.0.1.vsix

2. Open VS Code → Extensions (Ctrl+Shift+X)

3. Click ... → Install from VSIX

4. Select the downloaded file

## From Source

git clone https://github.com/Babangbabang/paguni.git
cd paguni
npm install

## Press F5 to run extension development host


🚀 Usage


1. Create a New Page

Basic format:

<!-- ## Page Home ## -->
Your page content here...
<!-- ## Page Home End ## -->

Supported formats:

Format	        Example

Plain	        ## Page Home ##
HTML Comment	<!-- ## Page Home ## -->
JavaScript	    // ## Page Home ##
Multiline	    /* ## Page Home ## */

2. Open Page Explorer

Click the 📘 Paguni icon in the activity bar (left sidebar) to see all pages in your active file.

3. Edit Pages with Auto-Sync

Click a page in Page Explorer → opens in a side editor

Edit the page content → changes auto-sync to original file

Status bar shows sync status (🔄 Syncing / ✅ Synced)

4. Quick Navigation

Press Ctrl+Shift+G → select a page from the list → instantly navigate to that page.

⌨️ Keyboard      Shortcuts

Shortcut	        Command	                                    Function
Ctrl+Shift+P P	Create Complete Page	                Create full page (opener + content + closer)
Ctrl+Shift+P O	Create Page Opener	                    Create opener marker only ## Page X ##
Ctrl+Shift+P C	Create Page Closer	                    Create closer marker only ## Page X End ##
Ctrl+Shift+P M	Create Multiple Pages	                Create multiple pages at once
Ctrl+Shift+G	List Pages	                            Show all pages in Quick Pick menu


💡 Tip: Open Command Palette (Ctrl+Shift+P) and type "Page:" to see all available commands.

📝 Example

index.html before using Paguni:

<!DOCTYPE html>
<html>
<body>
    <!-- ## Page Home ## -->
    <h1>Welcome to Home Page</h1>
    <p>This is the home page content</p>
    <!-- ## Page Home End ## -->

    <!-- ## Page About ## -->
    <h1>About Us</h1>
    <p>Company information here</p>
    <!-- ## Page About End ## -->

    <!-- ## Page Contact ## -->
    <h1>Contact Us</h1>
    <p>Email: contact@example.com</p>
    <!-- ## Page Contact End ## -->
</body>
</html>

What you can do with Paguni:

1. Open Page Explorer → See 3 pages: Home, About, Contact

2. Click "Home" → Opens in side editor

3. Edit content → Auto-syncs to original file

4. Press Ctrl+Shift+G → Select "Contact" → Jump directly to Contact page



🎯 Use Cases

📝 Documentation
Split documentation in a single markdown file into easily navigable sections.

🎨 Multi-page HTML
Manage multiple "pages" in one HTML file for prototyping or single-file components.

📋 Notes Organizer
Organize notes in one file with separate pages (Work, Personal, Ideas, etc.).

🧪 Test Data
Store multiple test scenarios in one file and navigate easily.

🔧 Development

Prerequisites

Node.js 18+

VS Code 1.85.0+

Setup

# Clone repository
git clone https://github.com/Babangbabang/paguni.git
cd paguni

# Install dependencies
npm install

# Open in VS Code
code .

# Press F5 to run Extension Development Host

Build VSIX

npm install -g @vscode/vsce
vsce package
# Output: paguni-0.0.1.vsix

❓ FAQ
Q: Do page names have to be numbers?
A: No! You can use any name: Home, About Us, Contact, Chapter 1, etc.

Q: What file types are supported?
A: All text files: .html, .md, .txt, .js, .css, .json, etc.

Q: Do I have to write markers manually?
A: No! Use Ctrl+Shift+P P shortcut to create complete pages automatically.

Q: Does auto-sync work in real-time?
A: Yes! Every change in the page editor auto-saves to the original file within 500ms.

Q: What happens if I delete a marker?
A: The page will still be detected until the next closing marker. It's recommended to keep consistent formatting.

🐛 Known Issues
Pages without an End marker will include all lines until the end of file

Markers must be at the beginning of a line (no indentation)

Page names are case-sensitive

📄 License
MIT © Babangbabang

⭐ Support
If you like this extension, please:

⭐ Star this repository on GitHub

📝 Review on VS Code Marketplace

🔄 Share with fellow developers


**Enjoy!**
