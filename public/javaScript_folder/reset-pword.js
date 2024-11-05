$(document).ready(function() {
    // Handle form submission with AJAX
    $('#resetPasswordForm').on('submit', function(e) {
        e.preventDefault();
        
        // Validate the password before proceeding with AJAX request
        if (!validatePassword() || !validateConfirmPassword()) {
            return;  // Do not submit if validation fails
        }
        
        // Proceed with AJAX submission
        $.ajax({
            url: '/reset-password',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                // Update modal for success
                $('#modalMessage').text('Password has been reset successfully.');
                $('#modalIcon i').removeClass().addClass('fas fa-check');
                
                // Remove "OK" button if it exists and add "Continue to login"
                $('#okButton').remove();
                if ($('#continueButton').length === 0) {
                    $('#modalContent').append('<button id="continueButton">Continue to login</button>');
                }

                // Display the modal
                $('.modal').css('display', 'block');
                
                // Redirect to login page when "Continue to login" button is clicked
                $('#continueButton').on('click', function() {
                    window.location.href = '/login';
                });
            },
            error: function(xhr) {
                // Update modal for error
                $('#modalMessage').text(xhr.responseJSON.message || 'An error occurred. Please try again.');
                $('#modalIcon i').removeClass().addClass('fas fa-exclamation-circle');

                // Remove "Continue to login" button if it exists and add "OK" button
                $('#continueButton').remove();
                if ($('#okButton').length === 0) {
                    $('#modalContent').append('<button id="okButton">OK</button>');
                }

                // Display the modal
                $('.modal').css('display', 'block');

                // Close the modal when "OK" button is clicked
                $('#okButton').on('click', function() {
                    $('.modal').css('display', 'none');
                });
            }
        });
    });

    // Password validation functions
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    function validatePassword() {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!regex.test(password.value)) {
            passwordError.textContent = 'Password must be at least 8 characters long and contain both letters and numbers.';
            return false;
        }
        passwordError.textContent = '';
        return true;
    }

    function validateConfirmPassword() {
        if (password.value !== confirmPassword.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            return false;
        }
        confirmPasswordError.textContent = '';
        return true;
    }

    // Add input event listeners for validation
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);
});
