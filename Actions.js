const ACTIONS= {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED : 'disconnected',
    CODE_CHANGE : 'code-change',
    SYNC_CODE : 'sync-code',
    LEAVE: 'leave',
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ACTIONS;
}
export default ACTIONS;

// Add this for CommonJS compatibility
