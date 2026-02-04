import { nanoid } from 'nanoid';

/**
 * FlexiSite Analytics Tracker
 * Handles event capture, buffering, and transmission to the analytics pipe.
 */
class AnalyticsTracker {
    constructor() {
        this.buffer = [];
        this.maxBufferSize = 10;
        this.sessionId = nanoid(10);
        this.tenantId = 'default_tenant';
    }

    setTenant(id) {
        this.tenantId = id;
    }

    /**
     * Capture an atomic event
     */
    track(type, data = {}) {
        const event = {
            eventId: nanoid(8),
            type,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            tenantId: this.tenantId,
            ...data
        };

        console.log(`[Analytics] Captured ${type}:`, event);
        
        this.buffer.push(event);

        if (this.buffer.length >= this.maxBufferSize) {
            this.flush();
        }
    }

    /**
     * Send buffered events to the management layer
     */
    flush() {
        if (this.buffer.length === 0) return;

        const payload = [...this.buffer];
        this.buffer = [];

        // Simulated Network Call
        // In production: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(payload) });
        console.group('[Analytics] Flushing Buffer');
        console.table(payload);
        console.groupEnd();
    }

    // --- Specialized Trackers ---

    trackPageView(pageId, slug) {
        this.track('view', { pageId, metadata: { path: slug } });
    }

    trackClick(nodeId, type) {
        this.track('click', { nodeId, metadata: { componentType: type } });
    }

    trackFormSubmit(nodeId, formData) {
        this.track('submit', { 
            nodeId, 
            metadata: { 
                fieldCount: Object.keys(formData).length 
            } 
        });
    }
}

export const tracker = new AnalyticsTracker();
