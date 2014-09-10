<html>
<?php include './check_submit.php'; ?>  
<body>
	<form action="" method="post">
		Email: <input type="email" name="email" id="email" />
		<button name="submit" id="submit">Submit</button>
		<label name="feedback" id="feedback"><?php echo $msg ?></label>
	</form>
</body>
</html>