const vscode = require('vscode');

// Store active page editors untuk sync
const activePageEditors = new Map();

function activate(context) {
    console.log('Paguni extension is now active!');

    const pageProvider = new PageExplorerProvider();
    
    const treeView = vscode.window.createTreeView('pageExplorer', {
        treeDataProvider: pageProvider,
        showCollapseAll: true
    });
    
    context.subscriptions.push(treeView);

    // ============ CREATE PAGE COMMANDS ============
    
    // Command: Create Complete Page (pembuka + konten + penutup)
    let createCompletePageCommand = vscode.commands.registerCommand('extension.createCompletePage', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        // Minta nama page
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
        
        // Pilih format komentar
        const format = await vscode.window.showQuickPick([
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' },
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' },
            { label: 'JS Comment', value: 'js', description: '// ## Page Name ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name ## */' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        // Buat marker berdasarkan format
        let startMarker, endMarker;
        const trimmedName = pageName.trim();
        
        switch (format.value) {
            case 'plain':
                startMarker = `## Page ${trimmedName} ##`;
                endMarker = `## Page ${trimmedName} End ##`;
                break;
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
            default:
                startMarker = `## Page ${trimmedName} ##`;
                endMarker = `## Page ${trimmedName} End ##`;
        }
        
        // Template konten
        const template = `${startMarker}\n// Your content here\n${endMarker}`;
        
        // Insert di posisi kursor
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, template);
        });
        
        vscode.window.showInformationMessage(`✅ Created complete page: "${trimmedName}"`);
    });
    
    // Command: Create Page Opener (start marker only)
    let createPageOpenerCommand = vscode.commands.registerCommand('extension.createPageOpener', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        // Minta nama page
        const pageName = await vscode.window.showInputBox({
            prompt: 'Enter page name for opener',
            placeHolder: 'e.g., Home, About Us, Contact',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Page name cannot be empty';
                }
                return null;
            }
        });
        
        if (!pageName) return;
        
        // Pilih format komentar
        const format = await vscode.window.showQuickPick([
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' },
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' },
            { label: 'JS Comment', value: 'js', description: '// ## Page Name ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name ## */' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        // Buat opener marker
        let opener;
        const trimmedName = pageName.trim();
        
        switch (format.value) {
            case 'plain':
                opener = `## Page ${trimmedName} ##`;
                break;
            case 'html':
                opener = `<!-- ## Page ${trimmedName} ## -->`;
                break;
            case 'js':
                opener = `// ## Page ${trimmedName} ##`;
                break;
            case 'multiline':
                opener = `/* ## Page ${trimmedName} ## */`;
                break;
            default:
                opener = `## Page ${trimmedName} ##`;
        }
        
        // Insert di posisi kursor
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, opener);
        });
        
        // Pindahkan kursor ke baris berikutnya untuk memudahkan pengetikan konten
        const newPosition = editor.selection.active.translate(1, 0);
        editor.selection = new vscode.Selection(newPosition, newPosition);
        
        vscode.window.showInformationMessage(`✅ Created page opener: "${trimmedName}"`);
    });
    
    // Command: Create Page Closer (end marker only)
    let createPageCloserCommand = vscode.commands.registerCommand('extension.createPageCloser', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        // Minta nama page
        const pageName = await vscode.window.showInputBox({
            prompt: 'Enter page name for closer',
            placeHolder: 'e.g., Home, About Us, Contact',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Page name cannot be empty';
                }
                return null;
            }
        });
        
        if (!pageName) return;
        
        // Pilih format komentar
        const format = await vscode.window.showQuickPick([
            { label: 'No Comment', value: 'plain', description: '## Page Name End ##' },
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name End ## -->' },
            { label: 'JS Comment', value: 'js', description: '// ## Page Name End ##' },
            { label: 'Multiline Comment', value: 'multiline', description: '/* ## Page Name End ## */' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        // Buat closer marker
        let closer;
        const trimmedName = pageName.trim();
        
        switch (format.value) {
            case 'plain':
                closer = `## Page ${trimmedName} End ##`;
                break;
            case 'html':
                closer = `<!-- ## Page ${trimmedName} End ## -->`;
                break;
            case 'js':
                closer = `// ## Page ${trimmedName} End ##`;
                break;
            case 'multiline':
                closer = `/* ## Page ${trimmedName} End ## */`;
                break;
            default:
                closer = `## Page ${trimmedName} End ##`;
        }
        
        // Insert di posisi kursor
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, closer);
        });
        
        vscode.window.showInformationMessage(`✅ Created page closer: "${trimmedName}"`);
    });
    
    // Command: Create Multiple Pages at Once
    let createMultiplePagesCommand = vscode.commands.registerCommand('extension.createMultiplePages', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found!');
            return;
        }
        
        // Minta daftar nama page (pisahkan dengan koma)
        const pageNamesInput = await vscode.window.showInputBox({
            prompt: 'Enter page names separated by commas',
            placeHolder: 'Home, About, Contact, Products',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Page names cannot be empty';
                }
                return null;
            }
        });
        
        if (!pageNamesInput) return;
        
        const pageNames = pageNamesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);
        
        if (pageNames.length === 0) return;
        
        // Pilih format
        const format = await vscode.window.showQuickPick([
            { label: 'No Comment', value: 'plain', description: '## Page Name ##' },
            { label: 'HTML Comment', value: 'html', description: '<!-- ## Page Name ## -->' }
        ], {
            placeHolder: 'Select comment format'
        });
        
        if (!format) return;
        
        // Buat semua page
        let pagesContent = '';
        for (const pageName of pageNames) {
            let startMarker, endMarker;
            
            if (format.value === 'plain') {
                startMarker = `## Page ${pageName} ##`;
                endMarker = `## Page ${pageName} End ##`;
            } else {
                startMarker = `<!-- ## Page ${pageName} ## -->`;
                endMarker = `<!-- ## Page ${pageName} End ## -->`;
            }
            
            pagesContent += `${startMarker}\n// Content for ${pageName}\n${endMarker}\n\n`;
        }
        
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, pagesContent);
        });
        
        vscode.window.showInformationMessage(`✅ Created ${pageNames.length} pages`);
    });
    
    // ============ EXISTING COMMANDS ============
    
    // Command: List Pages
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
            vscode.window.showInformationMessage('No pages found. Format: ## Page Nama ## ... ## Page Nama End ##');
            return;
        }

        const items = pages.map(page => ({
            label: `📄 ${page.pageName}`,
            description: `Lines ${page.startLine + 1}-${page.endLine + 1}`,
            detail: page.originalText,
            page: page
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a page to open',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            await openPageWithSync(editor.document, selected.page);
        }
    });

    // Command: Refresh Pages
    let refreshCommand = vscode.commands.registerCommand('extension.refreshPages', () => {
        pageProvider.refresh();
        vscode.window.showInformationMessage('Pages list refreshed!');
    });

    // Command: Open Page with Sync
    let openPageSyncCommand = vscode.commands.registerCommand('extension.openPageSync', async (param) => {
        let targetPage = null;
        
        if (param && param.pageData) {
            targetPage = param.pageData;
        } else if (param && param.page) {
            targetPage = param.page;
        } else if (param) {
            targetPage = param;
        }
        
        if (!targetPage && vscode.window.activeTextEditor) {
            const editor = vscode.window.activeTextEditor;
            const cursorPosition = editor.selection.active;
            const pages = parsePages(editor.document);
            targetPage = pages.find(p => 
                cursorPosition.line >= p.startLine && 
                cursorPosition.line <= p.endLine
            );
        }
        
        if (!targetPage) {
            vscode.window.showErrorMessage('No page selected!');
            return;
        }
        
        const originalDoc = vscode.window.activeTextEditor.document;
        await openPageWithSync(originalDoc, targetPage);
    });

    // Command: Sync All Open Pages
    let syncAllCommand = vscode.commands.registerCommand('extension.syncAllPages', async () => {
        let syncedCount = 0;
        for (const [uri, data] of activePageEditors) {
            try {
                await syncPageToOriginal(data.editor, data.page, data.originalDoc);
                syncedCount++;
            } catch (error) {
                console.error(`Failed to sync ${uri}:`, error);
            }
        }
        vscode.window.showInformationMessage(`Synced ${syncedCount} page(s) to original file`);
    });

    // Command: Close All Page Editors
    let closeAllPagesCommand = vscode.commands.registerCommand('extension.closeAllPages', async () => {
        for (const [uri, data] of activePageEditors) {
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
        activePageEditors.clear();
        vscode.window.showInformationMessage('Closed all page editors');
    });

    context.subscriptions.push(
        createCompletePageCommand,
        createPageOpenerCommand,
        createPageCloserCommand,
        createMultiplePagesCommand,
        listPagesCommand, 
        refreshCommand,
        openPageSyncCommand,
        syncAllCommand,
        closeAllPagesCommand
    );

    // Listen untuk perubahan di page editor (auto-sync)
    vscode.workspace.onDidChangeTextDocument((event) => {
        const uri = event.document.uri.toString();
        if (activePageEditors.has(uri)) {
            const data = activePageEditors.get(uri);
            clearTimeout(data.timeout);
            data.timeout = setTimeout(() => {
                syncPageToOriginal(data.editor, data.page, data.originalDoc);
            }, 500);
        }
    });

    // Cleanup ketika editor ditutup
    vscode.workspace.onDidCloseTextDocument((document) => {
        const uri = document.uri.toString();
        if (activePageEditors.has(uri)) {
            const data = activePageEditors.get(uri);
            clearTimeout(data.timeout);
            if (data.statusBarItem) {
                data.statusBarItem.dispose();
            }
            activePageEditors.delete(uri);
        }
    });

    // Refresh ketika dokumen berubah
    vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document && !activePageEditors.has(event.document.uri.toString())) {
            pageProvider.refresh();
        }
    });

    vscode.window.onDidChangeActiveTextEditor(() => {
        pageProvider.refresh();
    });
}

// ============ EXISTING FUNCTIONS (same as before) ============

async function openPageWithSync(originalDoc, page, viewColumn = vscode.ViewColumn.Beside) {
    const lines = originalDoc.getText().split('\n');
    const pageLines = lines.slice(page.startLine, page.endLine + 1);
    const pageContent = pageLines.join('\n');
    
    const originalFileName = originalDoc.fileName.replace(/\.\w+$/, '');
    const extension = originalDoc.fileName.split('.').pop();
    const fileName = `${originalFileName}_${page.pageName.replace(/\s+/g, '_')}.${extension}`;
    
    const pageDocument = await vscode.workspace.openTextDocument({
        content: pageContent,
        language: originalDoc.languageId
    });
    
    const pageEditor = await vscode.window.showTextDocument(pageDocument, {
        viewColumn: viewColumn,
        preview: false,
        preserveFocus: false
    });
    
    const uri = pageDocument.uri.toString();
    activePageEditors.set(uri, {
        editor: pageEditor,
        page: page,
        originalDoc: originalDoc,
        originalUri: originalDoc.uri.toString(),
        timeout: null
    });
    
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `$(sync) Syncing: ${page.pageName}`;
    statusBarItem.tooltip = `Auto-syncing to original file: ${originalDoc.fileName}`;
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBarItem.show();
    
    activePageEditors.get(uri).statusBarItem = statusBarItem;
    
    highlightMarkers(pageEditor, pageLines);
    
    vscode.window.showInformationMessage(
        `📄 Opened "${page.pageName}" with auto-sync enabled`,
        'Go to Original'
    ).then(selection => {
        if (selection === 'Go to Original') {
            vscode.window.showTextDocument(originalDoc, vscode.ViewColumn.One);
        }
    });
    
    return pageEditor;
}

async function syncPageToOriginal(pageEditor, page, originalDoc) {
    try {
        const editedContent = pageEditor.document.getText();
        const editedLines = editedContent.split('\n');
        
        const originalContent = originalDoc.getText();
        const originalLines = originalContent.split('\n');
        
        const newLines = [
            ...originalLines.slice(0, page.startLine),
            ...editedLines,
            ...originalLines.slice(page.endLine + 1)
        ];
        
        const newContent = newLines.join('\n');
        
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(originalLines.length, 0)
        );
        edit.replace(originalDoc.uri, fullRange, newContent);
        
        await vscode.workspace.applyEdit(edit);
        
        const newEndLine = page.startLine + editedLines.length - 1;
        if (newEndLine !== page.endLine) {
            page.endLine = newEndLine;
        }
        
        const data = activePageEditors.get(pageEditor.document.uri.toString());
        if (data && data.statusBarItem) {
            data.statusBarItem.text = `$(check) Synced: ${page.pageName}`;
            data.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            setTimeout(() => {
                if (data.statusBarItem) {
                    data.statusBarItem.text = `$(sync) Syncing: ${page.pageName}`;
                    data.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                }
            }, 2000);
        }
        
        return true;
    } catch (error) {
        console.error('Sync failed:', error);
        vscode.window.showErrorMessage(`Failed to sync "${page.pageName}": ${error.message}`);
        return false;
    }
}

function highlightMarkers(editor, pageLines) {
    const startMarkerRange = new vscode.Range(0, 0, 0, pageLines[0].length);
    const endMarkerRange = new vscode.Range(
        pageLines.length - 1, 
        0, 
        pageLines.length - 1, 
        pageLines[pageLines.length - 1].length
    );
    
    const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(100, 200, 100, 0.15)',
        borderRadius: '3px',
        fontStyle: 'italic'
    });
    
    editor.setDecorations(decorationType, [startMarkerRange, endMarkerRange]);
}

function parsePages(document) {
    const pages = [];
    const lines = document.getText().split('\n');
    
    const startPatterns = [
        { regex: /^##\s*Page\s+(.+?)\s*##$/i, type: 'plain' },
        { regex: /^<!--\s*##\s*Page\s+(.+?)\s*##\s*-->$/i, type: 'html' },
        { regex: /^\/\/\s*##\s*Page\s+(.+?)\s*##$/i, type: 'js' },
        { regex: /^\/\*\s*##\s*Page\s+(.+?)\s*##\s*\*\/$/i, type: 'multiline' }
    ];
    
    const endPatterns = [
        { regex: /^##\s*Page\s+(.+?)\s+End\s*##$/i, type: 'plain' },
        { regex: /^<!--\s*##\s*Page\s+(.+?)\s+End\s*##\s*-->$/i, type: 'html' },
        { regex: /^\/\/\s*##\s*Page\s+(.+?)\s+End\s*##$/i, type: 'js' },
        { regex: /^\/\*\s*##\s*Page\s+(.+?)\s+End\s*##\s*\*\/$/i, type: 'multiline' }
    ];
    
    let currentPage = null;
    let currentPatternType = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        if (!currentPage) {
            for (const pattern of startPatterns) {
                const match = trimmedLine.match(pattern.regex);
                if (match) {
                    const pageName = match[1].trim();
                    currentPage = {
                        pageName: pageName,
                        originalText: trimmedLine,
                        startLine: i,
                        endLine: -1,
                        contentLength: 0,
                        patternType: pattern.type
                    };
                    currentPatternType = pattern.type;
                    break;
                }
            }
        } 
        else {
            const matchingEndPattern = endPatterns.find(p => p.type === currentPatternType);
            if (matchingEndPattern) {
                const endMatch = trimmedLine.match(matchingEndPattern.regex);
                if (endMatch) {
                    const endPageName = endMatch[1].trim();
                    if (endPageName === currentPage.pageName) {
                        currentPage.endLine = i;
                        const contentLines = lines.slice(currentPage.startLine, i + 1);
                        currentPage.contentLength = contentLines.join('\n').length;
                        pages.push(currentPage);
                        currentPage = null;
                        currentPatternType = null;
                    }
                }
            }
            
            if (currentPage && currentPage.endLine === -1) {
                for (const pattern of endPatterns) {
                    const endMatch = trimmedLine.match(pattern.regex);
                    if (endMatch) {
                        const endPageName = endMatch[1].trim();
                        if (endPageName === currentPage.pageName) {
                            currentPage.endLine = i;
                            const contentLines = lines.slice(currentPage.startLine, i + 1);
                            currentPage.contentLength = contentLines.join('\n').length;
                            pages.push(currentPage);
                            currentPage = null;
                            currentPatternType = null;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    if (currentPage) {
        currentPage.endLine = lines.length - 1;
        const contentLines = lines.slice(currentPage.startLine);
        currentPage.contentLength = contentLines.join('\n').length;
        pages.push(currentPage);
    }
    
    return pages;
}

function navigateToPage(editor, page) {
    const position = new vscode.Position(page.startLine, 0);
    const selection = new vscode.Selection(position, position);
    editor.selection = selection;
    editor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
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
                return [new PageTreeItem('📁 No active editor', 'Open a file to see pages', vscode.TreeItemCollapsibleState.None)];
            }
            
            const pages = parsePages(editor.document);
            
            if (pages.length === 0) {
                return [new PageTreeItem('📄 No pages found', 'Use format: ## Page Nama ## ... ## Page Nama End ##', vscode.TreeItemCollapsibleState.None)];
            }
            
            const pageItems = pages.map(page => {
                const item = new PageTreeItem(
                    `📄 ${page.pageName}`,
                    `Lines ${page.startLine + 1}-${page.endLine + 1}`,
                    vscode.TreeItemCollapsibleState.None
                );
                item.pageData = page;
                item.iconPath = new vscode.ThemeIcon('book');
                item.contextValue = 'pageItem';
                item.tooltip = `Click to open "${page.pageName}" with auto-sync`;
                item.command = {
                    command: 'extension.openPageSync',
                    title: 'Open Page with Sync',
                    arguments: [{ page: page }]
                };
                return item;
            });
            
            const summaryItem = new PageTreeItem(
                `📊 Total: ${pages.length} page(s)`,
                `Found ${pages.length} pages`,
                vscode.TreeItemCollapsibleState.None
            );
            summaryItem.iconPath = new vscode.ThemeIcon('info');
            
            const syncAllItem = new PageTreeItem(
                `🔄 Sync All Open Pages`,
                `Sync all open page editors to original file`,
                vscode.TreeItemCollapsibleState.None
            );
            syncAllItem.iconPath = new vscode.ThemeIcon('sync');
            syncAllItem.command = {
                command: 'extension.syncAllPages',
                title: 'Sync All Pages'
            };
            
            const closeAllItem = new PageTreeItem(
                `❌ Close All Page Editors`,
                `Close all open page editors`,
                vscode.TreeItemCollapsibleState.None
            );
            closeAllItem.iconPath = new vscode.ThemeIcon('close-all');
            closeAllItem.command = {
                command: 'extension.closeAllPages',
                title: 'Close All Pages'
            };
            
            return [summaryItem, syncAllItem, closeAllItem, ...pageItems];
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
        if (data.statusBarItem) {
            data.statusBarItem.dispose();
        }
        clearTimeout(data.timeout);
    }
    activePageEditors.clear();
}

module.exports = {
    activate,
    deactivate
};