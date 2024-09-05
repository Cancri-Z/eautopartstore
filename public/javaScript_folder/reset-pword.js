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
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message
                    }).then(() => {
                        window.location.href = '/login';
                    });
                },
                error: function(xhr) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: xhr.responseJSON.message || 'An error occurred'
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
