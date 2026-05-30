const vscode = require('vscode');

// Store active page editors
const activePageEditors = new Map();
let isSyncing = false;

function activate(context) {
    console.log('Paguni extension activated');

    const pageProvider = new PageExplorerProvider();
    
    const treeView = vscode.window.createTreeView('pageExplorer', {
        treeDataProvider: pageProvider,
        showCollapseAll: true
    });
    
    context.subscriptions.push(treeView);

    // ============ CREATE PAGE COMMANDS ============
    
    let createCompletePageCommand = vscode.commands.registerCommand('extension.createCompletePage', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        const pageName = await vscode.window.showInputBox({
            prompt: 'Enter page name',
            placeHolder: 'e.g., Home, About Us, Contact',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Page name cannot be empty';
                }
                return null;
            }
        });
        
        if (!pageName) return;
        
        const format = await vscode.window.showQuickPick([
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' },
            { label: 'JavaScript/CSS/PHP', value: 'js', description: '// ## Page Name ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name ## */' },
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' },
            { label: 'Python/Ruby', value: 'hash', description: '# ## Page Name ##' },
            { label: 'XML/ASP', value: 'xml', description: '<%-- ## Page Name ## --%>' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        let startMarker, endMarker;
        const trimmedName = pageName.trim();
        
        switch (format.value) {
            case 'html':
                startMarker = `<!-- ## Page ${trimmedName} ## -->`;
                endMarker = `<!-- ## Page ${trimmedName} End ## -->`;
                break;
            case 'js':
                startMarker = `// ## Page ${trimmedName} ##`;
                endMarker = `// ## Page ${trimmedName} End ##`;
                break;
            case 'multiline':
                startMarker = `/* ## Page ${trimmedName} ## */`;
                endMarker = `/* ## Page ${trimmedName} End ## */`;
                break;
            case 'plain':
                startMarker = `## Page ${trimmedName} ##`;
                endMarker = `## Page ${trimmedName} End ##`;
                break;
            case 'hash':
                startMarker = `# ## Page ${trimmedName} ##`;
                endMarker = `# ## Page ${trimmedName} End ##`;
                break;
            case 'xml':
                startMarker = `<%-- ## Page ${trimmedName} ## --%>`;
                endMarker = `<%-- ## Page ${trimmedName} End ## --%>`;
                break;
            default:
                startMarker = `## Page ${trimmedName} ##`;
                endMarker = `## Page ${trimmedName} End ##`;
        }
        
        const template = `${startMarker}\n\n${endMarker}`;
        
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, template);
        });
        
        vscode.window.showInformationMessage(`✅ Created page: "${trimmedName}" (${format.label})`);
        pageProvider.refresh();
    });
    
    let createPageOpenerCommand = vscode.commands.registerCommand('extension.createPageOpener', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        const pageName = await vscode.window.showInputBox({
            prompt: 'Enter page name',
            placeHolder: 'e.g., Home, About Us, Contact'
        });
        
        if (!pageName) return;
        
        const format = await vscode.window.showQuickPick([
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' },
            { label: 'JavaScript/CSS/PHP', value: 'js', description: '// ## Page Name ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name ## */' },
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' },
            { label: 'Python/Ruby', value: 'hash', description: '# ## Page Name ##' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        const trimmedName = pageName.trim();
        let opener;
        
        switch (format.value) {
            case 'html':
                opener = `<!-- ## Page ${trimmedName} ## -->`;
                break;
            case 'js':
                opener = `// ## Page ${trimmedName} ##`;
                break;
            case 'multiline':
                opener = `/* ## Page ${trimmedName} ## */`;
                break;
            case 'plain':
                opener = `## Page ${trimmedName} ##`;
                break;
            case 'hash':
                opener = `# ## Page ${trimmedName} ##`;
                break;
            default:
                opener = `## Page ${trimmedName} ##`;
        }
        
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, opener);
        });
        
        vscode.window.showInformationMessage(`✅ Created page opener: "${trimmedName}"`);
        pageProvider.refresh();
    });
    
    let createPageCloserCommand = vscode.commands.registerCommand('extension.createPageCloser', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        const pageName = await vscode.window.showInputBox({
            prompt: 'Enter page name',
            placeHolder: 'e.g., Home, About Us, Contact'
        });
        
        if (!pageName) return;
        
        const format = await vscode.window.showQuickPick([
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name End ## -->' },
            { label: 'JavaScript/CSS/PHP', value: 'js', description: '// ## Page Name End ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name End ## */' },
            { label: 'No Comment', value: 'plain', description: '## Page Name End ##' },
            { label: 'Python/Ruby', value: 'hash', description: '# ## Page Name End ##' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        const trimmedName = pageName.trim();
        let closer;
        
        switch (format.value) {
            case 'html':
                closer = `<!-- ## Page ${trimmedName} End ## -->`;
                break;
            case 'js':
                closer = `// ## Page ${trimmedName} End ##`;
                break;
            case 'multiline':
                closer = `/* ## Page ${trimmedName} End ## */`;
                break;
            case 'plain':
                closer = `## Page ${trimmedName} End ##`;
                break;
            case 'hash':
                closer = `# ## Page ${trimmedName} End ##`;
                break;
            default:
                closer = `## Page ${trimmedName} End ##`;
        }
        
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, closer);
        });
        
        vscode.window.showInformationMessage(`✅ Created page closer: "${trimmedName}"`);
        pageProvider.refresh();
    });
    
    let createMultiplePagesCommand = vscode.commands.registerCommand('extension.createMultiplePages', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        const pageNamesInput = await vscode.window.showInputBox({
            prompt: 'Enter page names separated by commas',
            placeHolder: 'Home, About, Contact'
        });
        
        if (!pageNamesInput) return;
        
        const pageNames = pageNamesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);
        if (pageNames.length === 0) return;
        
        const format = await vscode.window.showQuickPick([
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' },
            { label: 'JavaScript/CSS/PHP', value: 'js', description: '// ## Page Name ##' },
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        let pagesContent = '';
        for (const pageName of pageNames) {
            if (format.value === 'html') {
                pagesContent += `<!-- ## Page ${pageName} ## -->\n\n<!-- ## Page ${pageName} End ## -->\n\n`;
            } else if (format.value === 'js') {
                pagesContent += `// ## Page ${pageName} ##\n\n// ## Page ${pageName} End ##\n\n`;
            } else {
                pagesContent += `## Page ${pageName} ##\n\n## Page ${pageName} End ##\n\n`;
            }
        }
        
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, pagesContent);
        });
        
        vscode.window.showInformationMessage(`✅ Created ${pageNames.length} pages`);
        pageProvider.refresh();
    });
    
    // ============ LIST PAGES COMMAND ============
    
    let listPagesCommand = vscode.commands.registerCommand('extension.listPages', async (args) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }

        if (args && args.page) {
            navigateToPage(editor, args.page);
            return;
        }

        const pages = parsePages(editor.document);
        
        if (pages.length === 0) {
            vscode.window.showInformationMessage('No pages found. Format: ## Page Name ## ... ## Page Name End ##');
            return;
        }

        const items = pages.map(page => ({
            label: `📄 ${page.pageName}`,
            description: `${page.format} | Line ${page.startLine + 1} - ${page.endLine + 1}`,
            page: page
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a page to open',
            matchOnDescription: true
        });

        if (selected) {
            await openPageInEditor(editor.document, selected.page);
        }
    });

    // ============ OPEN PAGE ============
    
    let openPageCommand = vscode.commands.registerCommand('extension.openPageSync', async (param) => {
        let targetPage = null;
        
        if (param && param.pageData) {
            targetPage = param.pageData;
        } else if (param && param.page) {
            targetPage = param.page;
        } else if (param) {
            targetPage = param;
        }
        
        if (!targetPage) {
            vscode.window.showErrorMessage('No page selected!');
            return;
        }
        
        const originalDoc = vscode.window.activeTextEditor.document;
        await openPageInEditor(originalDoc, targetPage);
    });

    // ============ SYNC COMMANDS ============
    
    let refreshCommand = vscode.commands.registerCommand('extension.refreshPages', () => {
        pageProvider.refresh();
        vscode.window.showInformationMessage('Pages refreshed!');
    });

    let syncAllCommand = vscode.commands.registerCommand('extension.syncAllPages', async () => {
        let count = 0;
        for (const [uri, data] of activePageEditors) {
            try {
                await syncPageToOriginal(data);
                count++;
            } catch (error) {
                console.error(`Sync failed:`, error);
            }
        }
        vscode.window.showInformationMessage(`Synced ${count} page(s)`);
    });

    context.subscriptions.push(
        createCompletePageCommand,
        createPageOpenerCommand,
        createPageCloserCommand,
        createMultiplePagesCommand,
        listPagesCommand,
        refreshCommand,
        openPageCommand,
        syncAllCommand
    );

    // ============ AUTO-SYNC: Page Editor -> Original ============
    
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (isSyncing) return;
        
        const uri = event.document.uri.toString();
        if (activePageEditors.has(uri)) {
            const data = activePageEditors.get(uri);
            clearTimeout(data.timeout);
            data.timeout = setTimeout(() => {
                syncPageToOriginal(data);
            }, 300);
        }
    });

    // ============ AUTO-SYNC: Original -> Page Editor ============
    
    vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (isSyncing) return;
        
        for (const [uri, data] of activePageEditors) {
            if (event.document.uri.toString() === data.originalUri) {
                clearTimeout(data.originalTimeout);
                data.originalTimeout = setTimeout(async () => {
                    await syncOriginalToPageEditor(data);
                }, 300);
            }
        }
        
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document && !activePageEditors.has(event.document.uri.toString())) {
            pageProvider.refresh();
        }
    });

    // ============ CLEANUP ============
    
    vscode.workspace.onDidCloseTextDocument((document) => {
        const uri = document.uri.toString();
        if (activePageEditors.has(uri)) {
            const data = activePageEditors.get(uri);
            clearTimeout(data.timeout);
            clearTimeout(data.originalTimeout);
            if (data.statusBarItem) data.statusBarItem.dispose();
            activePageEditors.delete(uri);
        }
    });

    vscode.window.onDidChangeActiveTextEditor(() => {
        pageProvider.refresh();
    });
}

// ============ CORE FUNCTIONS ============

async function openPageInEditor(originalDoc, page, viewColumn = vscode.ViewColumn.Beside) {
    // Ambil konten page dari original file
    const lines = originalDoc.getText().split('\n');
    const pageLines = lines.slice(page.startLine, page.endLine + 1);
    const pageContent = pageLines.join('\n');
    
    // Buat dokumen baru
    const doc = await vscode.workspace.openTextDocument({
        content: pageContent,
        language: originalDoc.languageId
    });
    
    const editor = await vscode.window.showTextDocument(doc, {
        viewColumn: viewColumn,
        preview: false,
        preserveFocus: false
    });
    
    // Simpan data
    const uri = doc.uri.toString();
    activePageEditors.set(uri, {
        editor: editor,
        page: { ...page },
        originalDoc: originalDoc,
        originalUri: originalDoc.uri.toString(),
        originalStartLine: page.startLine,
        originalEndLine: page.endLine,
        timeout: null,
        originalTimeout: null,
        statusBarItem: null
    });
    
    // Status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `$(sync) ${page.pageName}`;
    statusBarItem.tooltip = `Editing: ${page.pageName} (${page.format})`;
    statusBarItem.show();
    activePageEditors.get(uri).statusBarItem = statusBarItem;
    
    // Highlight markers
    highlightMarkers(editor, pageLines);
    
    vscode.window.showInformationMessage(`Opened "${page.pageName}"`);
    return editor;
}

async function syncPageToOriginal(data) {
    if (isSyncing) return;
    isSyncing = true;
    
    try {
        const pageEditor = data.editor;
        const page = data.page;
        const originalDoc = data.originalDoc;
        
        // Baca konten dari page editor
        const editedContent = pageEditor.document.getText();
        const editedLines = editedContent.split('\n');
        
        // Baca konten original
        const originalContent = originalDoc.getText();
        const originalLines = originalContent.split('\n');
        
        // Cari ulang posisi page di original
        const currentPages = parsePages(originalDoc);
        const currentPage = currentPages.find(p => p.pageName === page.pageName);
        
        if (!currentPage) {
            console.warn(`Page "${page.pageName}" not found in original`);
            return;
        }
        
        // Update posisi
        const startLine = currentPage.startLine;
        const endLine = currentPage.endLine;
        
        // HANYA ganti bagian dalam marker, sisanya tetap
        const newLines = [
            ...originalLines.slice(0, startLine),
            ...editedLines,
            ...originalLines.slice(endLine + 1)
        ];
        
        const newContent = newLines.join('\n');
        
        // Hanya sync jika ada perubahan
        if (newContent !== originalContent) {
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(originalLines.length, 0)
            );
            edit.replace(originalDoc.uri, fullRange, newContent);
            await vscode.workspace.applyEdit(edit);
            
            // Update status bar
            if (data.statusBarItem) {
                data.statusBarItem.text = `$(check) ${page.pageName}`;
                setTimeout(() => {
                    if (data.statusBarItem) data.statusBarItem.text = `$(sync) ${page.pageName}`;
                }, 1500);
            }
        }
        
        // Refresh explorer
        const provider = new PageExplorerProvider();
        provider.refresh();
        
    } catch (error) {
        console.error('Sync to original error:', error);
    } finally {
        isSyncing = false;
    }
}

async function syncOriginalToPageEditor(data) {
    if (isSyncing) return;
    isSyncing = true;
    
    try {
        const originalDoc = data.originalDoc;
        const page = data.page;
        const pageEditor = data.editor;
        
        // Parse ulang original
        const pages = parsePages(originalDoc);
        const currentPage = pages.find(p => p.pageName === page.pageName);
        
        if (!currentPage) {
            console.warn(`Page "${page.pageName}" not found`);
            return;
        }
        
        // Update posisi di data
        page.startLine = currentPage.startLine;
        page.endLine = currentPage.endLine;
        
        // Ambil konten dari original (HANYA dalam marker)
        const originalLines = originalDoc.getText().split('\n');
        const pageLines = originalLines.slice(page.startLine, page.endLine + 1);
        const newContent = pageLines.join('\n');
        
        const currentContent = pageEditor.document.getText();
        
        if (newContent !== currentContent) {
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(pageEditor.document.lineCount, 0)
            );
            edit.replace(pageEditor.document.uri, fullRange, newContent);
            await vscode.workspace.applyEdit(edit);
            
            if (data.statusBarItem) {
                data.statusBarItem.text = `$(sync) ${page.pageName}`;
            }
        }
        
    } catch (error) {
        console.error('Sync to editor error:', error);
    } finally {
        isSyncing = false;
    }
}

function highlightMarkers(editor, pageLines) {
    if (pageLines.length === 0) return;
    
    const startRange = new vscode.Range(0, 0, 0, pageLines[0].length);
    const endRange = new vscode.Range(
        pageLines.length - 1, 
        0, 
        pageLines.length - 1, 
        pageLines[pageLines.length - 1].length
    );
    
    const decoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(100, 200, 100, 0.15)',
        borderRadius: '3px'
    });
    
    editor.setDecorations(decoration, [startRange, endRange]);
}

function parsePages(document) {
    const pages = [];
    const lines = document.getText().split('\n');
    
    // Pattern untuk berbagai format komentar
    const patterns = [
        // HTML: <!-- ## Page Name ## -->
        { start: /^<!--\s*##\s*Page\s+(.+?)\s*##\s*-->$/i, end: /^<!--\s*##\s*Page\s+(.+?)\s+End\s*##\s*-->$/i, format: 'html' },
        
        // JavaScript/CSS/PHP single line: // ## Page Name ##
        { start: /^\/\/\s*##\s*Page\s+(.+?)\s*##$/i, end: /^\/\/\s*##\s*Page\s+(.+?)\s+End\s*##$/i, format: 'js' },
        
        // Multiline: /* ## Page Name ## */
        { start: /^\/\*\s*##\s*Page\s+(.+?)\s*##\s*\*\/$/i, end: /^\/\*\s*##\s*Page\s+(.+?)\s+End\s*##\s*\*\/$/i, format: 'multiline' },
        
        // Plain: ## Page Name ##
        { start: /^##\s*Page\s+(.+?)\s*##$/i, end: /^##\s*Page\s+(.+?)\s+End\s*##$/i, format: 'plain' },
        
        // Python/Ruby/PHP hash: # ## Page Name ##
        { start: /^#\s*##\s*Page\s+(.+?)\s*##$/i, end: /^#\s*##\s*Page\s+(.+?)\s+End\s*##$/i, format: 'hash' },
        
        // XML/ASP: <%-- ## Page Name ## --%>
        { start: /^<%--\s*##\s*Page\s+(.+?)\s*##\s*--%>$/i, end: /^<%--\s*##\s*Page\s+(.+?)\s+End\s*##\s*--%>$/i, format: 'xml' },
        
        // CSS multiline (sama dengan multiline)
        // SQL comment: -- ## Page Name ##
        { start: /^--\s*##\s*Page\s+(.+?)\s*##$/i, end: /^--\s*##\s*Page\s+(.+?)\s+End\s*##$/i, format: 'sql' }
    ];
    
    let currentPage = null;
    let currentPattern = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Cari start marker
        if (!currentPage) {
            for (const pattern of patterns) {
                const match = trimmedLine.match(pattern.start);
                if (match) {
                    currentPage = {
                        pageName: match[1].trim(),
                        originalText: line,
                        startLine: i,
                        endLine: -1,
                        format: pattern.format
                    };
                    currentPattern = pattern;
                    break;
                }
            }
        }
        
        // Cari end marker
        if (currentPage && currentPattern) {
            const match = trimmedLine.match(currentPattern.end);
            if (match) {
                const endName = match[1].trim();
                if (endName === currentPage.pageName) {
                    currentPage.endLine = i;
                    pages.push(currentPage);
                    currentPage = null;
                    currentPattern = null;
                }
            }
        }
    }
    
    // Handle page tanpa end marker
    if (currentPage) {
        currentPage.endLine = lines.length - 1;
        pages.push(currentPage);
    }
    
    console.log(`Found ${pages.length} pages:`, pages.map(p => `${p.pageName} (${p.format})`));
    return pages;
}

function navigateToPage(editor, page) {
    const position = new vscode.Position(page.startLine, 0);
    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenter);
    vscode.window.showInformationMessage(`✓ Navigated to "${page.pageName}"`);
}

class PageExplorerProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return [new PageTreeItem('📁 No active editor', '', vscode.TreeItemCollapsibleState.None)];
            }
            
            const pages = parsePages(editor.document);
            
            if (pages.length === 0) {
                return [new PageTreeItem('📄 No pages found', 'Use: ## Page Name ## ... ## Page Name End ##', vscode.TreeItemCollapsibleState.None)];
            }
            
            // Ikon berdasarkan format
            const formatIcon = {
                'html': '$(code)',
                'js': '$(javascript)',
                'multiline': '$(comment)',
                'plain': '$(file-text)',
                'hash': '$(python)',
                'xml': '$(xml)',
                'sql': '$(database)'
            };
            
            const items = pages.map(page => {
                const icon = formatIcon[page.format] || '$(book)';
                const item = new PageTreeItem(
                    `${icon} ${page.pageName}`,
                    `${page.format} | Line ${page.startLine + 1} - ${page.endLine + 1}`,
                    vscode.TreeItemCollapsibleState.None
                );
                item.pageData = page;
                item.iconPath = new vscode.ThemeIcon('book');
                item.contextValue = 'pageItem';
                item.tooltip = `Click to open "${page.pageName}" (${page.format})`;
                item.command = {
                    command: 'extension.openPageSync',
                    title: 'Open Page',
                    arguments: [{ page: page }]
                };
                return item;
            });
            
            const summary = new PageTreeItem(
                `📊 Total: ${pages.length} page(s)`,
                '',
                vscode.TreeItemCollapsibleState.None
            );
            summary.iconPath = new vscode.ThemeIcon('info');
            
            const syncAll = new PageTreeItem(
                `🔄 Sync All Open Pages`,
                '',
                vscode.TreeItemCollapsibleState.None
            );
            syncAll.iconPath = new vscode.ThemeIcon('sync');
            syncAll.command = {
                command: 'extension.syncAllPages',
                title: 'Sync All Pages'
            };
            
            return [summary, syncAll, ...items];
        }
        return [];
    }
}

class PageTreeItem extends vscode.TreeItem {
    constructor(label, tooltip, collapsibleState) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.description = tooltip;
        this.pageData = null;
        this.contextValue = 'pageItem';
    }
}

function deactivate() {
    for (const [uri, data] of activePageEditors) {
        clearTimeout(data.timeout);
        clearTimeout(data.originalTimeout);
        if (data.statusBarItem) data.statusBarItem.dispose();
    }
    activePageEditors.clear();
}

module.exports = {
    activate,
    deactivate
};
