<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>	
</head>

<body class="dashboard--app">
	<?php require('_header.php') ?>
	<script src="min.js"></script>

	<section>
		<article id="dashboard">
			<h3>Dashboard</h3>
		</article>
	</section>

	<script>
		document.addEventListener('DOMContentLoaded', function () {
			require(['shielded'], function (d) {  
				d.Dashboard( document.getElementById('dashboard') ) 
			});
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>