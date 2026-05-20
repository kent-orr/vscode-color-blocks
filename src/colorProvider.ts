import * as vscode from 'vscode';
import { CommentConfigHandler } from './commentConfigHandler';
import { colorBlockRegex } from './helpers/colorBlockRegex';
import { arrAdd } from './helpers/miscHelpers';
import { hexToRgb01, rgb01ToHex } from './helpers/colorHelpers';

export class ColorBlockColorProvider implements vscode.DocumentColorProvider {
    constructor(private commentConfigHandler: CommentConfigHandler) {}

    provideDocumentColors(document: vscode.TextDocument): vscode.ColorInformation[] {
        this.commentConfigHandler.updateCurrentConfig(document.languageId);
        const comments = this.commentConfigHandler.getComments(document);
        const result: vscode.ColorInformation[] = [];

        for (const comment of comments) {
            const match = colorBlockRegex.exec(comment.content);
            if (!match || !match.groups?.color.startsWith('#')) continue;

            const matchOffset = comment.range[0] + comment.startDelimiter.length;
            const [start, end] = arrAdd(match.indices!.groups!.color, matchOffset);

            const [r, g, b] = hexToRgb01(match.groups.color);
            result.push(new vscode.ColorInformation(
                new vscode.Range(document.positionAt(start), document.positionAt(end)),
                new vscode.Color(r, g, b, 1)
            ));
        }

        return result;
    }

    provideColorPresentations(color: vscode.Color): vscode.ColorPresentation[] {
        return [new vscode.ColorPresentation(rgb01ToHex(color.red, color.green, color.blue))];
    }
}
