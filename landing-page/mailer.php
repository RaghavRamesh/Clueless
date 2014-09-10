<?php
	$to = 'nuskarthik@gmail.com';
	$subject = 'Clueless Autoresponse Email';
	$body = "<html>\n"; 
    $body .= "<body style=\"font-family:Verdana, Verdana, Geneva, sans-serif; font-size:12px;\">\n"; 
    $body = "Hey Smartypants,<br/><br/>
Congratulations on taking the first step towards figuring your career out!<br/><br/>
There are a few things I'll need you to take if you want to succeed and make the most of your time.<br/><br/>
Firstly, whenever you get an email from me, open it, so you can make sure you see every opportunity there is out there for you!<br/><br/>
Secondly, if you haven't filled out our <a href='https://clueless.typeform.com/to/dOK3YS'>survey</a> yet, do so <a href='https://clueless.typeform.com/to/dOK3YS'>here</a>, so we know exactly what you want out of these internships and how we can benefit you better.<br/><br/>
I don't like reading long emails, so I won't write them either. Ever. :)
<br/><br/>
Hoping you can stop being Clueless,<br/>
Manasa"; 
    $body .= "</body>\n"; 
    $body .= "</html>\n";

	$headers = 'from: Clueless';
	$headers .= "Reply-To: driffleskii@gmail.com\r\n"; 
    $headers .= "Return-Path: driffleskii@gmail.com\r\n"; 
    $headers .= "X-Mailer: Drupal\n"; 
    $headers .= 'MIME-Version: 1.0' . "\n"; 
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; 

	$sendMail = mail($to, $subject, $body, $headers);
?>