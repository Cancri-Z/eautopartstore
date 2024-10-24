document.addEventListener('DOMContentLoaded', function() {
    const notificationCountElement = document.getElementById('notificationCount');
    const toggleNotificationCountElement = document.getElementById('toggleNotificationCount');

    // Fetch unread notification count
    fetch('/api/notifications/unread-count')
        .then(response => response.json())
        .then(data => {
            const unreadCount = data.unreadCount;

            if (unreadCount > 0) {
                // Update the notification icon count
                notificationCountElement.textContent = unreadCount;
                notificationCountElement.style.display = 'inline-block';

                // Update the toggle bar notification count
                toggleNotificationCountElement.textContent = unreadCount;
                toggleNotificationCountElement.style.display = 'inline-block';
            } else {
                notificationCountElement.style.display = 'none';
                toggleNotificationCountElement.style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error));
});
