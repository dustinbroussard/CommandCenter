(function (root) {
    const EXPORT_TYPE = 'commandcenter.export';
    const EXPORT_VERSION = 3;

    function getRandomUUID() {
        if (root.crypto && typeof root.crypto.randomUUID === 'function') {
            return root.crypto.randomUUID();
        }
        try {
            const nodeCrypto = require('crypto');
            if (nodeCrypto && typeof nodeCrypto.randomUUID === 'function') {
                return nodeCrypto.randomUUID();
            }
        } catch (err) {
            // ignore - best effort fallback below
        }
        return `cc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }

    function normalizeDateToIso(value, fallbackIso) {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
            return date.toISOString();
        }
        return fallbackIso;
    }

    function normalizeTags(tags) {
        if (!Array.isArray(tags)) {
            return [];
        }
        return tags
            .map(tag => String(tag).trim().toLowerCase())
            .filter(Boolean);
    }

    function createPreviewFromContent(content) {
        const collapsed = String(content || '').replace(/\s+/g, ' ').trim();
        return collapsed.slice(0, 140);
    }

    function normalizeCommand(raw) {
        const idRaw = raw && raw.id;
        let id = '';
        if (idRaw === null || idRaw === undefined || idRaw === '') {
            id = getRandomUUID();
        } else if (typeof idRaw === 'number') {
            id = String(idRaw);
        } else {
            id = String(idRaw);
        }

        const title = raw && raw.title !== undefined ? String(raw.title) : '';
        const content = raw && raw.content !== undefined ? String(raw.content) : '';
        const preview = raw && typeof raw.preview === 'string' && raw.preview.trim()
            ? raw.preview
            : createPreviewFromContent(content);

        const createdAtFallback = new Date().toISOString();
        const createdAt = normalizeDateToIso(raw && raw.createdAt, createdAtFallback);

        let lastUsed = null;
        if (raw && raw.lastUsed !== undefined && raw.lastUsed !== null && raw.lastUsed !== '') {
            const lastUsedIso = normalizeDateToIso(raw.lastUsed, null);
            if (lastUsedIso) {
                lastUsed = lastUsedIso;
            }
        }

        const useCount = raw && typeof raw.useCount === 'number' && Number.isFinite(raw.useCount)
            ? raw.useCount
            : 0;

        return {
            id,
            title,
            preview,
            content,
            tags: normalizeTags(raw && raw.tags),
            createdAt,
            lastUsed,
            useCount
        };
    }

    function normalizeImportedData(json) {
        if (Array.isArray(json)) {
            const commands = json.map(normalizeCommand);
            return { commands, prompts: commands };
        }
        if (!json || typeof json !== 'object') {
            throw new Error('Invalid file format');
        }
        if (json.type !== EXPORT_TYPE) {
            throw new Error('Invalid file format');
        }
        const isSupportedVersion = json.version === 2 || json.version === 3;
        const rawCommands = Array.isArray(json.commands) ? json.commands : json.prompts;
        if (!isSupportedVersion || !Array.isArray(rawCommands)) {
            throw new Error('Invalid file format');
        }
        const commands = rawCommands.map(normalizeCommand);
        return {
            commands,
            prompts: commands,
            settings: json.settings
        };
    }

    function applyImport(existingCommands, incomingCommands, mode) {
        const normalizedMode = mode || 'replace';
        if (normalizedMode === 'replace') {
            return incomingCommands.slice();
        }

        const next = existingCommands.slice();
        const indexById = new Map();
        next.forEach((command, index) => {
            indexById.set(command.id, index);
        });

        incomingCommands.forEach(command => {
            const existingIndex = indexById.get(command.id);
            if (existingIndex === undefined) {
                indexById.set(command.id, next.length);
                next.push(command);
                return;
            }
            if (normalizedMode === 'overwrite') {
                next[existingIndex] = command;
            }
        });

        return next;
    }

    function createExportBundle(commands, settings) {
        const normalizedCommands = (commands || []).map(normalizeCommand);
        const bundle = {
            type: EXPORT_TYPE,
            version: EXPORT_VERSION,
            commands: normalizedCommands,
            // Keep legacy key for backward compatibility with old importers.
            prompts: normalizedCommands
        };
        if (settings !== undefined) {
            bundle.settings = settings;
        }
        return bundle;
    }

    const api = {
        EXPORT_TYPE,
        EXPORT_VERSION,
        normalizeImportedData,
        normalizeCommand,
        normalizePrompt: normalizeCommand,
        applyImport,
        createExportBundle
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        root.CommandCenterImportExport = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window);
