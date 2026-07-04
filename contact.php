<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Function to send email using raw SMTP sockets (No external libraries required)
function send_smtp_mail($to, $subject, $message_body, $reply_to_email) {
    // Credentials from your appsettings.json
    $host = 'smtp.gmail.com';
    $port = 587;
    $username = 'adtmomo2@gmail.com'; // From AuthenticationEmail.Email
    $password = 'fuyifzggoawsxswy';   // From AuthenticationEmail.Password

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    // Connect to the SMTP server
    $socket = stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) return false;

    stream_set_timeout($socket, 15);
    
    // Helper function to read SMTP responses
    function get_res($socket) {
        $data = "";
        while($str = fgets($socket, 515)) {
            $data .= $str;
            if(substr($str, 3, 1) == " ") { break; }
        }
        return $data;
    }

    get_res($socket); // Initial connection message
    
    fputs($socket, "EHLO {$host}\r\n"); get_res($socket);
    fputs($socket, "STARTTLS\r\n"); get_res($socket);
    
    // Upgrade connection to TLS
    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT);

    fputs($socket, "EHLO {$host}\r\n"); get_res($socket);
    fputs($socket, "AUTH LOGIN\r\n"); get_res($socket);
    fputs($socket, base64_encode($username) . "\r\n"); get_res($socket);
    fputs($socket, base64_encode($password) . "\r\n"); get_res($socket);

    fputs($socket, "MAIL FROM: <{$username}>\r\n"); get_res($socket);
    fputs($socket, "RCPT TO: <{$to}>\r\n"); get_res($socket);
    fputs($socket, "DATA\r\n"); get_res($socket);

    // Build the email headers
    $headers = "From: Portfolio Contact <{$username}>\r\n";
    $headers .= "Reply-To: {$reply_to_email}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send headers and body
    fputs($socket, $headers . "\r\n" . $message_body . "\r\n.\r\n");
    $data_res = get_res($socket); // Check if email was accepted (250 OK)
    
    fputs($socket, "QUIT\r\n"); get_res($socket);
    fclose($socket);
    
    return strpos($data_res, '250') !== false;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    
    $hr_name = isset($_POST["hr_name"]) ? strip_tags(trim($_POST["hr_name"])) : "N/A";
    $company_name = isset($_POST["company_name"]) ? strip_tags(trim($_POST["company_name"])) : "N/A";
    
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);

    // Check that data was sent to the mailer
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Oops! There was a problem with your submission. Please complete the form and try again.";
        exit;
    }

    // Set the recipient email address
    $recipient = "saraswathandev@gmail.com"; 

    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "HR Name: $hr_name\n";
    $email_content .= "Company Name: $company_name\n\n";
    $email_content .= "Subject: $subject\n\n";
    $email_content .= "Message:\n$message\n";

    // Send the email using the SMTP function
    if (send_smtp_mail($recipient, "Portfolio Contact - $name", $email_content, $email)) {
        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
