// Fixed rooms exports - wait for rooms.js to load first
document.addEventListener('DOMContentLoaded', () => {
    // Ensure rooms.js has loaded by checking if rooms exists
    if (typeof rooms !== 'undefined') {
        console.log('✅ Room exports initialized - rooms available');
    } else {
        console.warn('⚠️ Rooms not loaded yet, waiting...');
        // Try again after a short delay
        setTimeout(() => {
            if (typeof rooms !== 'undefined') {
                console.log('✅ Room exports initialized (delayed)');
            } else {
                console.error('❌ Rooms failed to load');
            }
        }, 100);
    }
});
