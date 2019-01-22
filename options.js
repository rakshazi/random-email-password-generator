function save_options() {
    chrome.storage.sync.set({
        domain: document.getElementById('domain').value,
        passwordLength: document.getElementById('password_length').value,
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        domain: 'gmail.com',
        passwordLength: 12
    }, function(items) {
        document.getElementById('domain').value = items.domain;
        document.getElementById('password_length').value = items.passwordLength;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
