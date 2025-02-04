import * as monaco from 'monaco-editor'

export type Theme = {
    name: string,
    monacoTheme: string,
    cssColors: { [color: string]: string }
}

export class ThemeManager {

    themes: Theme[] = [];
    currentTheme: Theme;

    constructor(private rootElement: HTMLDivElement) {
        this.initThemes();
        this.initEditorThemes();
        this.currentTheme = this.themes[0];
    }

    switchTheme(name: string) {
        for (let theme of this.themes) {
            if (theme.name == name) {
                this.internalSwitchTheme(theme);
                break;
            }
        }
    }

    internalSwitchTheme(theme: Theme) {
        monaco.editor.setTheme(theme.monacoTheme);

        // let root = document.documentElement;
        for (const key of Object.keys(theme.cssColors)) {
            const value = theme.cssColors[key]

            this.rootElement.style.setProperty(key, value);

        }

        this.currentTheme = theme;

    }

    initThemes() {

        this.themes.push({
            name: "dark",
            monacoTheme: "myCustomThemeDark",
            cssColors: {
                "--defaultPrintColor": "#ffffff",
                "--backgroundDark": "#1e1e1e",
                "--backgroundLight": "#252526",
                "--backgroundHeading": "#37373d",
                "--backgroundSelected": "#2a2d2e",
                "--fontColorNormal": "#c2cccc",
                "--fontColorLight": "#e7e7e7",
                "--slider": "#414141",
                "--loginButtonBackgrond": "#59a15d",
                "--loginButtonFontColor": "#000000",
                "--loginMessageColor": "rgb(122, 48, 48)",
                "--loginButtonHover": "#63a867",
                "--loginButtonActive": "#94ffd1",
                "--scrollbar": "#1e1e1e",
                "--scrollbar-thumb": "#3e3e3e",
                "--scrollbar-thumb-hover": "#5e5e5e",
                "--scrollbar-thumb-active": "#7e7e7e",
                "--submenu-hover": "#094771",
                "--submenu-color": "#ffffff",
                "--menuitemsdivider": "#616162",
                "--file-hover": "hsla(0, 0%, 38%, 0.125)",
                "--file-active": "#094771",
                "--file-active-hover": "rgba(9, 71, 113, 0.827)",
                "--file-active-border": "#007fd4",
                "--file-errorcount": "rgb(224, 93, 93)",
                "--inplace-editor": "blue",
                "--contextmenu-background": "#3c3c3c",
                "--contextmenu-color": "rgb(212,212,212)",
                "--contextmenu-hover-background": "#094771",
                "--contextmenu-hover-color": "#ffffff",
                "--error-filename": "#2a709e",
                "--error-line-ative": "#094771",
                "--error-line-hover": "rgba(96, 96, 96, 0.125)",
                "--error-position": "#c0802d",
                "--linecolumn": "#14c714",
                "--reveal-error": "rgba(253, 101, 101, 0.745)",
                "--reveal-method": "#2b2b7d2f",
                "--reveal-errorline-background": "red",
                "--reveal-error-whole-line": "rgba(255, 0, 0, 0.555)",
                "--reveal-programpointer": "rgba(111, 214, 27, 0.337)",
                "--reveal-syntaxelement": "rgba(122, 122, 122, 0.61)",
                "--margin-breakpoint": "rgba(255, 0, 0, 0.623)",
                "--speedcontrol-bar": "#9d9d9d",
                "--speedcontrol-grip": "#588555",
                "--speedcontrol-grip-hover": "#89d185",
                "--speedcontrol-display-background": "#383838",
                "--speedcontrol-display-border": "#9d9d9d",
                "--editorTooltip-background": "#252526",
                "--editorTooltip-border": "#454545",

                "--renameInput-color": "#ffffff",

                //bottomDiv
                "--bottomdiv-tabheading-hover": "white",
                "--bottomdiv-tabheading-active": "rgb(97,97,255)",
                "--noErrorMessage": "rgb(37, 211, 37)",
                "--console-top-borderbottom": "#c4c4c4",
                "--console-top-background": "#1e1e1e",
                "--consoleEntry-withBorder": "#303030",
                "--consoleEntryValue": "white",
                "--consoleEntryIdentifier": "rgb(156, 156, 235)",
                "--consoleEntryNoValue": "gray",
                "--consoleEntryCaption": "white",
                "--error-Caption": "rgb(166, 165, 176)",
                "--console-error": "rgb(155, 51, 51)",

                // Debugger
                "--deIdentifier": "rgb(156, 156, 235)",
                "--deValue": "white",

                // Helper
                "--helper-background-color": "#383838",
                "--helper-border-color": "#d4d4d4",
                "--arrowBoxButtonOuter-background": "#59a15d",
                "--arrowBoxButtonOuter-border": "#3d3d3d",
                "--arrowBoxButtonOuter-color": "black",
                "--arrowBoxButtonOuter-button-hover": "#63a867",
                "--arrowBox-after": "rgba(136, 183, 213, 0)",
                "--arrowBox-before": "rgba(194, 225, 245, 0)",

                //run
                "--defaultOutputColor": "#ffffff",
                "--runInputColor": "#ffffff",
                "--runBackgroundColor": "rgba(255, 255, 255, 0.2)",

            }
        });

        let highlightColor = "#8080ff";

        this.themes.push({
            name: "light",
            monacoTheme: "myCustomThemeLight",
            cssColors: {
                "--defaultPrintColor": "#000000",
                "--backgroundDark": "white",
                "--backgroundLight": "#f3f3f3",
                "--backgroundHeading": "#dcdcdc",
                "--backgroundSelected": "#e8e8e8",
                "--fontColorNormal": "#000",
                "--fontColorLight": "#303030",
                "--slider": "#b0b0b0",
                "--loginButtonBackgrond": "#59a15d",
                "--loginButtonFontColor": "#000000",
                "--loginMessageColor": "rgb(122, 48, 48)",
                "--loginButtonHover": "#63a867",
                "--loginButtonActive": "#94ffd1",
                "--scrollbar": "#e3e3e3",
                "--scrollbar-thumb": "#bababa",
                "--scrollbar-thumb-hover": "#8e8e8e",
                "--scrollbar-thumb-active": "#616161",
                "--submenu-hover": highlightColor,
                "--submenu-color": "#ffffff",
                "--menuitemsdivider": "#cfcfcf",
                "--file-hover": "#e8e8e8",
                "--file-active": "rgba(171, 231, 255, 0.74)",
                "--file-active-hover": "rgba(203, 212, 253, 0.61)",
                "--file-active-border": "rgba(76, 204, 255, 0.74)",
                "--file-errorcount": "red",
                "--inplace-editor": "white",
                "--contextmenu-background": "white",
                "--contextmenu-color": "#756161",
                "--contextmenu-hover-background": highlightColor,
                "--contextmenu-hover-color": "#a0a0ff",
                "--error-filename": "#ff0000",
                "--error-line-ative": "#ffa0a0",
                "--error-line-hover": "#ffc0c0",
                "--error-position": "#804040",
                "--linecolumn": "#14c714", // TODO
                "--reveal-error": "rgba(253, 101, 101, 0.745)",
                "--reveal-method": "#babaec80",
                "--reveal-errorline-background": "red",
                "--reveal-error-whole-line": "rgba(255, 0, 0, 0.555)",
                "--reveal-programpointer": "rgba(111, 214, 27, 0.337)",
                "--reveal-syntaxelement": "rgba(244, 255, 96, 0.61)",
                "--margin-breakpoint": "rgba(255, 0, 0, 0.623)",
                "--speedcontrol-bar": "#9d9d9d",
                "--speedcontrol-grip": "#588555",
                "--speedcontrol-grip-hover": "#89d185",
                "--speedcontrol-display-background": "#e0e0e0",
                "--speedcontrol-display-border": "#9d9d9d",
                "--editorTooltip-background": "#e0e0e0",
                "--editorTooltip-border": "#9d9d9d",

                "--renameInput-color": "#000000",


                //bottomDiv
                "--bottomdiv-tabheading-hover": "#424242",
                "--bottomdiv-tabheading-active": "#424242",
                "--noErrorMessage": "rgb(17, 180, 17)",
                "--console-top-borderbottom": "#c4c4c4",
                "--console-top-background": "white",
                "--consoleEntry-withBorder": "#303030",
                "--consoleEntryValue": "#0000a0",
                "--consoleEntryIdentifier": "black",
                "--consoleEntryNoValue": "gray",
                "--consoleEntryCaption": "#756161",
                "--error-Caption": "rgb(166, 165, 176)",
                "--console-error": "rgb(155, 21, 21)",

                // Debugger
                "--deIdentifier": "black",
                "--deValue": "#0000a0",

                // Helper
                "--helper-background-color": "#f3f3f3",
                "--helper-border-color": "#606060",
                "--arrowBoxButtonOuter-background": "#59a15d",
                "--arrowBoxButtonOuter-border": "#3d3d3d",
                "--arrowBoxButtonOuter-color": "black",
                "--arrowBoxButtonOuter-button-hover": "#63a867",
                "--arrowBox-after": "rgba(136, 183, 213, 0)",
                "--arrowBox-before": "rgba(194, 225, 245, 0)",

                //run
                "--defaultOutputColor": "#303030",
                "--runInputColor": "#000000",
                "--runBackgroundColor": "rgba(0, 0, 0, 0.2)",

            }
        });



    }

    initEditorThemes(){
        monaco.editor.defineTheme('myCustomThemeDark', {
            base: 'vs-dark', // can also be vs-dark or hc-black
            inherit: true, // can also be false to completely replace the builtin rules
            rules: [
                { token: 'method', foreground: 'dcdcaa', fontStyle: 'italic' },
                { token: 'print', foreground: 'dcdcaa', fontStyle: 'italic bold' },
                { token: 'class', foreground: '3DC9B0' },
                { token: 'number', foreground: 'b5cea8' },
                { token: 'type', foreground: '499cd6' },
                { token: 'identifier', foreground: '9cdcfe' },
                { token: 'statement', foreground: 'bb96c0', fontStyle: 'bold' },
                { token: 'keyword', foreground: '68bed4', fontStyle: 'bold' },
                { token: 'string3', foreground: 'ff0000' },

                // { token: 'comment.js', foreground: '008800', fontStyle: 'bold italic underline' },

                // semantic tokens:
                {token: 'property', foreground: 'ffffff' ,fontStyle: 'bold'},
            ],
            colors: {
                "editor.background": "#1e1e1e",
                "jo_highlightMethod": "#2b2b7d"
            }
        });

        monaco.editor.defineTheme('myCustomThemeLight', {
            base: 'vs', // can also be vs-dark or hc-black
            inherit: true, // can also be false to completely replace the builtin rules
            rules: [
                { token: 'method', foreground: '694E16', fontStyle: 'italic bold' },
                { token: 'print', foreground: '811f3f', fontStyle: 'italic bold' },
                { token: 'class', foreground: 'a03030' },
                { token: 'number', foreground: '404040' },
                { token: 'type', foreground: '0000ff', fontStyle: 'bold' },
                { token: 'identifier', foreground: '001080' },
                { token: 'statement', foreground: '8000e0', fontStyle: 'bold' },
                { token: 'keyword', foreground: '00a000', fontStyle: 'bold' },
                { token: 'comment', foreground: '808080', fontStyle: 'italic' },
            ],
            colors: {
                "editor.background": "#FFFFFF",
                "editor.foreground": "#000000",
                "editor.inactiveSelectionBackground": "#E5EBF1",
                "editorIndentGuide.background": "#D3D3D3",
                "editorIndentGuide.activeBackground": "#939393",
                "editor.selectionHighlightBackground": "#ADD6FF80",
                "editorSuggestWidget.background": "#F3F3F3",
                "activityBarBadge.background": "#007ACC",
                "sideBarTitle.foreground": "#6F6F6F",
                "list.hoverBackground": "#E8E8E8",
                "input.placeholderForeground": "#767676",
                "searchEditor.textInputBorder": "#CECECE",
                "settings.textInputBorder": "#CECECE",
                "settings.numberInputBorder": "#CECECE",
                "statusBarItem.remoteForeground": "#FFF",
                "statusBarItem.remoteBackground": "#16825D",
                "jo_highlightMethod": "#babaec"
            }
        });

    }


}