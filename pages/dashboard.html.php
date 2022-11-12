<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>	
</head>

<body class="dashboard--app">
	<?php require('_header.php') ?>

	<main>
		<section>
			<article id="dashboard">
				<h3>Dashboard</h3>
			</article>
		</section>
	</main>

	<script>
		document.addEventListener('DOMContentLoaded', function () {
			shielded.Dashboard( document.getElementById('dashboard') ) 
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>
