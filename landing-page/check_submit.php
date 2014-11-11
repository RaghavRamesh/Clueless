<?php
	include_once('db_config.php');
	$email = $_POST['email'];
	$checkForExistingEmail = "SELECT * FROM driffleskii_.registered_users WHERE email = '$email'";
	$existingEmailResult = $mysqli->query($checkForExistingEmail);
	$count = $existingEmailResult->num_rows;

    $msg = "";
    if(!isset($_POST['email'])) {
        $msg = "";
    }

    if ($count == 1) {
    	$msg = "You have already registered to clueless.sg! Do watch this space frequently for latest updates from us. ";
    } else if ($count == 0) {
    	if ($_POST) {
    		$insertNewUserToDatabase = "INSERT INTO driffleskii_.registered_users(email) VALUES ('$email');";
    		$insertQueryResult = $mysqli->query($insertNewUserToDatabase);
    		if ($insertQueryResult) {
    			$msg = "Thank you for registering to clueless.sg! Do watch this space frequently for latest updates from us. ";	
 				
				$subject = 'Clueless Registration Confirmation';
				//$message = 'Thank you for registering to clueless.sg, we will mail you with our latest updates! Meanwhile please help us serve you better by filling out this short survey. <link>';

                $body = "<html>\n"; 
                $body .= "<body style=\"font-family:Verdana, Verdana, Geneva, sans-serif; font-size:12px;\">\n"; 
                $body = "Hello! <br/><br/>
                Congratulations on taking the first step towards figuring your career out!<br/>
                There are a few things you can do to make the most of your time.<br/><br/>
                Firstly, whenever you get an email from me, open it, so you can make sure you see every opportunity there is out there for you!<br/>
                Secondly, if you haven't filled out our survey yet, do so <a href='https://clueless.typeform.com/to/dOK3YS'>here</a>, so we know exactly what you want out of these internships and how we can benefit you better.<br/><br/>
                I don't like reading long emails, so I won't write them either. Ever. =)
                <br/><br/>
                Hoping you can stop being Clueless!<br/><br/>
                Cheers, <br/>
                Manasa <br/>
                <a href='www.clueless.sg'>www.clueless.sg</a>"; 
                $body .= "</body>\n"; 
                $body .= "</html>\n";

				$headers = 'From: Clueless' . "\r\n";
                $headers .= 'MIME-Version: 1.0' . "\r\n"; 
                $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; 
				$sendMail = mail($email, $subject, $body, $headers);

 				// include_once('mailer.php');

    		} else {
    			$msg = "Please enter your details again or try again later.";
    		}
    		
    	}
    }
?>